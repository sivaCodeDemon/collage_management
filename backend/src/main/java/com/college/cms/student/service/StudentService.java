package com.college.cms.student.service;

import com.college.cms.auth.entity.Role;
import com.college.cms.auth.entity.RoleType;
import com.college.cms.auth.entity.User;
import com.college.cms.auth.repository.RoleRepository;
import com.college.cms.auth.repository.UserRepository;
import com.college.cms.common.exception.DuplicateResourceException;
import com.college.cms.common.exception.ResourceNotFoundException;
import com.college.cms.common.response.PageResponse;
import com.college.cms.course.entity.Course;
import com.college.cms.course.repository.CourseRepository;
import com.college.cms.department.entity.Department;
import com.college.cms.department.repository.DepartmentRepository;
import com.college.cms.student.dto.StudentDto;
import com.college.cms.student.entity.Student;
import com.college.cms.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('STUDENT_VIEW')")
    public PageResponse<StudentDto.Summary> getAllStudents(String search, Pageable pageable) {
        Page<Student> page;
        if (search != null && !search.isBlank()) {
            page = studentRepository.searchStudents(search.trim(), pageable);
        } else {
            page = studentRepository.findAll(pageable);
        }
        return PageResponse.of(page.map(this::toSummary));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('STUDENT_VIEW')")
    public StudentDto.Response getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));
        return toResponse(student);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('STUDENT_VIEW')")
    public StudentDto.Response getStudentByStudentId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "studentId", studentId));
        return toResponse(student);
    }

    @Transactional
    @PreAuthorize("hasAuthority('STUDENT_CREATE')")
    public StudentDto.Response createStudent(StudentDto.CreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        Role studentRole = roleRepository.findByName(RoleType.STUDENT)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "STUDENT"));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .emailVerified(true)
                .roles(Set.of(studentRole))
                .build();
        user = userRepository.save(user);

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", request.getDepartmentId()));

        String studentId = generateStudentId();

        Student.StudentBuilder builder = Student.builder()
                .user(user)
                .studentId(studentId)
                .department(dept)
                .currentSemester(request.getCurrentSemester() != null ? request.getCurrentSemester() : 1)
                .section(request.getSection())
                .admissionDate(request.getAdmissionDate())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .guardianName(request.getGuardianName())
                .guardianPhone(request.getGuardianPhone())
                .guardianRelation(request.getGuardianRelation())
                .status("ACTIVE");

        if (request.getCourseId() != null) {
            Course course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course", request.getCourseId()));
            if (!course.isActive()) {
                throw new com.college.cms.common.exception.BusinessException("Cannot enroll in an inactive course");
            }
            builder.course(course);
        }

        Student saved = studentRepository.save(builder.build());
        log.info("Student created: {} ({})", saved.getStudentId(), user.getEmail());
        return toResponse(saved);
    }

    @Transactional
    @PreAuthorize("hasAuthority('STUDENT_UPDATE')")
    public StudentDto.Response updateStudent(Long id, StudentDto.UpdateRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));

        User user = student.getUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        userRepository.save(user);

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", request.getDepartmentId()));
            student.setDepartment(dept);
        }

        if (request.getCourseId() != null) {
            Course course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course", request.getCourseId()));
            student.setCourse(course);
        }

        if (request.getCurrentSemester() != null) student.setCurrentSemester(request.getCurrentSemester());
        if (request.getSection() != null) student.setSection(request.getSection());
        if (request.getDateOfBirth() != null) student.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) student.setGender(request.getGender());
        if (request.getBloodGroup() != null) student.setBloodGroup(request.getBloodGroup());
        if (request.getAddress() != null) student.setAddress(request.getAddress());
        if (request.getCity() != null) student.setCity(request.getCity());
        if (request.getState() != null) student.setState(request.getState());
        if (request.getPincode() != null) student.setPincode(request.getPincode());
        if (request.getGuardianName() != null) student.setGuardianName(request.getGuardianName());
        if (request.getGuardianPhone() != null) student.setGuardianPhone(request.getGuardianPhone());
        if (request.getGuardianRelation() != null) student.setGuardianRelation(request.getGuardianRelation());
        if (request.getStatus() != null) student.setStatus(request.getStatus());

        return toResponse(studentRepository.save(student));
    }

    @Transactional
    @PreAuthorize("hasAuthority('STUDENT_DELETE')")
    public void deactivateStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));
        student.setStatus("INACTIVE");
        student.getUser().setEnabled(false);
        userRepository.save(student.getUser());
        studentRepository.save(student);
        log.info("Student deactivated: {}", student.getStudentId());
    }

    private String generateStudentId() {
        String year = String.valueOf(Year.now().getValue());
        long count = studentRepository.count() + 1;
        return "STU" + year + String.format("%04d", count);
    }

    private StudentDto.Summary toSummary(Student s) {
        return StudentDto.Summary.builder()
                .id(s.getId())
                .studentId(s.getStudentId())
                .firstName(s.getUser().getFirstName())
                .lastName(s.getUser().getLastName())
                .email(s.getUser().getEmail())
                .departmentName(s.getDepartment() != null ? s.getDepartment().getName() : null)
                .courseName(s.getCourse() != null ? s.getCourse().getName() : null)
                .currentSemester(s.getCurrentSemester())
                .section(s.getSection())
                .status(s.getStatus())
                .build();
    }

    private StudentDto.Response toResponse(Student s) {
        return StudentDto.Response.builder()
                .id(s.getId())
                .studentId(s.getStudentId())
                .userId(s.getUser().getId())
                .firstName(s.getUser().getFirstName())
                .lastName(s.getUser().getLastName())
                .email(s.getUser().getEmail())
                .phone(s.getUser().getPhone())
                .profileImageUrl(s.getUser().getProfileImageUrl())
                .departmentId(s.getDepartment() != null ? s.getDepartment().getId() : null)
                .departmentName(s.getDepartment() != null ? s.getDepartment().getName() : null)
                .departmentCode(s.getDepartment() != null ? s.getDepartment().getCode() : null)
                .courseId(s.getCourse() != null ? s.getCourse().getId() : null)
                .courseName(s.getCourse() != null ? s.getCourse().getName() : null)
                .currentSemester(s.getCurrentSemester())
                .section(s.getSection())
                .admissionDate(s.getAdmissionDate())
                .dateOfBirth(s.getDateOfBirth())
                .gender(s.getGender())
                .bloodGroup(s.getBloodGroup())
                .address(s.getAddress())
                .city(s.getCity())
                .state(s.getState())
                .country(s.getCountry())
                .pincode(s.getPincode())
                .guardianName(s.getGuardianName())
                .guardianPhone(s.getGuardianPhone())
                .guardianRelation(s.getGuardianRelation())
                .status(s.getStatus())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
