
CREATE TABLE IF NOT EXISTS student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    status BOOL NOT NULL,
    due_date INTEGER NOT NULL,
    --course_price REAL NOT NULL,
    start_date NUMERIC NOT NULL
);


CREATE TABLE IF NOT EXISTS language (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status BOOL NOT NULL,
    language_id INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (language_id) REFERENCES language (id),
    UNIQUE(name)
);


CREATE TABLE IF NOT EXISTS teacher (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    status BOOL NOT NULL,
    compensation REAL NOT NULL,
    start_date NUMERIC NOT NULL,
    UNIQUE(phone_number),
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS teacher_skill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    language_id INTEGER NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher (id),
    FOREIGN KEY (language_id) REFERENCES language (id),
    UNIQUE(teacher_id,language_id)
);

CREATE TABLE IF NOT EXISTS course_class (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    course_id INTEGER NOT NULL,
    status BOOL NOT NULL,
    teacher_id INTEGER NOT NULL,
    start_hour INTEGER NOT NULL,
    start_minute INTEGER NOT NULL,
    end_hour INTEGER NOT NULL,
    end_minute INTEGER NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course (id),
    FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);


CREATE TABLE IF NOT EXISTS course_class_students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_class_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    course_price REAL NOT NULL,
    FOREIGN KEY (course_class_id) REFERENCES course_class (id),
    FOREIGN KEY (student_id) REFERENCES student (id),
    UNIQUE(student_id,course_class_id)
);

CREATE TABLE IF NOT EXISTS revenue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    paid BOOL,
    payment_sent BOOL,
    reminder_sent BOOL,
    status TEXT NOT NULL,
    amount REAL NOT NULL,
    due_date INTEGER NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student (id),
    UNIQUE(student_id,month,year)
);


CREATE TABLE IF NOT EXISTS calendar_week_day(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    week_day TEXT NOT NULL,
    UNIQUE(week_day)
);

CREATE TABLE IF NOT EXISTS course_class_calendar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_class_id INTEGER NOT NULL,
    calendar_week_day_id INTEGER NOT NULL,
    FOREIGN KEY (course_class_id) REFERENCES course_class (id),
    FOREIGN KEY (calendar_week_day_id) REFERENCES calendar_week_day (id),
    UNIQUE(calendar_week_day_id,course_class_id)
);


CREATE TABLE IF NOT EXISTS calendar_range_hour_day(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    calendar_week_day_id INTEGER NOT NULL,
    start_hour INTEGER NOT NULL,
    end_hour INTEGER NOT NULL,
    start_minute INTEGER NOT NULL,
    end_minute INTEGER NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher (id),
    FOREIGN KEY (calendar_week_day_id) REFERENCES calendar_week_day (id),
    UNIQUE(calendar_week_day_id,start_hour,start_minute,teacher_id),
    UNIQUE(calendar_week_day_id,end_hour,end_minute,teacher_id)
);

CREATE TABLE IF NOT EXISTS technical_config(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code INTEGER NOT NULL,
    param TEXT NOT NULL,
    UNIQUE(code)
);

CREATE TABLE IF NOT EXISTS class_control(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    replacement BOOL NOT NULL,
    content TEXT NOT NULL,
    course_class_id NOT NULL,
    FOREIGN KEY (course_class_id) REFERENCES course_class (id),
    UNIQUE(day,month,year,course_class_id)
);

CREATE TABLE IF NOT EXISTS class_control_teacher(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_control_id INTEGER NOT NULL,
    teacher_id NOT NULL,
    FOREIGN KEY (class_control_id) REFERENCES class_control (id),
    FOREIGN KEY (teacher_id) REFERENCES teacher (id),
    UNIQUE(teacher_id,class_control_id)
);

CREATE TABLE IF NOT EXISTS class_control_student(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_control_id INTEGER NOT NULL,
    student_id NOT NULL,
    FOREIGN KEY (class_control_id) REFERENCES class_control (id),
    FOREIGN KEY (student_id) REFERENCES student (id),
    UNIQUE(student_id,class_control_id)
);



-- V1__init.sql (SQLite)
--DROP TRIGGER IF EXISTS trg_scheduled_job_touch_updated_at;
-- Core table
CREATE TABLE scheduled_job (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  name               TEXT    NOT NULL UNIQUE,
  type               TEXT    NOT NULL CHECK (type IN ('CRON','FIXED_DELAY','FIXED_RATE')),
  cron_expression    TEXT,             -- required if type=CRON
  interval_ms        INTEGER,          -- required if FIXED_*
  initial_delay_ms   INTEGER DEFAULT 0,
  active             INTEGER NOT NULL DEFAULT 1,  -- 1=true, 0=false
  last_run_at_ms     INTEGER,             -- store as ISO-8601 text (e.g., '2025-08-13T22:05:00Z')
  last_status        TEXT,             -- e.g., SUCCESS | FAILED
  payload_json       TEXT,             -- JSON as TEXT in SQLite
  updated_at_ms         TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),

  -- Ensure required fields depending on type
  CHECK (
    (type = 'CRON' AND cron_expression IS NOT NULL)
    OR
    (type IN ('FIXED_DELAY','FIXED_RATE') AND interval_ms IS NOT NULL)
  )
);

-- Helpful index
CREATE INDEX idx_scheduled_job_active ON scheduled_job(active);

-- Keep updated_at fresh on UPDATE
--DROP TRIGGER IF EXISTS trg_scheduled_job_touch_updated_at;

CREATE TRIGGER trg_scheduled_job_touch_updated_at
AFTER UPDATE ON scheduled_job
FOR EACH ROW
WHEN NEW.updated_at_ms = OLD.updated_at_ms  -- prevent recursion
BEGIN
  UPDATE scheduled_job
  SET updated_at_ms = CAST(strftime('%s','now') AS INTEGER) * 1000
  WHERE id = NEW.id;
END;


PRAGMA foreign_keys=off;

CREATE TABLE holiday (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  date         TEXT    NOT NULL,                 -- 'YYYY-MM-DD'
  name         TEXT    NOT NULL,
  scope        TEXT    NOT NULL CHECK (scope IN ('national','state','city')),
  region_code  TEXT,
  type         TEXT    NOT NULL,
  source       TEXT,
  notes        TEXT,
  created_at   TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at   TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  CONSTRAINT uq_holiday_date_scope_region UNIQUE (date, scope, region_code)
);  

DROP TRIGGER IF EXISTS trg_holiday_touch_updated_at;
CREATE TRIGGER trg_holiday_touch_updated_at
AFTER UPDATE ON holiday
FOR EACH ROW WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE holiday SET updated_at = strftime('%Y-%m-%d %H:%M:%f','now') WHERE id = NEW.id;
END;