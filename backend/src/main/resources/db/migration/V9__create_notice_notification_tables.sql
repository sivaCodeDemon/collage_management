-- V9: Notices and Notifications
CREATE TABLE notices (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    notice_type VARCHAR(30) NOT NULL DEFAULT 'GENERAL',
    target_audience VARCHAR(30) NOT NULL DEFAULT 'ALL',
    department_id BIGINT REFERENCES departments(id),
    course_id BIGINT REFERENCES courses(id),
    priority VARCHAR(10) NOT NULL DEFAULT 'NORMAL',
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    valid_until DATE,
    attachment_url VARCHAR(500),
    created_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL,
    reference_id BIGINT,
    reference_type VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notices_is_published ON notices(is_published);
CREATE INDEX idx_notices_target_audience ON notices(target_audience);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
