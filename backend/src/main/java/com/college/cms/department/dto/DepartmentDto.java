package com.college.cms.department.dto;

import lombok.*;
import java.time.Instant;
import java.time.LocalDate;

public class DepartmentDto {

    @Data
    public static class CreateRequest {
        @jakarta.validation.constraints.NotBlank
        @jakarta.validation.constraints.Size(max = 20)
        private String code;

        @jakarta.validation.constraints.NotBlank
        @jakarta.validation.constraints.Size(max = 100)
        private String name;

        private String description;
        private Long hodId;
        private LocalDate establishedDate;
    }

    @Data
    public static class UpdateRequest {
        @jakarta.validation.constraints.NotBlank
        @jakarta.validation.constraints.Size(max = 100)
        private String name;
        private String description;
        private Long hodId;
        private LocalDate establishedDate;
        private boolean active;
    }

    @Data
    @Builder
    public static class Response {
        private Long id;
        private String code;
        private String name;
        private String description;
        private Long hodId;
        private String hodName;
        private LocalDate establishedDate;
        private boolean active;
        private Instant createdAt;
        private Instant updatedAt;
    }

    @Data
    @Builder
    public static class Summary {
        private Long id;
        private String code;
        private String name;
        private boolean active;
    }
}
