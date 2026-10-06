-- V11: Seed Data
-- Insert Permissions
INSERT INTO permissions (name, description) VALUES
('USER_VIEW', 'View users'),
('USER_CREATE', 'Create users'),
('USER_UPDATE', 'Update users'),
('USER_DELETE', 'Delete users'),
('USER_MANAGE', 'Full user management'),
('ROLE_VIEW', 'View roles'),
('ROLE_MANAGE', 'Manage roles'),
('STUDENT_VIEW', 'View students'),
('STUDENT_CREATE', 'Create students'),
('STUDENT_UPDATE', 'Update students'),
('STUDENT_DELETE', 'Delete students'),
('PROFESSOR_VIEW', 'View professors'),
('PROFESSOR_CREATE', 'Create professors'),
('PROFESSOR_UPDATE', 'Update professors'),
('PROFESSOR_DELETE', 'Delete professors'),
('DEPARTMENT_VIEW', 'View departments'),
('DEPARTMENT_CREATE', 'Create departments'),
('DEPARTMENT_UPDATE', 'Update departments'),
('DEPARTMENT_DELETE', 'Delete departments'),
('COURSE_VIEW', 'View courses'),
('COURSE_CREATE', 'Create courses'),
('COURSE_UPDATE', 'Update courses'),
('COURSE_DELETE', 'Delete courses'),
('SUBJECT_VIEW', 'View subjects'),
('SUBJECT_CREATE', 'Create subjects'),
('SUBJECT_UPDATE', 'Update subjects'),
('SUBJECT_DELETE', 'Delete subjects'),
('ATTENDANCE_VIEW', 'View attendance'),
('ATTENDANCE_MARK', 'Mark attendance'),
('ATTENDANCE_UPDATE', 'Update attendance'),
('ATTENDANCE_DELETE', 'Delete attendance'),
('EXAM_VIEW', 'View examinations'),
('EXAM_CREATE', 'Create examinations'),
('EXAM_UPDATE', 'Update examinations'),
('EXAM_DELETE', 'Delete examinations'),
('RESULT_VIEW', 'View results'),
('RESULT_CREATE', 'Enter results'),
('RESULT_UPDATE', 'Update results'),
('RESULT_PUBLISH', 'Publish results'),
('ASSIGNMENT_VIEW', 'View assignments'),
('ASSIGNMENT_CREATE', 'Create assignments'),
('ASSIGNMENT_UPDATE', 'Update assignments'),
('ASSIGNMENT_DELETE', 'Delete assignments'),
('ASSIGNMENT_SUBMIT', 'Submit assignments'),
('ASSIGNMENT_GRADE', 'Grade assignments'),
('TIMETABLE_VIEW', 'View timetable'),
('TIMETABLE_CREATE', 'Create timetable'),
('TIMETABLE_UPDATE', 'Update timetable'),
('TIMETABLE_DELETE', 'Delete timetable'),
('FEE_VIEW', 'View fees'),
('FEE_CREATE', 'Create fee structure'),
('FEE_UPDATE', 'Update fees'),
('FEE_DELETE', 'Delete fees'),
('PAYMENT_VIEW', 'View payments'),
('PAYMENT_CREATE', 'Record payments'),
('BOOK_VIEW', 'View books'),
('BOOK_CREATE', 'Add books'),
('BOOK_UPDATE', 'Update books'),
('BOOK_DELETE', 'Delete books'),
('BOOK_ISSUE', 'Issue books'),
('BOOK_RETURN', 'Return books'),
('LEAVE_VIEW', 'View leave requests'),
('LEAVE_REQUEST', 'Submit leave request'),
('LEAVE_APPROVE', 'Approve leave requests'),
('LEAVE_REJECT', 'Reject leave requests'),
('NOTICE_VIEW', 'View notices'),
('NOTICE_CREATE', 'Create notices'),
('NOTICE_UPDATE', 'Update notices'),
('NOTICE_DELETE', 'Delete notices'),
('REPORT_VIEW', 'View reports'),
('AUDIT_VIEW', 'View audit logs');

