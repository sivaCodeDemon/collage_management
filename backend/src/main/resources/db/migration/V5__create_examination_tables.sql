-- V5: Examinations and Results
CREATE TABLE examinations (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    exam_type VARCHAR(30) NOT NULL,
    subject_id BIGINT NOT NULL REFERENCES subjects(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    semester_number INT NOT NULL,
    section VARCHAR(10),
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    classroom_id BIGINT REFERENCES classrooms(id),
    total_marks DECIMAL(6,2) NOT NULL DEFAULT 100,
    passing_marks DECIMAL(6,2) NOT NULL DEFAULT 35,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    instructions TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE exam_results (
    id BIGSERIAL PRIMARY KEY,
    examination_id BIGINT NOT NULL REFERENCES examinations(id),
    student_id BIGINT NOT NULL REFERENCES students(id),
    marks_obtained DECIMAL(6,2),
    grade VARCHAR(5),
    remarks TEXT,
    is_absent BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    entered_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (examination_id, student_id)
);

-- Grade configuration table
CREATE TABLE grade_configurations (
    id BIGSERIAL PRIMARY KEY,
    grade VARCHAR(5) NOT NULL,
    min_percentage DECIMAL(5,2) NOT NULL,
    max_percentage DECIMAL(5,2) NOT NULL,
    grade_points DECIMAL(3,1) NOT NULL,
    description VARCHAR(50)
);

CREATE INDEX idx_examinations_subject_id ON examinations(subject_id);
CREATE INDEX idx_exam_results_student_id ON exam_results(student_id);
CREATE INDEX idx_exam_results_examination_id ON exam_results(examination_id);
