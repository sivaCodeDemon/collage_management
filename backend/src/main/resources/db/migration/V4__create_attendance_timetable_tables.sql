-- V4: Attendance, Enrollment, Timetable
CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    subject_id BIGINT NOT NULL REFERENCES subjects(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    semester_number INT NOT NULL,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, subject_id, academic_year_id)
);

CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    subject_id BIGINT NOT NULL REFERENCES subjects(id),
    professor_id BIGINT NOT NULL REFERENCES professors(id),
    attendance_date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),
    remarks VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (student_id, subject_id, attendance_date)
);

CREATE TABLE classrooms (
    id BIGSERIAL PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    building VARCHAR(50),
    floor_number INT,
    capacity INT NOT NULL DEFAULT 60,
    room_type VARCHAR(30) DEFAULT 'CLASSROOM',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE timetable (
    id BIGSERIAL PRIMARY KEY,
    subject_id BIGINT NOT NULL REFERENCES subjects(id),
    professor_id BIGINT NOT NULL REFERENCES professors(id),
    classroom_id BIGINT REFERENCES classrooms(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    section VARCHAR(10),
    semester_number INT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_subject_id ON attendance(subject_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_timetable_professor_id ON timetable(professor_id);
CREATE INDEX idx_timetable_day ON timetable(day_of_week);