-- Insert Roles
INSERT INTO roles (name, description) VALUES
('SUPER_ADMIN', 'Super Administrator with all permissions'),
('PRINCIPAL', 'College Principal'),
('ADMIN', 'Administrative Staff'),
('PROFESSOR', 'Teaching Faculty'),
('STUDENT', 'Enrolled Student'),
('ACCOUNTANT', 'Finance Staff'),
('LIBRARIAN', 'Library Staff'),
('HOD', 'Head of Department');

-- Assign all permissions to SUPER_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'SUPER_ADMIN';

-- PRINCIPAL permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'PRINCIPAL'
AND p.name IN (
    'USER_VIEW', 'STUDENT_VIEW', 'PROFESSOR_VIEW',
    'DEPARTMENT_VIEW', 'COURSE_VIEW', 'SUBJECT_VIEW',
    'ATTENDANCE_VIEW', 'EXAM_VIEW', 'RESULT_VIEW', 'RESULT_PUBLISH',
    'FEE_VIEW', 'PAYMENT_VIEW', 'REPORT_VIEW',
    'LEAVE_VIEW', 'LEAVE_APPROVE', 'LEAVE_REJECT',
    'NOTICE_VIEW', 'NOTICE_CREATE', 'NOTICE_UPDATE', 'NOTICE_DELETE',
    'AUDIT_VIEW', 'TIMETABLE_VIEW'
);

-- ADMIN permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ADMIN'
AND p.name IN (
    'USER_VIEW', 'USER_CREATE', 'USER_UPDATE',
    'STUDENT_VIEW', 'STUDENT_CREATE', 'STUDENT_UPDATE', 'STUDENT_DELETE',
    'PROFESSOR_VIEW', 'PROFESSOR_CREATE', 'PROFESSOR_UPDATE',
    'DEPARTMENT_VIEW', 'DEPARTMENT_CREATE', 'DEPARTMENT_UPDATE',
    'COURSE_VIEW', 'COURSE_CREATE', 'COURSE_UPDATE',
    'SUBJECT_VIEW', 'SUBJECT_CREATE', 'SUBJECT_UPDATE',
    'ATTENDANCE_VIEW', 'TIMETABLE_VIEW', 'TIMETABLE_CREATE', 'TIMETABLE_UPDATE',
    'NOTICE_VIEW', 'NOTICE_CREATE', 'NOTICE_UPDATE',
    'LEAVE_VIEW', 'LEAVE_APPROVE', 'LEAVE_REJECT',
    'REPORT_VIEW', 'AUDIT_VIEW'
);

-- PROFESSOR permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'PROFESSOR'
AND p.name IN (
    'STUDENT_VIEW', 'ATTENDANCE_VIEW', 'ATTENDANCE_MARK', 'ATTENDANCE_UPDATE',
    'EXAM_VIEW', 'EXAM_CREATE', 'RESULT_VIEW', 'RESULT_CREATE', 'RESULT_UPDATE',
    'ASSIGNMENT_VIEW', 'ASSIGNMENT_CREATE', 'ASSIGNMENT_UPDATE', 'ASSIGNMENT_GRADE',
    'NOTICE_VIEW', 'TIMETABLE_VIEW',
    'LEAVE_VIEW', 'LEAVE_REQUEST',
    'REPORT_VIEW', 'SUBJECT_VIEW', 'COURSE_VIEW', 'DEPARTMENT_VIEW'
);

-- STUDENT permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'STUDENT'
AND p.name IN (
    'ATTENDANCE_VIEW', 'RESULT_VIEW', 'EXAM_VIEW',
    'ASSIGNMENT_VIEW', 'ASSIGNMENT_SUBMIT',
    'NOTICE_VIEW', 'TIMETABLE_VIEW',
    'FEE_VIEW', 'PAYMENT_VIEW',
    'LEAVE_VIEW', 'LEAVE_REQUEST',
    'BOOK_VIEW', 'SUBJECT_VIEW', 'COURSE_VIEW', 'DEPARTMENT_VIEW'
);

-- ACCOUNTANT permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ACCOUNTANT'
AND p.name IN (
    'STUDENT_VIEW', 'FEE_VIEW', 'FEE_CREATE', 'FEE_UPDATE',
    'PAYMENT_VIEW', 'PAYMENT_CREATE', 'REPORT_VIEW', 'NOTICE_VIEW'
);

