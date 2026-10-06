package com.college.cms.professor.controller;

import com.college.cms.common.response.ApiResponse;
import com.college.cms.common.response.PageResponse;
import com.college.cms.professor.dto.ProfessorDto;
import com.college.cms.professor.service.ProfessorService;
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
@RequestMapping("/api/v1/professors")
@RequiredArgsConstructor
@Tag(name = "Professors", description = "Faculty & Professor management endpoints")
public class ProfessorController {

    private final ProfessorService professorService;

    @GetMapping
    @Operation(summary = "Get all professors paginated")
    @PreAuthorize("hasAnyAuthority('PROFESSOR_VIEW', 'ROLE_ADMIN', 'ROLE_PRINCIPAL', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<ProfessorDto.SummaryResponse>>> getAllProfessors(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ProfessorDto.SummaryResponse> page = professorService.getAllProfessors(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(page)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get professor details by ID")
    @PreAuthorize("hasAnyAuthority('PROFESSOR_VIEW', 'ROLE_ADMIN', 'ROLE_PRINCIPAL', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ProfessorDto.Response>> getProfessorById(@PathVariable Long id) {
        ProfessorDto.Response professor = professorService.getProfessorById(id);
        return ResponseEntity.ok(ApiResponse.success(professor));
    }

    @PostMapping
    @Operation(summary = "Create a new faculty professor")
    @PreAuthorize("hasAnyAuthority('PROFESSOR_CREATE', 'ROLE_ADMIN', 'ROLE_PRINCIPAL', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ProfessorDto.Response>> createProfessor(
            @Valid @RequestBody ProfessorDto.CreateRequest request) {
        ProfessorDto.Response created = professorService.createProfessor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Professor registered", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update professor details")
    @PreAuthorize("hasAnyAuthority('PROFESSOR_UPDATE', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ProfessorDto.Response>> updateProfessor(
            @PathVariable Long id,
            @Valid @RequestBody ProfessorDto.UpdateRequest request) {
        ProfessorDto.Response updated = professorService.updateProfessor(id, request);
        return ResponseEntity.ok(ApiResponse.success("Professor updated", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate professor")
    @PreAuthorize("hasAnyAuthority('PROFESSOR_DELETE', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProfessor(@PathVariable Long id) {
        professorService.deleteProfessor(id);
        return ResponseEntity.ok(ApiResponse.success("Professor deactivated", null));
    }
}
