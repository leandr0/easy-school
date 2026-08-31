-- ============================================================================
-- easy-school Postgres schema — consolidated creation + updates + fixes.
--
-- This entire file is safe to run top-to-bottom on ANY of these:
--   1. A brand new, empty database (full bootstrap).
--   2. A database already fully migrated (everything becomes a no-op).
--   3. A database in some in-between state (only the missing pieces apply).
--
-- Every CREATE/ALTER below either uses IF NOT EXISTS or is wrapped in a
-- guard that checks first, so re-running this script is always safe.
-- ============================================================================

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

-- Revenue course class students
CREATE TABLE IF NOT EXISTS revenue_course_class_students (
    id SERIAL PRIMARY KEY,
    course_class_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    course_price DECIMAL NOT NULL,
	revenue_id INTEGER NOT NULL,
    FOREIGN KEY (course_class_id) REFERENCES course_class (id),
    FOREIGN KEY (student_id) REFERENCES student (id),
	FOREIGN KEY (revenue_id) REFERENCES revenue (id),
    UNIQUE(student_id, course_class_id,revenue_id)
);
ALTER TABLE revenue_course_class_students
  ALTER COLUMN course_price TYPE double precision
  USING course_price::double precision;

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
CREATE TABLE IF NOT EXISTS scheduled_job (
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

CREATE INDEX IF NOT EXISTS idx_scheduled_job_active ON scheduled_job(active);

-- Function and trigger for updated_at
CREATE OR REPLACE FUNCTION update_scheduled_job_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at_ms := (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::BIGINT;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_scheduled_job_touch_updated_at ON scheduled_job;
CREATE TRIGGER trg_scheduled_job_touch_updated_at
BEFORE UPDATE ON scheduled_job
FOR EACH ROW
EXECUTE FUNCTION update_scheduled_job_timestamp();

-- Holidays
CREATE TABLE IF NOT EXISTS holiday (
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

DROP TRIGGER IF EXISTS trg_holiday_touch_updated_at ON holiday;
CREATE TRIGGER trg_holiday_touch_updated_at
BEFORE UPDATE ON holiday
FOR EACH ROW
EXECUTE FUNCTION update_holiday_timestamp();


CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username         CITEXT NOT NULL UNIQUE,            -- or email
    password_hash    TEXT   NOT NULL,                   -- stores PHC string (e.g. $argon2id$...)
    status           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at    TIMESTAMPTZ,
    failed_attempts  INTEGER NOT NULL DEFAULT 0,
    locked_until     TIMESTAMPTZ,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS roles (
    id    SERIAL PRIMARY KEY,
    role  TEXT NOT NULL UNIQUE,
    code  INTEGER NOT NULL UNIQUE
);

-- Many-to-many: a user can have multiple roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID    NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Permissions per path (if you're mapping URL paths)
CREATE TABLE IF NOT EXISTS role_paths (
    id      SERIAL  PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    path    TEXT    NOT NULL,
    UNIQUE (role_id, path)
);

-- 1. Add the new columns (no-op if already present, e.g. via the CREATE TABLE above)
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS name TEXT,
    ADD COLUMN IF NOT EXISTS phone_number TEXT;

ALTER TABLE teacher
    ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE student
    ADD COLUMN IF NOT EXISTS user_id UUID;

-- FK constraints don't support IF NOT EXISTS, so guard them explicitly.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        WHERE tc.table_name = 'teacher'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'user_id'
    ) THEN
        ALTER TABLE teacher ADD FOREIGN KEY (user_id) REFERENCES users (id);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        WHERE tc.table_name = 'student'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'user_id'
    ) THEN
        ALTER TABLE student ADD FOREIGN KEY (user_id) REFERENCES users (id);
    END IF;
END $$;

ALTER TABLE users
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN phone_number SET NOT NULL;

ALTER TABLE student
DROP COLUMN name,
DROP COLUMN phone_number,
DROP COLUMN email,
DROP COLUMN status,
DROP COLUMN start_date;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_users_username') THEN
        ALTER TABLE users ADD CONSTRAINT uq_users_username UNIQUE (username);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_users_phone_number') THEN
        ALTER TABLE users ADD CONSTRAINT uq_users_phone_number UNIQUE (phone_number);
    END IF;
END $$;

-- Books & chapters
CREATE TABLE IF NOT EXISTS book (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS chapter (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    FOREIGN KEY (book_id) REFERENCES book (id),
    UNIQUE(book_id, position)
);

-- Class control: reference the book/chapter taught in the class
ALTER TABLE class_control
    ADD COLUMN IF NOT EXISTS book_id INTEGER REFERENCES book (id),
    ADD COLUMN IF NOT EXISTS chapter_id INTEGER REFERENCES chapter (id);

-- Teacher/Student are now created from UserGateway together with the linked
-- `users` row (see UserGateway#create). name/phone_number/email/status/start_date
-- moved to `users` and are no longer populated by the Teacher/Student entities.
-- Some environments already dropped these legacy columns from teacher/student
-- by hand, others still have them as NOT NULL — guard on existence so this
-- migration is safe to run either way.
DO $$
DECLARE
    tbl TEXT;
    col TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY['teacher', 'student'] LOOP
        FOREACH col IN ARRAY ARRAY['name', 'phone_number', 'email', 'status', 'start_date'] LOOP
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = tbl AND column_name = col
            ) THEN
                EXECUTE format('ALTER TABLE %I ALTER COLUMN %I DROP NOT NULL', tbl, col);
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Some environments still have FK constraints left pointing at the pre-migration
-- `student_bkp` / `teacher_bkp` copies (created when those tables were renamed
-- away and recreated). Repoint any that are still stale back to the live
-- `student` / `teacher` tables. Safe no-op elsewhere.
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT
            tc.constraint_name,
            tc.table_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name NOT LIKE '%\_bkp' ESCAPE '\'
          AND ccu.table_name IN ('student_bkp', 'teacher_bkp')
    LOOP
        EXECUTE format(
            'ALTER TABLE %I DROP CONSTRAINT %I',
            rec.table_name, rec.constraint_name
        );
        EXECUTE format(
            'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I (id)',
            rec.table_name, rec.constraint_name, rec.column_name,
            replace(rec.foreign_table_name, '_bkp', '')
        );
    END LOOP;
END $$;