-- LIBRARIAN permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'LIBRARIAN'
AND p.name IN (
    'STUDENT_VIEW', 'BOOK_VIEW', 'BOOK_CREATE', 'BOOK_UPDATE', 'BOOK_DELETE',
    'BOOK_ISSUE', 'BOOK_RETURN', 'REPORT_VIEW', 'NOTICE_VIEW'
);

-- HOD permissions (inherits admin for department)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'HOD'
AND p.name IN (
    'USER_VIEW', 'STUDENT_VIEW', 'PROFESSOR_VIEW',
    'DEPARTMENT_VIEW', 'DEPARTMENT_UPDATE',
    'COURSE_VIEW', 'COURSE_CREATE', 'COURSE_UPDATE',
    'SUBJECT_VIEW', 'SUBJECT_CREATE', 'SUBJECT_UPDATE',
    'ATTENDANCE_VIEW', 'TIMETABLE_VIEW', 'TIMETABLE_CREATE',
    'EXAM_VIEW', 'RESULT_VIEW', 'RESULT_PUBLISH',
    'NOTICE_VIEW', 'NOTICE_CREATE',
    'LEAVE_VIEW', 'LEAVE_APPROVE', 'LEAVE_REJECT',
    'REPORT_VIEW', 'ASSIGNMENT_VIEW'
);

-- Insert Grade Configurations
INSERT INTO grade_configurations (grade, min_percentage, max_percentage, grade_points, description) VALUES
('A+', 90.00, 100.00, 10.0, 'Outstanding'),
('A',  80.00, 89.99, 9.0, 'Excellent'),
('B+', 70.00, 79.99, 8.0, 'Very Good'),
('B',  60.00, 69.99, 7.0, 'Good'),
('C',  50.00, 59.99, 6.0, 'Average'),
('D',  35.00, 49.99, 5.0, 'Pass'),
('F',   0.00, 34.99, 0.0, 'Fail');

-- Create Super Admin User (password: Admin@123)
INSERT INTO users (email, password, first_name, last_name, phone, enabled, email_verified, created_by)
VALUES ('superadmin@college.edu', '$2a$12$hNU7m8Wq5QPX0SAc5S0mwOVffWwckCqNI24STHuw7ZKEb3f4IMVlu', 'Super', 'Admin', '+91-9000000001', true, true, 'SYSTEM');

-- Create Principal (password: Admin@123)
INSERT INTO users (email, password, first_name, last_name, phone, enabled, email_verified, created_by)
VALUES ('principal@college.edu', '$2a$12$hNU7m8Wq5QPX0SAc5S0mwOVffWwckCqNI24STHuw7ZKEb3f4IMVlu', 'Dr. Rajesh', 'Kumar', '+91-9000000002', true, true, 'SYSTEM');

-- Create Admin (password: Admin@123)
INSERT INTO users (email, password, first_name, last_name, phone, enabled, email_verified, created_by)
VALUES ('admin@college.edu', '$2a$12$hNU7m8Wq5QPX0SAc5S0mwOVffWwckCqNI24STHuw7ZKEb3f4IMVlu', 'Priya', 'Sharma', '+91-9000000003', true, true, 'SYSTEM');

-- Create Professor (password: Admin@123)
INSERT INTO users (email, password, first_name, last_name, phone, enabled, email_verified, created_by)
VALUES ('professor@college.edu', '$2a$12$hNU7m8Wq5QPX0SAc5S0mwOVffWwckCqNI24STHuw7ZKEb3f4IMVlu', 'Dr. Amit', 'Patel', '+91-9000000004', true, true, 'SYSTEM');

-- Create Student (password: Admin@123)
INSERT INTO users (email, password, first_name, last_name, phone, enabled, email_verified, created_by)
VALUES ('student@college.edu', '$2a$12$hNU7m8Wq5QPX0SAc5S0mwOVffWwckCqNI24STHuw7ZKEb3f4IMVlu', 'Rahul', 'Verma', '+91-9000000005', true, true, 'SYSTEM');

