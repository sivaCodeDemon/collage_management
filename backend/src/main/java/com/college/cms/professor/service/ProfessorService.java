package com.college.cms.professor.service;

import com.college.cms.auth.entity.Role;
import com.college.cms.auth.entity.RoleType;
import com.college.cms.auth.entity.User;
import com.college.cms.auth.repository.RoleRepository;
import com.college.cms.auth.repository.UserRepository;
import com.college.cms.common.exception.DuplicateResourceException;
import com.college.cms.common.exception.ResourceNotFoundException;
import com.college.cms.department.entity.Department;
import com.college.cms.department.repository.DepartmentRepository;
import com.college.cms.professor.dto.ProfessorDto;
import com.college.cms.professor.entity.Professor;
import com.college.cms.professor.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<ProfessorDto.SummaryResponse> getAllProfessors(Pageable pageable) {
        return professorRepository.findAll(pageable).map(this::mapToSummary);
    }

    @Transactional(readOnly = true)
    public ProfessorDto.Response getProfessorById(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor", "id", id));
        return mapToResponse(professor);
    }

    @Transactional
    public ProfessorDto.Response createProfessor(ProfessorDto.CreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        Role profRole = roleRepository.findByName(RoleType.PROFESSOR)
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName(RoleType.PROFESSOR);
                    r.setDescription("Professor role");
                    return roleRepository.save(r);
                });

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode("Faculty@123"));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setRoles(Collections.singleton(profRole));
        User savedUser = userRepository.save(user);

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }

        Professor prof = new Professor();
        prof.setUser(savedUser);
        prof.setEmployeeId("EMP-FAC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        prof.setDepartment(dept);
        prof.setDesignation(request.getDesignation() != null ? request.getDesignation() : "Assistant Professor");
        prof.setQualification(request.getQualification());
        prof.setSpecialization(request.getSpecialization());
        prof.setExperienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 0);
        prof.setDateOfBirth(request.getDateOfBirth());
        prof.setGender(request.getGender() != null ? request.getGender() : "OTHER");
        prof.setJoiningDate(request.getJoiningDate() != null ? request.getJoiningDate() : LocalDate.now());
        prof.setAddress(request.getAddress());
        prof.setStatus("ACTIVE");

        Professor savedProf = professorRepository.save(prof);
        return mapToResponse(savedProf);
    }

    @Transactional
    public ProfessorDto.Response updateProfessor(Long id, ProfessorDto.UpdateRequest request) {
        Professor prof = professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor", "id", id));

        if (request.getFirstName() != null) prof.getUser().setFirstName(request.getFirstName());
        if (request.getLastName() != null) prof.getUser().setLastName(request.getLastName());
        if (request.getPhone() != null) prof.getUser().setPhone(request.getPhone());
        if (request.getDesignation() != null) prof.setDesignation(request.getDesignation());
        if (request.getQualification() != null) prof.setQualification(request.getQualification());
        if (request.getSpecialization() != null) prof.setSpecialization(request.getSpecialization());
        if (request.getExperienceYears() != null) prof.setExperienceYears(request.getExperienceYears());
        if (request.getAddress() != null) prof.setAddress(request.getAddress());
        if (request.getStatus() != null) prof.setStatus(request.getStatus());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId()).orElse(null);
            prof.setDepartment(dept);
        }

        return mapToResponse(professorRepository.save(prof));
    }

    @Transactional
    public void deleteProfessor(Long id) {
        Professor prof = professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor", "id", id));
        prof.setStatus("INACTIVE");
        professorRepository.save(prof);
    }

    private ProfessorDto.Response mapToResponse(Professor p) {
        ProfessorDto.Response res = new ProfessorDto.Response();
        res.setId(p.getId());
        res.setEmployeeId(p.getEmployeeId());
        res.setUserId(p.getUser().getId());
        res.setFirstName(p.getUser().getFirstName());
        res.setLastName(p.getUser().getLastName());
        res.setEmail(p.getUser().getEmail());
        res.setPhone(p.getUser().getPhone());
        res.setDesignation(p.getDesignation());
        res.setQualification(p.getQualification());
        res.setSpecialization(p.getSpecialization());
        res.setExperienceYears(p.getExperienceYears());
        res.setDateOfBirth(p.getDateOfBirth());
        res.setGender(p.getGender());
        res.setJoiningDate(p.getJoiningDate());
        res.setAddress(p.getAddress());
        res.setStatus(p.getStatus());
        res.setCreatedAt(p.getCreatedAt());
        if (p.getDepartment() != null) {
            res.setDepartmentId(p.getDepartment().getId());
            res.setDepartmentName(p.getDepartment().getName());
        }
        return res;
    }

    private ProfessorDto.SummaryResponse mapToSummary(Professor p) {
        ProfessorDto.SummaryResponse s = new ProfessorDto.SummaryResponse();
        s.setId(p.getId());
        s.setEmployeeId(p.getEmployeeId());
        s.setFirstName(p.getUser().getFirstName());
        s.setLastName(p.getUser().getLastName());
        s.setEmail(p.getUser().getEmail());
        s.setDesignation(p.getDesignation());
        s.setStatus(p.getStatus());
        if (p.getDepartment() != null) {
            s.setDepartmentName(p.getDepartment().getName());
        }
        return s;
    }
}
