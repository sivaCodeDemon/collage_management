package com.college.cms.student.dto;

import lombok.*;
import java.time.Instant;
import java.time.LocalDate;

public class StudentDto {

    @Data
    public static class CreateRequest {
        @jakarta.validation.constraints.NotBlank
        private String firstName;
        @jakarta.validation.constraints.NotBlank
        private String lastName;
        @jakarta.validation.constraints.NotBlank
        @jakarta.validation.constraints.Email
        private String email;
        @jakarta.validation.constraints.NotBlank
        @jakarta.validation.constraints.Size(min = 8)
        private String password;
        private String phone;
        @jakarta.validation.constraints.NotNull
        private Long departmentId;
        private Long courseId;
        private Integer currentSemester;
        private String section;
        @jakarta.validation.constraints.NotNull
        private LocalDate admissionDate;
        private LocalDate dateOfBirth;
        private String gender;
        private String bloodGroup;
        private String address;
        private String city;
        private String state;
        private String pincode;
        private String guardianName;
        private String guardianPhone;
        private String guardianRelation;
    }

    @Data
    public static class UpdateRequest {
        @jakarta.validation.constraints.NotBlank
        private String firstName;
        @jakarta.validation.constraints.NotBlank
        private String lastName;
        private String phone;
        private Long departmentId;
        private Long courseId;
        private Integer currentSemester;
        private String section;
        private LocalDate dateOfBirth;
        private String gender;
        private String bloodGroup;
        private String address;
        private String city;
        private String state;
        private String pincode;
        private String guardianName;
        private String guardianPhone;
        private String guardianRelation;
        private String status;
    }

    @Data
    @Builder
    public static class Response {
        private Long id;
        private String studentId;
        private Long userId;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String profileImageUrl;
        private Long departmentId;
        private String departmentName;
        private String departmentCode;
        private Long courseId;
        private String courseName;
        private Integer currentSemester;
        private String section;
        private LocalDate admissionDate;
        private LocalDate dateOfBirth;
        private String gender;
        private String bloodGroup;
        private String address;
        private String city;
        private String state;
        private String country;
        private String pincode;
        private String guardianName;
        private String guardianPhone;
        private String guardianRelation;
        private String status;
        private Instant createdAt;
        private Instant updatedAt;
    }

    @Data
    @Builder
    public static class Summary {
        private Long id;
        private String studentId;
        private String firstName;
        private String lastName;
        private String email;
        private String departmentName;
        private String courseName;
        private Integer currentSemester;
        private String section;
        private String status;
    }
}
