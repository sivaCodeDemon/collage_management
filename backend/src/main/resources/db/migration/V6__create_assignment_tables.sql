-- V6: Assignments
CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id BIGINT NOT NULL REFERENCES subjects(id),
    professor_id BIGINT NOT NULL REFERENCES professors(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    semester_number INT,
    section VARCHAR(10),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    total_marks DECIMAL(6,2) NOT NULL DEFAULT 10,
    attachment_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE assignment_submissions (
    id BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT NOT NULL REFERENCES assignments(id),
    student_id BIGINT NOT NULL REFERENCES students(id),
    submission_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    file_url VARCHAR(500),
    comments TEXT,
    marks_obtained DECIMAL(6,2),
    feedback TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    graded_by BIGINT REFERENCES users(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (assignment_id, student_id)
);

CREATE INDEX idx_assignments_subject_id ON assignments(subject_id);
CREATE INDEX idx_assignments_professor_id ON assignments(professor_id);
CREATE INDEX idx_assignment_submissions_student_id ON assignment_submissions(student_id);