-- Create Accountant (password: Admin@123)
INSERT INTO users (email, password, first_name, last_name, phone, enabled, email_verified, created_by)
VALUES ('accountant@college.edu', '$2a$12$hNU7m8Wq5QPX0SAc5S0mwOVffWwckCqNI24STHuw7ZKEb3f4IMVlu', 'Sunita', 'Gupta', '+91-9000000006', true, true, 'SYSTEM');

-- Create Librarian (password: Admin@123)
INSERT INTO users (email, password, first_name, last_name, phone, enabled, email_verified, created_by)
VALUES ('librarian@college.edu', '$2a$12$hNU7m8Wq5QPX0SAc5S0mwOVffWwckCqNI24STHuw7ZKEb3f4IMVlu', 'Meera', 'Joshi', '+91-9000000007', true, true, 'SYSTEM');

-- Create HOD (password: Admin@123)
INSERT INTO users (email, password, first_name, last_name, phone, enabled, email_verified, created_by)
VALUES ('hod@college.edu', '$2a$12$hNU7m8Wq5QPX0SAc5S0mwOVffWwckCqNI24STHuw7ZKEb3f4IMVlu', 'Dr. Deepa', 'Nair', '+91-9000000008', true, true, 'SYSTEM');

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'superadmin@college.edu' AND r.name = 'SUPER_ADMIN';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'principal@college.edu' AND r.name = 'PRINCIPAL';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'admin@college.edu' AND r.name = 'ADMIN';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'professor@college.edu' AND r.name = 'PROFESSOR';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'student@college.edu' AND r.name = 'STUDENT';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'accountant@college.edu' AND r.name = 'ACCOUNTANT';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'librarian@college.edu' AND r.name = 'LIBRARIAN';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'hod@college.edu' AND r.name = 'HOD';

-- Insert Academic Year
INSERT INTO academic_years (name, start_date, end_date, is_current)
VALUES ('2024-25', '2024-06-01', '2025-05-31', true);

-- Insert Departments
INSERT INTO departments (code, name, description, is_active)
VALUES
('CSE', 'Computer Science & Engineering', 'Department of Computer Science and Engineering', true),
('ECE', 'Electronics & Communication Engineering', 'Department of Electronics and Communication', true),
('ME', 'Mechanical Engineering', 'Department of Mechanical Engineering', true),
('CE', 'Civil Engineering', 'Department of Civil Engineering', true),
('MBA', 'Master of Business Administration', 'Department of Management Studies', true);

-- Update HOD for CSE department
UPDATE departments SET hod_id = (SELECT u.id FROM users u WHERE u.email = 'hod@college.edu')
WHERE code = 'CSE';

-- Insert Courses
INSERT INTO courses (code, name, department_id, duration_years, total_semesters, is_active)
SELECT 'B.Tech-CSE', 'B.Tech in Computer Science', d.id, 4, 8, true FROM departments d WHERE d.code = 'CSE';

INSERT INTO courses (code, name, department_id, duration_years, total_semesters, is_active)
SELECT 'B.Tech-ECE', 'B.Tech in Electronics & Communication', d.id, 4, 8, true FROM departments d WHERE d.code = 'ECE';

INSERT INTO courses (code, name, department_id, duration_years, total_semesters, is_active)
SELECT 'MBA-GEN', 'MBA General Management', d.id, 2, 4, true FROM departments d WHERE d.code = 'MBA';

-- Insert Subjects
INSERT INTO subjects (code, name, department_id, course_id, semester_number, credit_hours, subject_type, is_active)
SELECT 'CS101', 'Programming Fundamentals', d.id, c.id, 1, 4, 'THEORY', true
FROM departments d, courses c WHERE d.code = 'CSE' AND c.code = 'B.Tech-CSE';

INSERT INTO subjects (code, name, department_id, course_id, semester_number, credit_hours, subject_type, is_active)
SELECT 'CS102', 'Data Structures', d.id, c.id, 2, 4, 'THEORY', true
FROM departments d, courses c WHERE d.code = 'CSE' AND c.code = 'B.Tech-CSE';

INSERT INTO subjects (code, name, department_id, course_id, semester_number, credit_hours, subject_type, is_active)
SELECT 'CS103', 'Database Management Systems', d.id, c.id, 3, 4, 'THEORY', true
FROM departments d, courses c WHERE d.code = 'CSE' AND c.code = 'B.Tech-CSE';

