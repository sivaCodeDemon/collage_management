-- V3: Student and Professor profiles
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    student_id VARCHAR(20) NOT NULL UNIQUE,
    department_id BIGINT REFERENCES departments(id),
    course_id BIGINT REFERENCES courses(id),
    current_semester INT DEFAULT 1,
    section VARCHAR(10),
    admission_date DATE NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'India',
    pincode VARCHAR(10),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    guardian_relation VARCHAR(50),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(100)
);

CREATE TABLE professors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    department_id BIGINT REFERENCES departments(id),
    designation VARCHAR(100),
    qualification VARCHAR(200),
    specialization VARCHAR(200),
    experience_years INT DEFAULT 0,
    date_of_birth DATE,
    gender VARCHAR(10),
    joining_date DATE,
    address TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(100)
);

-- Professor-Subject assignments
CREATE TABLE professor_subjects (
    professor_id BIGINT NOT NULL REFERENCES professors(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year_id BIGINT REFERENCES academic_years(id),
    PRIMARY KEY (professor_id, subject_id)
);

CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_department_id ON students(department_id);
CREATE INDEX idx_students_course_id ON students(course_id);
CREATE INDEX idx_professors_employee_id ON professors(employee_id);
CREATE INDEX idx_professors_user_id ON professors(user_id);
CREATE INDEX idx_professors_department_id ON professors(department_id);
