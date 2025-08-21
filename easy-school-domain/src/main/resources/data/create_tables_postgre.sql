-- Student table
CREATE TABLE IF NOT EXISTS student (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    due_date INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL
);

-- Language table
CREATE TABLE IF NOT EXISTS language (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    image_url TEXT NOT NULL,
    UNIQUE(name)
);

-- Course table
CREATE TABLE IF NOT EXISTS course (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    language_id INTEGER NOT NULL,
    price DECIMAL NOT NULL,
    FOREIGN KEY (language_id) REFERENCES language (id),
    UNIQUE(name)
);

-- Teacher table
CREATE TABLE IF NOT EXISTS teacher (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    compensation DECIMAL NOT NULL,
    start_date TIMESTAMP NOT NULL,
    UNIQUE(phone_number),
    UNIQUE(email)
);

-- Teacher skills
CREATE TABLE IF NOT EXISTS teacher_skill (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL,
    language_id INTEGER NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher (id),
    FOREIGN KEY (language_id) REFERENCES language (id),
    UNIQUE(teacher_id, language_id)
);

-- Course classes
CREATE TABLE IF NOT EXISTS course_class (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    course_id INTEGER NOT NULL,
    status BOOLEAN NOT NULL,
    teacher_id INTEGER NOT NULL,
    start_hour INTEGER NOT NULL,
    start_minute INTEGER NOT NULL,
    end_hour INTEGER NOT NULL,
    end_minute INTEGER NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course (id),
    FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);

-- Course class students
CREATE TABLE IF NOT EXISTS course_class_students (
    id SERIAL PRIMARY KEY,
    course_class_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    course_price DECIMAL NOT NULL,
    FOREIGN KEY (course_class_id) REFERENCES course_class (id),
    FOREIGN KEY (student_id) REFERENCES student (id),
    UNIQUE(student_id, course_class_id)
);
ALTER TABLE course_class_students
  ALTER COLUMN course_price TYPE double precision
  USING course_price::double precision;

-- Revenue tracking
CREATE TABLE IF NOT EXISTS revenue (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    paid BOOLEAN,
    payment_sent BOOLEAN,
    reminder_sent BOOLEAN,
    status TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    due_date INTEGER NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student (id),
    UNIQUE(student_id, month, year)
);

-- Revenue message
CREATE TABLE IF NOT EXISTS revenue_message (
    id SERIAL PRIMARY KEY,
    payment_overdue_message TEXT,
    reminder_message TEXT
);


-- Calendar week days
CREATE TABLE IF NOT EXISTS calendar_week_day (
    id SERIAL PRIMARY KEY,
    week_day TEXT NOT NULL,
    UNIQUE(week_day)
);

-- Course class calendar
CREATE TABLE IF NOT EXISTS course_class_calendar (
    id SERIAL PRIMARY KEY,
    course_class_id INTEGER NOT NULL,
    calendar_week_day_id INTEGER NOT NULL,
    FOREIGN KEY (course_class_id) REFERENCES course_class (id),
    FOREIGN KEY (calendar_week_day_id) REFERENCES calendar_week_day (id),
    UNIQUE(calendar_week_day_id, course_class_id)
);

-- Teacher availability
CREATE TABLE IF NOT EXISTS calendar_range_hour_day (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL,
    calendar_week_day_id INTEGER NOT NULL,
    start_hour INTEGER NOT NULL,
    end_hour INTEGER NOT NULL,
    start_minute INTEGER NOT NULL,
    end_minute INTEGER NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher (id),
    FOREIGN KEY (calendar_week_day_id) REFERENCES calendar_week_day (id),
    UNIQUE(calendar_week_day_id, start_hour, start_minute, teacher_id),
    UNIQUE(calendar_week_day_id, end_hour, end_minute, teacher_id)
);

-- Technical configuration
CREATE TABLE IF NOT EXISTS technical_config (
    id SERIAL PRIMARY KEY,
    code INTEGER NOT NULL,
    param TEXT NOT NULL,
    UNIQUE(code)
);

-- Class control
CREATE TABLE IF NOT EXISTS class_control (
    id SERIAL PRIMARY KEY,
    day INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    replacement BOOLEAN,
    content TEXT NOT NULL,
    course_class_id INTEGER NOT NULL,
    FOREIGN KEY (course_class_id) REFERENCES course_class (id),
    UNIQUE(day, month, year, course_class_id)
);

-- Class control teachers
CREATE TABLE IF NOT EXISTS class_control_teacher (
    id SERIAL PRIMARY KEY,
    class_control_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    FOREIGN KEY (class_control_id) REFERENCES class_control (id),
    FOREIGN KEY (teacher_id) REFERENCES teacher (id),
    UNIQUE(teacher_id, class_control_id)
);

-- Class control students
CREATE TABLE IF NOT EXISTS class_control_student (
    id SERIAL PRIMARY KEY,
    class_control_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    FOREIGN KEY (class_control_id) REFERENCES class_control (id),
    FOREIGN KEY (student_id) REFERENCES student (id),
    UNIQUE(student_id, class_control_id)
);

-- Scheduled jobs
CREATE TABLE scheduled_job (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('CRON','FIXED_DELAY','FIXED_RATE')),
  cron_expression TEXT,
  interval_ms INTEGER,
  initial_delay_ms INTEGER DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_run_at_ms BIGINT,
  last_status TEXT,
  payload_json JSONB,
  updated_at_ms BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000),
  
  CONSTRAINT valid_job_type CHECK (
    (type = 'CRON' AND cron_expression IS NOT NULL) OR
    (type IN ('FIXED_DELAY','FIXED_RATE') AND interval_ms IS NOT NULL)
  )
);

CREATE INDEX idx_scheduled_job_active ON scheduled_job(active);

-- Function and trigger for updated_at
CREATE OR REPLACE FUNCTION update_scheduled_job_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at_ms := (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::BIGINT;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_scheduled_job_touch_updated_at
BEFORE UPDATE ON scheduled_job
FOR EACH ROW
EXECUTE FUNCTION update_scheduled_job_timestamp();

-- Holidays
CREATE TABLE holiday (
  id           SERIAL PRIMARY KEY,
  date         DATE NOT NULL,
  name         TEXT NOT NULL,
  scope        TEXT NOT NULL CHECK (scope IN ('national','state','city')),
  region_code  TEXT,
  type         TEXT NOT NULL,
  source       TEXT,
  notes        TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_holiday_date_scope_region UNIQUE (date, scope, region_code)
);

-- Function and trigger for holiday updated_at
CREATE OR REPLACE FUNCTION update_holiday_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at := CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_holiday_touch_updated_at
BEFORE UPDATE ON holiday
FOR EACH ROW
EXECUTE FUNCTION update_holiday_timestamp();