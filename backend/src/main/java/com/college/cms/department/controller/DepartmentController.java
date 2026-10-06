package com.college.cms.department.controller;

import com.college.cms.common.response.ApiResponse;
import com.college.cms.common.response.PageResponse;
import com.college.cms.department.dto.DepartmentDto;
import com.college.cms.department.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@Tag(name = "Departments", description = "Department management APIs")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @Operation(summary = "Get all departments with pagination")
    public ResponseEntity<ApiResponse<PageResponse<DepartmentDto.Response>>> getAllDepartments(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageResponse<DepartmentDto.Response> result = departmentService.getAllDepartments(search, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved successfully", result));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active departments")
    public ResponseEntity<ApiResponse<List<DepartmentDto.Summary>>> getActiveDepartments() {
        return ResponseEntity.ok(ApiResponse.success("Active departments retrieved", departmentService.getActiveDepartments()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<ApiResponse<DepartmentDto.Response>> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Department retrieved successfully", departmentService.getDepartmentById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new department")
    public ResponseEntity<ApiResponse<DepartmentDto.Response>> createDepartment(
            @Valid @RequestBody DepartmentDto.CreateRequest request) {
        DepartmentDto.Response created = departmentService.createDepartment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a department")
    public ResponseEntity<ApiResponse<DepartmentDto.Response>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentDto.UpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully", departmentService.updateDepartment(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate a department")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Department deactivated successfully"));
    }
}