INSERT INTO subjects (code, name, department_id, course_id, semester_number, credit_hours, subject_type, is_active)
SELECT 'CS104', 'Computer Networks', d.id, c.id, 4, 4, 'THEORY', true
FROM departments d, courses c WHERE d.code = 'CSE' AND c.code = 'B.Tech-CSE';

INSERT INTO subjects (code, name, department_id, course_id, semester_number, credit_hours, subject_type, is_active)
SELECT 'CS105', 'Operating Systems', d.id, c.id, 4, 4, 'THEORY', true
FROM departments d, courses c WHERE d.code = 'CSE' AND c.code = 'B.Tech-CSE';

-- Assign professor to CSE department
UPDATE professors SET department_id = (SELECT id FROM departments WHERE code = 'CSE')
WHERE employee_id IS NOT NULL;

-- Insert Professor profile
INSERT INTO professors (user_id, employee_id, department_id, designation, qualification, specialization, joining_date, status)
SELECT u.id, 'EMP001', d.id, 'Associate Professor', 'Ph.D Computer Science', 'Machine Learning', '2018-07-01', 'ACTIVE'
FROM users u, departments d WHERE u.email = 'professor@college.edu' AND d.code = 'CSE';

-- Insert Student profile  
INSERT INTO students (user_id, student_id, department_id, course_id, current_semester, section, admission_date, gender, status)
SELECT u.id, 'STU2024001', d.id, c.id, 3, 'A', '2022-08-01', 'MALE', 'ACTIVE'
FROM users u, departments d, courses c
WHERE u.email = 'student@college.edu' AND d.code = 'CSE' AND c.code = 'B.Tech-CSE';

-- Insert Classrooms
INSERT INTO classrooms (room_number, building, floor_number, capacity, room_type)
VALUES
('LH-101', 'Main Block', 1, 60, 'LECTURE_HALL'),
('LH-102', 'Main Block', 1, 60, 'LECTURE_HALL'),
('LH-201', 'Main Block', 2, 80, 'LECTURE_HALL'),
('LAB-CS1', 'CS Block', 1, 40, 'COMPUTER_LAB'),
('LAB-CS2', 'CS Block', 2, 40, 'COMPUTER_LAB');

-- Insert Library Books
INSERT INTO library_books (isbn, title, author, publisher, category, publication_year, total_copies, available_copies, rack_number)
VALUES
('978-0-13-468599-1', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 'Programming', 2008, 5, 5, 'CS-A1'),
('978-0-13-235088-4', 'The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Addison-Wesley', 'Programming', 2019, 3, 3, 'CS-A2'),
('978-0-06-196436-2', 'Design Patterns', 'Gang of Four', 'Addison-Wesley', 'Software Engineering', 1994, 4, 4, 'CS-B1'),
('978-0-13-110362-7', 'The C Programming Language', 'Brian Kernighan, Dennis Ritchie', 'Prentice Hall', 'Programming', 1988, 6, 6, 'CS-A3'),
('978-0-596-51774-8', 'JavaScript: The Good Parts', 'Douglas Crockford', 'O''Reilly Media', 'Web Development', 2008, 4, 4, 'CS-C1');

-- Insert Published Notice
INSERT INTO notices (title, content, notice_type, target_audience, priority, is_published, published_at, created_by)
SELECT 'Welcome to the New Academic Year 2024-25',
       'Dear Students and Faculty, We welcome you to the new academic year 2024-25. Classes will commence from June 10, 2024. Please check the timetable posted on the notice board.',
       'GENERAL', 'ALL', 'HIGH', true, NOW(),
       (SELECT id FROM users WHERE email = 'admin@college.edu');

INSERT INTO notices (title, content, notice_type, target_audience, priority, is_published, published_at, created_by)
SELECT 'Mid-Semester Examination Schedule',
       'The mid-semester examinations for Semester 3 will be held from July 15, 2024. Detailed schedule will be published shortly.',
       'EXAM', 'STUDENT', 'NORMAL', true, NOW(),
       (SELECT id FROM users WHERE email = 'admin@college.edu');
