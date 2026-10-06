package com.college.cms.student.controller;

import com.college.cms.common.response.ApiResponse;
import com.college.cms.common.response.PageResponse;
import com.college.cms.student.dto.StudentDto;
import com.college.cms.student.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Student management APIs")
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @Operation(summary = "Get all students with pagination and search")
    public ResponseEntity<ApiResponse<PageResponse<StudentDto.Summary>>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageResponse<StudentDto.Summary> result = studentService.getAllStudents(search, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student by ID")
    public ResponseEntity<ApiResponse<StudentDto.Response>> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Student retrieved", studentService.getStudentById(id)));
    }

    @GetMapping("/by-student-id/{studentId}")
    @Operation(summary = "Get student by student ID (e.g. STU2024001)")
    public ResponseEntity<ApiResponse<StudentDto.Response>> getStudentByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(ApiResponse.success("Student retrieved", studentService.getStudentByStudentId(studentId)));
    }

    @PostMapping
    @Operation(summary = "Create new student")
    public ResponseEntity<ApiResponse<StudentDto.Response>> createStudent(
            @Valid @RequestBody StudentDto.CreateRequest request) {
        StudentDto.Response created = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update student information")
    public ResponseEntity<ApiResponse<StudentDto.Response>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDto.UpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Student updated", studentService.updateStudent(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate student")
    public ResponseEntity<ApiResponse<Void>> deactivateStudent(@PathVariable Long id) {
        studentService.deactivateStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deactivated successfully"));
    }
}
