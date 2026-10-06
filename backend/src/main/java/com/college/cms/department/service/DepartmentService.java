package com.college.cms.department.service;

import com.college.cms.auth.entity.User;
import com.college.cms.auth.repository.UserRepository;
import com.college.cms.common.exception.BusinessException;
import com.college.cms.common.exception.DuplicateResourceException;
import com.college.cms.common.exception.ResourceNotFoundException;
import com.college.cms.common.response.PageResponse;
import com.college.cms.department.dto.DepartmentDto;
import com.college.cms.department.entity.Department;
import com.college.cms.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('DEPARTMENT_VIEW')")
    public PageResponse<DepartmentDto.Response> getAllDepartments(String search, Pageable pageable) {
        Page<Department> page;
        if (search != null && !search.isBlank()) {
            page = departmentRepository.searchDepartments(search.trim(), pageable);
        } else {
            page = departmentRepository.findAll(pageable);
        }
        return PageResponse.of(page.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('DEPARTMENT_VIEW')")
    public List<DepartmentDto.Summary> getActiveDepartments() {
        return departmentRepository.findAllByActiveTrue().stream()
                .map(d -> DepartmentDto.Summary.builder()
                        .id(d.getId()).code(d.getCode()).name(d.getName()).active(d.isActive()).build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('DEPARTMENT_VIEW')")
    public DepartmentDto.Response getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));
    }

    @Transactional
    @PreAuthorize("hasAuthority('DEPARTMENT_CREATE')")
    public DepartmentDto.Response createDepartment(DepartmentDto.CreateRequest request) {
        if (departmentRepository.existsByCode(request.getCode().toUpperCase())) {
            throw new DuplicateResourceException("Department", "code", request.getCode());
        }

        Department.DepartmentBuilder builder = Department.builder()
                .code(request.getCode().toUpperCase())
                .name(request.getName())
                .description(request.getDescription())
                .establishedDate(request.getEstablishedDate())
                .active(true);

        if (request.getHodId() != null) {
            User hod = userRepository.findById(request.getHodId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", request.getHodId()));
            builder.hod(hod);
        }

        Department saved = departmentRepository.save(builder.build());
        log.info("Department created: {}", saved.getCode());
        return toResponse(saved);
    }

    @Transactional
    @PreAuthorize("hasAuthority('DEPARTMENT_UPDATE')")
    public DepartmentDto.Response updateDepartment(Long id, DepartmentDto.UpdateRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));

        dept.setName(request.getName());
        dept.setDescription(request.getDescription());
        dept.setEstablishedDate(request.getEstablishedDate());
        dept.setActive(request.isActive());

        if (request.getHodId() != null) {
            User hod = userRepository.findById(request.getHodId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", request.getHodId()));
            dept.setHod(hod);
        }

        return toResponse(departmentRepository.save(dept));
    }

    @Transactional
    @PreAuthorize("hasAuthority('DEPARTMENT_DELETE')")
    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));
        dept.setActive(false);
        departmentRepository.save(dept);
        log.info("Department deactivated: {}", dept.getCode());
    }

    private DepartmentDto.Response toResponse(Department d) {
        return DepartmentDto.Response.builder()
                .id(d.getId())
                .code(d.getCode())
                .name(d.getName())
                .description(d.getDescription())
                .hodId(d.getHod() != null ? d.getHod().getId() : null)
                .hodName(d.getHod() != null ? d.getHod().getFullName() : null)
                .establishedDate(d.getEstablishedDate())
                .active(d.isActive())
                .createdAt(d.getCreatedAt())
                .updatedAt(d.getUpdatedAt())
                .build();
    }
}
