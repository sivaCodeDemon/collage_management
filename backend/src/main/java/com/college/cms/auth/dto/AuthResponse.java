package com.college.cms.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String fullName;
        private String profileImageUrl;
        private Set<String> roles;
        private Set<String> permissions;
    }
}
