package com.college.cms.professor.repository;

import com.college.cms.professor.entity.Professor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    boolean existsByEmployeeId(String employeeId);

    Optional<Professor> findByEmployeeId(String employeeId);

    Optional<Professor> findByUserId(Long userId);

    List<Professor> findAllByDepartmentIdAndStatusEquals(Long departmentId, String status);

    @Query("SELECT p FROM Professor p JOIN p.user u LEFT JOIN p.department d WHERE " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.employeeId) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Professor> searchProfessors(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Professor p WHERE p.status = 'ACTIVE'")
    long countActiveProfessors();
}
