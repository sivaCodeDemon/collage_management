package com.college.cms.course.service;

import com.college.cms.common.exception.ResourceNotFoundException;
import com.college.cms.course.dto.CourseDto;
import com.college.cms.course.entity.Course;
import com.college.cms.course.repository.CourseRepository;
import com.college.cms.department.entity.Department;
import com.college.cms.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public Page<CourseDto.Response> getAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public CourseDto.Response getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return mapToResponse(course);
    }

    @Transactional
    public CourseDto.Response createCourse(CourseDto.CreateRequest request) {
        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        }

        Course course = new Course();
        course.setCode(request.getCode());
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setDepartment(dept);
        course.setDurationYears(request.getDurationYears() != null ? request.getDurationYears() : 4);
        course.setTotalSemesters(request.getTotalSemesters() != null ? request.getTotalSemesters() : 8);
        course.setActive(true);

        return mapToResponse(courseRepository.save(course));
    }

    private CourseDto.Response mapToResponse(Course c) {
        CourseDto.Response res = new CourseDto.Response();
        res.setId(c.getId());
        res.setCode(c.getCode());
        res.setName(c.getName());
        res.setDescription(c.getDescription());
        res.setDurationYears(c.getDurationYears());
        res.setTotalSemesters(c.getTotalSemesters());
        res.setActive(c.isActive());
        res.setCreatedAt(c.getCreatedAt());
        if (c.getDepartment() != null) {
            res.setDepartmentId(c.getDepartment().getId());
            res.setDepartmentName(c.getDepartment().getName());
        }
        return res;
    }
}
