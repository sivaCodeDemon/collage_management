-- V2: Create departments table
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hod_id BIGINT REFERENCES users(id),
    established_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(100)
);

-- V3: Create courses table
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    department_id BIGINT NOT NULL REFERENCES departments(id),
    duration_years INT NOT NULL DEFAULT 4,
    total_semesters INT NOT NULL DEFAULT 8,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(100)
);

-- V4: Create subjects table
CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    department_id BIGINT NOT NULL REFERENCES departments(id),
    course_id BIGINT REFERENCES courses(id),
    semester_number INT NOT NULL,
    credit_hours INT NOT NULL DEFAULT 3,
    subject_type VARCHAR(20) NOT NULL DEFAULT 'THEORY',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(100)
);

-- V5: Create academic_years table
CREATE TABLE academic_years (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_departments_code ON departments(code);
CREATE INDEX idx_courses_department_id ON courses(department_id);
CREATE INDEX idx_subjects_department_id ON subjects(department_id);
CREATE INDEX idx_subjects_course_id ON subjects(course_id);
