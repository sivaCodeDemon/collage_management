-- V7: Fees and Payments
CREATE TABLE fee_structures (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id BIGINT REFERENCES departments(id),
    course_id BIGINT REFERENCES courses(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    semester_number INT,
    tuition_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    library_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    lab_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    exam_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    sports_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    miscellaneous_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (tuition_fee + library_fee + lab_fee + exam_fee + sports_fee + miscellaneous_fee) STORED,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE student_fees (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    fee_structure_id BIGINT REFERENCES fee_structures(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    semester_number INT,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    due_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE fee_payments (
    id BIGSERIAL PRIMARY KEY,
    student_fee_id BIGINT NOT NULL REFERENCES student_fees(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    payment_method VARCHAR(30) NOT NULL DEFAULT 'CASH',
    transaction_id VARCHAR(100),
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    collected_by BIGINT REFERENCES users(id),
    remarks VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_student_fees_student_id ON student_fees(student_id);
CREATE INDEX idx_fee_payments_student_fee_id ON fee_payments(student_fee_id);
CREATE INDEX idx_fee_payments_payment_date ON fee_payments(payment_date);
