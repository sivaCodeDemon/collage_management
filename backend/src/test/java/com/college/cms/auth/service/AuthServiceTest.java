package com.college.cms.auth.service;

import com.college.cms.auth.dto.AuthResponse;
import com.college.cms.auth.dto.LoginRequest;
import com.college.cms.auth.dto.ResetPasswordRequest;
import com.college.cms.auth.entity.Role;
import com.college.cms.auth.entity.RoleType;
import com.college.cms.auth.entity.User;
import com.college.cms.auth.repository.RefreshTokenRepository;
import com.college.cms.auth.repository.UserRepository;
import com.college.cms.common.exception.BusinessException;
import com.college.cms.security.JwtService;
import com.college.cms.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private UserPrincipal testUserPrincipal;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenExpiration", 604800000L);

        Role role = Role.builder()
                .name(RoleType.STUDENT)
                .description("Student Role")
                .permissions(Set.of())
                .build();

        testUser = User.builder()
                .id(1L)
                .email("student@college.edu")
                .password("encoded_pass")
                .firstName("John")
                .lastName("Doe")
                .enabled(true)
                .roles(Set.of(role))
                .build();

        testUserPrincipal = new UserPrincipal(testUser);
    }

    @Test
    @DisplayName("Should successfully login and return tokens")
    void login_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("student@college.edu");
        request.setPassword("Password123!");

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(testUserPrincipal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail("student@college.edu")).thenReturn(Optional.of(testUser));
        when(jwtService.generateAccessToken(any(UserPrincipal.class))).thenReturn("access-token-xyz");
        when(jwtService.generateRefreshToken(any(UserPrincipal.class))).thenReturn("refresh-token-xyz");
        when(refreshTokenRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse response = authService.login(request);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access-token-xyz");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token-xyz");
        assertThat(response.getUser().getEmail()).isEqualTo("student@college.edu");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception on bad credentials")
    void login_BadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("student@college.edu");
        request.setPassword("WrongPassword");

        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);

        verify(jwtService, never()).generateAccessToken(any());
    }

    @Test
    @DisplayName("Should throw exception when password and confirm password mismatch")
    void resetPassword_PasswordMismatch() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("valid-token");
        request.setNewPassword("Pass123!");
        request.setConfirmPassword("Mismatch123!");

        assertThatThrownBy(() -> authService.resetPassword(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Passwords do not match");
    }

    @Test
    @DisplayName("Should successfully reset password with valid token")
    void resetPassword_Success() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("valid-token");
        request.setNewPassword("NewPass123!");
        request.setConfirmPassword("NewPass123!");

        testUser.setPasswordResetToken("valid-token");
        testUser.setPasswordResetTokenExpiry(Instant.now().plusSeconds(3600));

        when(userRepository.findByPasswordResetToken("valid-token")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("NewPass123!")).thenReturn("new-encoded-pass");

        authService.resetPassword(request);

        assertThat(testUser.getPassword()).isEqualTo("new-encoded-pass");
        assertThat(testUser.getPasswordResetToken()).isNull();
        verify(refreshTokenRepository).revokeAllByUser(testUser);
        verify(userRepository).save(testUser);
    }
}
