package com.college.cms.professor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;

public class ProfessorDto {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String firstName;
        @NotBlank
        private String lastName;
        @NotBlank
        @Email
        private String email;
        private String phone;
        private Long departmentId;
        private String designation;
        private String qualification;
        private String specialization;
        private Integer experienceYears;
        private LocalDate dateOfBirth;
        private String gender;
        private LocalDate joiningDate;
        private String address;
    }

    @Data
    public static class UpdateRequest {
        private String firstName;
        private String lastName;
        private String phone;
        private Long departmentId;
        private String designation;
        private String qualification;
        private String specialization;
        private Integer experienceYears;
        private String address;
        private String status;
    }

    @Data
    public static class Response {
        private Long id;
        private String employeeId;
        private Long userId;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private Long departmentId;
        private String departmentName;
        private String designation;
        private String qualification;
        private String specialization;
        private Integer experienceYears;
        private LocalDate dateOfBirth;
        private String gender;
        private LocalDate joiningDate;
        private String address;
        private String status;
        private Instant createdAt;
    }

    @Data
    public static class SummaryResponse {
        private Long id;
        private String employeeId;
        private String firstName;
        private String lastName;
        private String email;
        private String departmentName;
        private String designation;
        private String status;
    }
}
