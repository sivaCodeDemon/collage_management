package com.college.cms.student.repository;

import com.college.cms.student.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByStudentId(String studentId);

    Optional<Student> findByStudentId(String studentId);

    Optional<Student> findByUserId(Long userId);

    @Query("SELECT s FROM Student s JOIN s.user u JOIN s.department d LEFT JOIN s.course c WHERE " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.studentId) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> searchStudents(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.status = 'ACTIVE'")
    long countActiveStudents();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.department.id = :departmentId AND s.status = 'ACTIVE'")
    long countByDepartmentId(@Param("departmentId") Long departmentId);
}
