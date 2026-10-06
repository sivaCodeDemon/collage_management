package com.college.cms.auth.service;

import com.college.cms.auth.dto.*;
import com.college.cms.auth.entity.RefreshToken;
import com.college.cms.auth.entity.User;
import com.college.cms.auth.repository.RefreshTokenRepository;
import com.college.cms.auth.repository.UserRepository;
import com.college.cms.common.exception.BusinessException;
import com.college.cms.common.exception.ResourceNotFoundException;
import com.college.cms.security.JwtService;
import com.college.cms.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        // Update last login
        userRepository.findByEmail(userPrincipal.getEmail()).ifPresent(user -> {
            user.setLastLogin(Instant.now());
            user.setFailedAttempts(0);
            userRepository.save(user);
        });

        String accessToken = jwtService.generateAccessToken(userPrincipal);
        String refreshTokenStr = createRefreshToken(userPrincipal);

        log.info("User logged in: {}", userPrincipal.getEmail());

        return buildAuthResponse(userPrincipal, accessToken, refreshTokenStr);
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
            .orElseThrow(() -> new BusinessException("Invalid refresh token"));

        if (refreshToken.isRevoked()) {
            throw new BusinessException("Refresh token has been revoked");
        }

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new BusinessException("Refresh token has expired. Please login again.");
        }

        User user = refreshToken.getUser();
        if (!user.isEnabled()) {
            throw new BusinessException("Account is disabled");
        }

        UserPrincipal userPrincipal = new UserPrincipal(user);
        String newAccessToken = jwtService.generateAccessToken(userPrincipal);

        // Rotate refresh token
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        String newRefreshToken = createRefreshToken(userPrincipal);

        return buildAuthResponse(userPrincipal, newAccessToken, newRefreshToken);
    }

    @Transactional
    public void logout(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        refreshTokenRepository.revokeAllByUser(user);
        log.info("User logged out: {}", user.getEmail());
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setPasswordResetToken(token);
            user.setPasswordResetTokenExpiry(Instant.now().plusSeconds(3600)); // 1 hour
            userRepository.save(user);
            // TODO: Send email with reset link
            log.info("Password reset token generated for: {}", request.getEmail());
        });
        // Always return success to prevent email enumeration
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("Passwords do not match");
        }

        User user = userRepository.findByPasswordResetToken(request.getToken())
            .orElseThrow(() -> new BusinessException("Invalid or expired reset token"));

        if (user.getPasswordResetTokenExpiry().isBefore(Instant.now())) {
            throw new BusinessException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        refreshTokenRepository.revokeAllByUser(user);
        userRepository.save(user);
        log.info("Password reset for user: {}", user.getEmail());
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("New passwords do not match");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", user.getEmail());
    }

    private String createRefreshToken(UserPrincipal userPrincipal) {
        User user = userRepository.findByEmail(userPrincipal.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", userPrincipal.getEmail()));

        String tokenStr = jwtService.generateRefreshToken(userPrincipal);

        RefreshToken refreshToken = RefreshToken.builder()
            .token(tokenStr)
            .user(user)
            .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
            .build();

        return refreshTokenRepository.save(refreshToken).getToken();
    }

    private AuthResponse buildAuthResponse(UserPrincipal userPrincipal, String accessToken, String refreshToken) {
        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(900L)
            .user(AuthResponse.UserInfo.builder()
                .id(userPrincipal.getId())
                .email(userPrincipal.getEmail())
                .firstName(userPrincipal.getFirstName())
                .lastName(userPrincipal.getLastName())
                .fullName(userPrincipal.getFullName())
                .roles(userPrincipal.getRoles())
                .permissions(userPrincipal.getPermissions())
                .build())
            .build();
    }
}
