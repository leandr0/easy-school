SELECT
            cc.id AS class_id,
            cc.name AS class_name,
            s.id AS student_id,
            s.name AS student_name,
            ccs.course_price,
            s.due_date
            FROM course_class_students ccs
            INNER JOIN course_class cc
            ON ccs.course_class_id = cc.id
            INNER JOIN student s
            ON ccs.student_id = s.id
            WHERE s.status = true
            AND
            cc.status = true
            ORDER BY s.id ASC;

select * from roles;			

INSERT INTO roles (role,code) VALUES ('ADMIN',100);
INSERT INTO roles (role,code) VALUES ('TEACHER',200);
INSERT INTO roles (role,code) VALUES ('STUDENT',300);


select u.id,u.username, r.role from users u
inner join user_roles ur
on u.id = ur.user_id
inner join roles r
on r.id = ur.role_id;
--1865316b-3301-4ecd-b601-9d88ce74b6d4

delete from users
where username =



select * from teacher;
delete from teacher where id = 13;


insert into course_class_students (course_class_id, student_id,course_price) values (1,1,345.00);
select * from revenue_course_class_students;


select * from course_class_students
where course_class_id = 1;

select * from user_roles;


UPDATE revenue 
SET status = 'OPEN', paid = false, payment_sent = false, reminder_sent = false;

select * from course c
inner join course_class cc
on c.
;



select * from users
where username = 'teacher@easyschool.com.br';



ALTER TABLE users
    ADD COLUMN name TEXT,
    ADD COLUMN phone_number TEXT;

ALTER TABLE teacher
    ADD COLUMN user_id UUID,
	ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE student
    ADD COLUMN user_id UUID,
	ADD FOREIGN KEY (user_id) REFERENCES users (id);	

select * from student
where email = 'student@easyschool.com.br';
UPDATE teacher SET email = 'teacher@easyschool.com.br'
WHERE id = 19;

UPDATE student
SET name = 'Student Test',
phone_number = '11 97873-7845'
WHERE id = (select id from users
where username = 'student@easyschool.com.br');


UPDATE student
SET user_id = (select id from users
where username = 'student@easyschool.com.br')
WHERE email = 'student@easyschool.com.br';


UPDATE teacher
SET user_id = (select id from users
where username = 'teacher@easyschool.com.br')
WHERE email = 'teacher@easyschool.com.br';

SELECT s.id,t.id,u.* FROM users u
LEFT JOIN student s
ON u.id = s.user_id
LEFT JOIN teacher t
ON u.id = t.user_id
WHERE u.status = true
AND u.username = 'teacher@easyschool.com.br';


INSERT INTO users (username, password_hash, status,name, phone_number) 
VALUES ('fred@easyschool.com.br', crypt('123456', gen_salt('bf', 12)), true, 'Fred Jones', '1199876-4321') RETURNING id

select * from teacher;

update teacher set user_id = 'f4c096cf-457b-44a8-bde8-88193e340203'
where id = 2;


select * from users;

select * from roles;

insert into user_roles (user_id, role_id)
values ('f4c096cf-457b-44a8-bde8-88193e340203',3);


select u.username, r.role  from user_roles ur
inner join users u
on u.id = ur.user_id
inner join roles r
on r.id = ur.role_id
where u.username = 'teste@user.creation.br';


SELECT * FROM roles;

SELECT * FROM teacher;

SELECT * FROM student;

select count(*) from user_roles; --20

SELECT 
u.name as user_name
, r.role as role_name
,t.name as teacher_name
--,s.name as student_name 
FROM user_roles ur
INNER JOIN users u
ON u.id = ur.user_id
INNER JOIN roles r
ON r.id = ur.role_id
--INNER JOIN student s
--ON u.id = s.user_id
INNER JOIN teacher t
ON u.id = t.user_id
;


SELECT
  u.id,
  u.username,
  u.name,
  s.id  AS student_id,
  t.id  AS teacher_id,
  ARRAY_REMOVE(ARRAY_AGG(DISTINCT r.role), NULL) AS roles
FROM users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r       ON r.id = ur.role_id
LEFT JOIN student s     ON s.user_id = u.id
LEFT JOIN teacher t     ON t.user_id = u.id
WHERE s.user_id IS NOT NULL
   OR t.user_id IS NOT NULL
GROUP BY u.id, u.username, u.name, s.id, t.id
ORDER BY u.username;


SELECT
  u.id,
  u.username,
  u.name,
  s.id AS student_id,
  t.id AS teacher_id,
  ARRAY_REMOVE(ARRAY_AGG(DISTINCT r.role), NULL) AS roles
FROM users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r       ON r.id = ur.role_id
LEFT JOIN student s     ON s.user_id = u.id
LEFT JOIN teacher t     ON t.user_id = u.id
WHERE s.user_id IS NOT NULL
   OR t.user_id IS NOT NULL
GROUP BY u.id, u.username, u.name, s.id, t.id
ORDER BY u.username;

INSERT INTO user_roles (user_id,role_id)
VALUES ('f4c096cf-457b-44a8-bde8-88193e340203',1);


SELECT * FROM teacher;

SELECT 
    'TEACHER' AS profile,
    t.id,
    t.name,
    t.email,
    t.phone_number,
    t.status,
    t.start_date
FROM teacher t
WHERE t.user_id IS NULL

UNION ALL

SELECT 
    'STUDENT' AS profile,
    s.id,
    s.name,
    s.email,
    s.phone_number,
    s.status,
    s.start_date
FROM student s
WHERE s.user_id IS NULL

ORDER BY profile, name;
