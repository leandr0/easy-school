
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
    start_date NUMERIC NOT NULL
   -- UNIQUE(phone_number),
   -- UNIQUE(email)
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
    duration_hour INTEGER NOT NULL,
    duration_minute INTEGER NOT NULL,
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