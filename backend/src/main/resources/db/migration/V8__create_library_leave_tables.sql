-- V8: Library
CREATE TABLE library_books (
    id BIGSERIAL PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(200) NOT NULL,
    publisher VARCHAR(100),
    category VARCHAR(50),
    publication_year INT,
    total_copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    rack_number VARCHAR(20),
    description TEXT,
    cover_image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE book_issues (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL REFERENCES library_books(id),
    student_id BIGINT REFERENCES students(id),
    user_id BIGINT REFERENCES users(id),
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount DECIMAL(8,2) NOT NULL DEFAULT 0,
    fine_paid BOOLEAN NOT NULL DEFAULT FALSE,
    issued_by BIGINT REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'ISSUED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_library_books_isbn ON library_books(isbn);
CREATE INDEX idx_book_issues_book_id ON book_issues(book_id);
CREATE INDEX idx_book_issues_student_id ON book_issues(student_id);
CREATE INDEX idx_book_issues_status ON book_issues(status);

-- V9: Leave Management
CREATE TABLE leave_requests (
    id BIGSERIAL PRIMARY KEY,
    applicant_user_id BIGINT NOT NULL REFERENCES users(id),
    leave_type VARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT NOT NULL,
    attachment_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leave_requests_user_id ON leave_requests(applicant_user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
