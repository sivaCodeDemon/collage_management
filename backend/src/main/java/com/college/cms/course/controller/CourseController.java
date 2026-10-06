package com.college.cms.course.controller;

import com.college.cms.common.response.ApiResponse;
import com.college.cms.common.response.PageResponse;
import com.college.cms.course.dto.CourseDto;
import com.college.cms.course.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Course and degree program management endpoints")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "Get all courses paginated")
    public ResponseEntity<ApiResponse<PageResponse<CourseDto.Response>>> getAllCourses(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<CourseDto.Response> page = courseService.getAllCourses(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course by ID")
    public ResponseEntity<ApiResponse<CourseDto.Response>> getCourseById(@PathVariable Long id) {
        CourseDto.Response course = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @PostMapping
    @Operation(summary = "Create course degree program")
    @PreAuthorize("hasAnyAuthority('COURSE_CREATE', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<CourseDto.Response>> createCourse(
            @Valid @RequestBody CourseDto.CreateRequest request) {
        CourseDto.Response created = courseService.createCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Course created", created));
    }
}
