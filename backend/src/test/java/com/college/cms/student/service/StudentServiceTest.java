package com.college.cms.student.service;

import com.college.cms.auth.entity.Role;
import com.college.cms.auth.entity.RoleType;
import com.college.cms.auth.entity.User;
import com.college.cms.auth.repository.RoleRepository;
import com.college.cms.auth.repository.UserRepository;
import com.college.cms.common.exception.DuplicateResourceException;
import com.college.cms.common.exception.ResourceNotFoundException;
import com.college.cms.course.entity.Course;
import com.college.cms.course.repository.CourseRepository;
import com.college.cms.department.entity.Department;
import com.college.cms.department.repository.DepartmentRepository;
import com.college.cms.student.dto.StudentDto;
import com.college.cms.student.entity.Student;
import com.college.cms.student.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private StudentService studentService;

    private User studentUser;
    private Department department;
    private Course course;
    private Student student;

    @BeforeEach
    void setUp() {
        department = Department.builder()
                .id(1L)
                .name("Computer Science & Engineering")
                .code("CSE")
                .active(true)
                .build();

        course = Course.builder()
                .id(1L)
                .name("B.Tech in Computer Science")
                .code("BT-CS")
                .department(department)
                .active(true)
                .build();

        studentUser = User.builder()
                .id(10L)
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.smith@college.edu")
                .phone("+91 9876543210")
                .enabled(true)
                .build();

        student = Student.builder()
                .id(1L)
                .studentId("STU2026000001")
                .user(studentUser)
                .department(department)
                .course(course)
                .currentSemester(4)
                .section("A")
                .status("ACTIVE")
                .build();
    }

    @Test
    @DisplayName("Should find student by ID successfully")
    void getStudentById_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        StudentDto.Response response = studentService.getStudentById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getStudentId()).isEqualTo("STU2026000001");
        assertThat(response.getFirstName()).isEqualTo("Jane");
        assertThat(response.getLastName()).isEqualTo("Smith");
        assertThat(response.getDepartmentName()).isEqualTo("Computer Science & Engineering");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when student ID not found")
    void getStudentById_NotFound() {
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.getStudentById(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email already exists")
    void createStudent_DuplicateEmail() {
        StudentDto.CreateRequest request = new StudentDto.CreateRequest();
        request.setEmail("jane.smith@college.edu");
        request.setPassword("Password123!");

        when(userRepository.existsByEmail("jane.smith@college.edu")).thenReturn(true);

        assertThatThrownBy(() -> studentService.createStudent(request))
                .isInstanceOf(DuplicateResourceException.class);

        verify(studentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully create a new student")
    void createStudent_Success() {
        StudentDto.CreateRequest request = new StudentDto.CreateRequest();
        request.setFirstName("Jane");
        request.setLastName("Smith");
        request.setEmail("new.student@college.edu");
        request.setPassword("Password123!");
        request.setDepartmentId(1L);
        request.setCourseId(1L);
        request.setCurrentSemester(1);
        request.setSection("A");

        Role role = Role.builder().name(RoleType.STUDENT).build();

        when(userRepository.existsByEmail("new.student@college.edu")).thenReturn(false);
        when(roleRepository.findByName(RoleType.STUDENT)).thenReturn(Optional.of(role));
        when(passwordEncoder.encode(any())).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(studentUser);
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentDto.Response response = studentService.createStudent(request);

        assertThat(response).isNotNull();
        assertThat(response.getStudentId()).isEqualTo("STU2026000001");
        verify(studentRepository).save(any(Student.class));
    }
}
