package com.college.cms.course.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.Instant;

public class CourseDto {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String code;
        @NotBlank
        private String name;
        private String description;
        private Long departmentId;
        private Integer durationYears;
        private Integer totalSemesters;
    }

    @Data
    public static class Response {
        private Long id;
        private String code;
        private String name;
        private String description;
        private Long departmentId;
        private String departmentName;
        private Integer durationYears;
        private Integer totalSemesters;
        private boolean active;
        private Instant createdAt;
    }
}
