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
  u.password,
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

SELECT
  u.id,
  u.password_hash,
  u.locked_until,
  u.failed_attempts,
  u.username,
  u.name,
  COALESCE(s.id, t.id) AS profile_id,
  CASE
    WHEN s.user_id IS NOT NULL THEN 'student'
    WHEN t.user_id IS NOT NULL THEN 'teacher'
  END AS profile_type,
  COALESCE(s.email, t.email) AS email,
  ARRAY_REMOVE(ARRAY_AGG(DISTINCT r.role), NULL) AS roles
FROM users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r       ON r.id = ur.role_id
LEFT JOIN student s     ON s.user_id = u.id
LEFT JOIN teacher t     ON t.user_id = u.id
WHERE
  (s.user_id IS NOT NULL OR t.user_id IS NOT NULL)            -- must have a profile
  AND u.status = TRUE                                         -- user must be active
  AND (                                                       -- profile must be active
       (s.user_id IS NOT NULL AND s.status = TRUE)
    OR (t.user_id IS NOT NULL AND t.status = TRUE)
  )
  AND (                                                       -- email matches on either side
       s.email = 'fred@easyschool.com.br'
    OR t.email = 'fred@easyschool.com.br'
  )
GROUP BY
  u.id, u.username, u.name,
  COALESCE(s.id, t.id),
  CASE
    WHEN s.user_id IS NOT NULL THEN 'student'
    WHEN t.user_id IS NOT NULL THEN 'teacher'
  END,
  COALESCE(s.email, t.email)
ORDER BY u.username;


INSERT INTO user_roles (user_id,role_id)
VALUES ('f4c096cf-457b-44a8-bde8-88193e340203',1);


SELECT * FROM teacher;

UPDATE teacher set status = true where id = 2;

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





 SELECT
    u.id,
    u.username,
    u.name,
    --COALESCE(s.email, t.email)                    AS email,
	u.username,
    COALESCE(s.id, t.id)                          AS profile_id,
    CASE
      WHEN s.user_id IS NOT NULL THEN 'student'
      WHEN t.user_id IS NOT NULL THEN 'teacher'
      ELSE 'admin'
    END                                           AS profile_type,
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT r.role), NULL) AS roles
  FROM users u
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  LEFT JOIN roles r       ON r.id = ur.role_id
  LEFT JOIN student s     ON s.user_id = u.id
  LEFT JOIN teacher t     ON t.user_id = u.id
	WHERE
--    (s.user_id IS NOT NULL OR t.user_id IS NOT NULL)
    --AND 
	u.status = TRUE
  --  AND ( (s.user_id IS NOT NULL AND u.status = TRUE)
--	OR (t.user_id IS NOT NULL AND u.status = TRUE) )
    --AND (s.email = :login OR t.email = :login)
  GROUP BY
    u.id, u.username, u.name,
    --COALESCE(s.email, t.email),
	u.username,
    COALESCE(s.id, t.id),
    CASE
      WHEN s.user_id IS NOT NULL THEN 'student'
      WHEN t.user_id IS NOT NULL THEN 'teacher'
      ELSE 'admin'
    END
  ORDER BY u.username;

  ALTER TABLE user_roles RENAME TO user_roles_bkp;

  CREATE TABLE IF NOT EXISTS student (
    id SERIAL PRIMARY KEY,
    due_date INTEGER NOT NULL,
	user_id  UUID,
	FOREIGN KEY (user_id ) REFERENCES users (id),
	UNIQUE(user_id)
);

  CREATE TABLE IF NOT EXISTS teacher (
    id SERIAL PRIMARY KEY,
    compensation DECIMAL NOT NULL,
	user_id  UUID,
	FOREIGN KEY (user_id ) REFERENCES users (id),
	UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
 	id SERIAL PRIMARY KEY,
    user_id UUID    NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    UNIQUE (user_id, role_id)
);

select *

from teacher_bkp;


select  
'INSERT INTO users (username, password_hash,name,phone_number) VALUES ('''||email||''','''||  crypt('123456', gen_salt('bf', 12))||''','''|| name ||''','''||phone_number|| ''');'
from teacher_bkp ;

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


INSERT INTO users (username, password_hash,name,phone_number) VALUES ('teacher@easyschool.com.br','$2a$12$yaGoY.d.RUJiYrP98E1UP.xu0f22zHvanZnHi/.VAUHat8xu1L8vu','Professor Teste','55 95674-0987');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('fred@easyschool.com.br','$2a$12$xZD9UbMUJUCVXZltSRyzfuRweKDBOUQ5XRjzdYjK/QrrwVK9o1tbS','Fred Jones','1199876-4321');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('velma@easyschool.com','$2a$12$M2uswO6aqNbJaG47trcN1e7Af10Es6VwT4rKHFBvzQGGwmdwO.A2a','Velma Dinkley','11 98765-1234');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('salsicha@easyschool.com.br','$2a$12$FdJ8Npp98APvdtvIcP2xeOhNi60NaTGNbBcG.2S/LE2sAt8TSTV3m','Salsicha Rogers','1189765-7869');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('scoob@easyschool.com.br','$2a$12$aoiHFEEAgW2XtcaJBvNZD.VCCqTTPlzz/nJLXd4KGNCBsNoLAFGGC','Scooby Doo','1199987-7599');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('daphne@easyschool.com','$2a$12$zMyy0cvxf2U2McARNsiYrONfgYhj5VZnHVR3li3TlElVyP/gDzJSO','Daphne Blake','1178907-6543');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('test@teste.com.br','$2a$12$PDxE14B8FoT8FN8/Z1dsKOo8/F9SNP41UJPuf/ppxaYQ55IxYDvr.','Teste A','11 98800-5533');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('carmela@easyschool.com.br','$2a$12$BG55bV5NqdHN0Kg1ycFjjeEa2jSanV0smqSdNVHforp2/hocZoejq','Carmela Stellantis','39 351 382 4833');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('prof@availability.com.br','$2a$12$/stYH2fgCQiZQOHTbk0aD.BWDcvo3ihRKZbbtg0truZso888qmZHS','Professor sem Availability','77 98765-1234');
INSERT INTO users (username, password_hash,name,phone_number) VALUES('adm@easyschool.com',crypt('123456', gen_salt('bf', 12)),'Administrador','11 9876-1234');


select * from teacher;

select 
'INSERT INTO teacher (compensation, user_id) VALUES ('||t.compensation||','''||u.id||''');'
from teacher_bkp t
inner join users u
on t.email = u.username

INSERT INTO teacher (compensation, user_id) VALUES (22.15,'29f8f10a-3c0d-47cc-9eaf-ed0c9650b6de');
INSERT INTO teacher (compensation, user_id) VALUES (77.75,'a21a5aec-08d5-4138-aef2-90a566507f43');
INSERT INTO teacher (compensation, user_id) VALUES (80.33,'086e065c-e245-4b74-a60b-b2a66a0efcac');
INSERT INTO teacher (compensation, user_id) VALUES (33.57,'7c774585-d051-48f7-82a9-0ac358afad4d');
INSERT INTO teacher (compensation, user_id) VALUES (77.75,'b52190b8-976d-4a8b-9822-e886f718ae08');
INSERT INTO teacher (compensation, user_id) VALUES (80.33,'735bdfc0-ec42-43e4-ae95-67b746fe740c');
INSERT INTO teacher (compensation, user_id) VALUES (80.33,'bd517dcf-f52d-4f3e-95d7-6135e9795473');
INSERT INTO teacher (compensation, user_id) VALUES (43.35,'1c74c073-267d-4666-b267-7be4b32735b9');
INSERT INTO teacher (compensation, user_id) VALUES (23.54,'bc2ad8ed-0ef2-4bb7-9b25-e7546f4a9e3b');

select * from student_bkp;

select  
'INSERT INTO users (username, password_hash,name,phone_number) VALUES ('''||email||''','''||  crypt('123456', gen_salt('bf', 12))||''','''|| name ||''','''||phone_number|| ''');'
from student_bkp ;

select 
'INSERT INTO student (due_date, user_id) VALUES ('||t.compensation||','''||u.id||''');'
from student_bkp t
inner join users u
on t.email = u.username


select * from users;

INSERT INTO users (username, password_hash,name,phone_number) VALUES ('tygra@esyschool.com.br','$2a$12$fJPLO/vRORzTu3uPYizodOAsVt/WkEpY8Q66f/3b8NIOajCf/fMh6','Tygra','11 77665-3355');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('cheetara@esyschool.com.br','$2a$12$o9JrgCbJCsGOv0p/wF5k6eigVJCr7cQw0wJ7LN5Gss7TvmmNMRcT.','Cheetara','11 88776-9977');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('wkat@esyschool.com.br','$2a$12$OMBajwJiMqUB9RkbBxWUhevfhiiyzG.cTpuCGqRlRTVVZ25tlCYGG','Willy Kat','11 66778-4455');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('wkit@esyschool.com.br','$2a$12$ifgQxOTUvf0e5P25hGAiue80gzCC01lxmLK9IDP.45MMmMDJO6C8O','Willy Kit','11 66775-0099');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('lion@esyschool.com.br','$2a$12$hLw6dFoeWB2cjHNtyvBgIe0RZ06/1WjG1NY3Hc/fz/Albt49qyaO.','Lion-O','11 99876-58765');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('lynx@easyschool.com.br','$2a$12$rIw.Kl3tOFdbN9X.mJKrCutHE00RDk1ZhX0j59IrxX/ag085C5LBS','Lynx-O','11 88776-4453');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('bengali@easyschool.com.br','$2a$12$QiWMoQfUToEHdZUbuv9j6u7Zktjs.XABVj7seg7/m24YiD/CY18ZG','Bengali','11 77665-9900');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('pumyra@easyschool.com.br','$2a$12$f0IJVLhdPoIcf7hxkrc7au3J.1O2l5tSX8hhJDjN.CwjFO9Pv3FJS','Pumyra','11 33445-1235');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('jaga@easyschool.com.br','$2a$12$RbIWOMllAfTwhFfU3kyuM.DrOqwKqpf1QlfW5DkhKg4F1eVarmh1W','Jaga','11 77665-8877');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('snarf@easyschool.com.br','$2a$12$/P2NztaNCUU2xlyfdj7nougmHf7NacdaACNYuqLg2TpVFmi1Rvu2O','Snarf','11 77665-5678');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('snarfinho@easyschool.com.br','$2a$12$HKcq3njLYk4BZx5d8lJhU.aLLgyQL7BN8QbZgAuWFH3.HN3s2mrIi','Snarfinho','11 33442-7864');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('claud@easyschool.com.br','$2a$12$t.fTjIJYoOSSEMDNEAovvuO91JpFO9lNbvJ4zXjhIKydEOIKq7TFW','Claud-Us','11 55431-8753');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('mummra@easyschool.com.br','$2a$12$E8hT1CHdhlpm28v8/AnjL.3s88gtu.HLXIkq6leVLaTvUYL82/H/6','Mumm-Ra','11 944553-7756');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('escamoso@easyschool.com.br','$2a$12$Ga1DL9St/CL3npvw97BCcu9Hm.RIHVGbnqzXem7gad3d2Bd8MOwVu','Escamoso','90088-6612');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('abutre@easyschool.com.br','$2a$12$8an7aYTxEHmeGGvj3cttNeMcwM7tM7PISJn0UQvYdl91M4jCrzfOG','Abutre','11 95533-7564');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('simiano@easyschool.com.br','$2a$12$S8MrrEXnD.R4dJod25GKn.8O8S.1LeO7.VF55TaMZshVo1WWWK5va','Simiano','11 95566-3412');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('panthro@esyschool.com.br','$2a$12$71s7Z.x9n9Ob91PPMij6m.mRSkB87F6C1N/7b9TLFCnUd/G6ZTtN2','Panthro','11 67898-8765');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('berenice@easyschool.com.br','$2a$12$ZUway7h.wonPfbJ2LKbNPukbizUiqVDw1q0ZXucB/.wEj.xdS2rDW','Berenice Berê Felinus','39 355 382 4833');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('aluno@teste.com.br','$2a$12$yzbzyAf72cuZ2EweI.2Fv.8AbEZ90rWH9BdTtyJUgAMUUjJkR/9Pe','Aluno Testado','44 93456-8765');
INSERT INTO users (username, password_hash,name,phone_number) VALUES ('student@easyschool.com.br','$2a$12$gCKs5XEz/RmeHO5doJP.buwIsqe0Wu4vajVw1zEhy.vY/uJ4X0gZm','Student Test','11 97873-7845');


select * from student;
select 
'INSERT INTO student (due_date, user_id) VALUES ('||s.due_date||','''||u.id||''');'
from student_bkp s
inner join users u
on s.email = u.username


INSERT INTO student (due_date, user_id) VALUES (20,'abf4b747-86ab-4c78-ba85-bc8faced15a7');
INSERT INTO student (due_date, user_id) VALUES (5,'f6b73857-6b2d-49cd-8ce7-7d7f728d7f91');
INSERT INTO student (due_date, user_id) VALUES (10,'277a9ada-b2f1-45c8-ad0d-6040f0a08c09');
INSERT INTO student (due_date, user_id) VALUES (5,'94aa0386-8329-470b-a27c-63bacddd25e0');
INSERT INTO student (due_date, user_id) VALUES (5,'da1d2678-c14f-40f1-8334-f4ea7e4b40ed');
INSERT INTO student (due_date, user_id) VALUES (10,'baad43d5-49d5-4f4a-b6e3-618c59816b33');
INSERT INTO student (due_date, user_id) VALUES (20,'b199670b-cc8d-4799-82cb-b0c6b259ceb0');
INSERT INTO student (due_date, user_id) VALUES (20,'95cdd8ec-23e8-4565-ac5d-f9361f10cd3d');
INSERT INTO student (due_date, user_id) VALUES (20,'a46cf9a9-e6c6-4fb7-8637-f5109f537589');
INSERT INTO student (due_date, user_id) VALUES (5,'6fc45890-38af-4384-bbce-2bfcee285678');
INSERT INTO student (due_date, user_id) VALUES (5,'dbacfe9f-79cd-4706-a13f-b156594b528e');
INSERT INTO student (due_date, user_id) VALUES (20,'5abec830-9219-4048-abb0-d9594d2e1471');
INSERT INTO student (due_date, user_id) VALUES (5,'2770dfcd-a63c-4640-b98d-0bf4867c0812');
INSERT INTO student (due_date, user_id) VALUES (5,'802d1f73-ec9b-4b1e-90f9-655d0226fd94');
INSERT INTO student (due_date, user_id) VALUES (5,'40ef8e33-98c9-4e25-8811-58c31433062d');
INSERT INTO student (due_date, user_id) VALUES (10,'b93135fb-49eb-439c-9817-2b50d83ce869');
INSERT INTO student (due_date, user_id) VALUES (20,'ac67311c-6acb-4279-8010-2fc560a7250c');
INSERT INTO student (due_date, user_id) VALUES (5,'f2f57a7f-4e7f-4d34-a05a-89993c5bda84');
INSERT INTO student (due_date, user_id) VALUES (10,'5026a28b-3774-4976-9792-ece18496fc68');
INSERT INTO student (due_date, user_id) VALUES (10,'92bc2988-2fa0-431d-965d-b600549387dc');



select  urb.role_id 
from user_roles_bkp urb
inner join users_bkp ub
on ub.id = urb.user_id
inner join student_bkp t
on ub.username = t.email;

select * from user_roles_bkp;

select * from users_bkp;

--ADM 100 - 1
--TEACHER 200 - 3
--STUDENT 300 - 4

select 
'INSERT INTO user_roles (user_id,role_id) VALUES ('''||u.id||''','||4||');'
from teacher s
inner join users u
on s.user_id = u.id;

INSERT INTO user_roles (user_id,role_id) VALUES ('abf4b747-86ab-4c78-ba85-bc8faced15a7',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('f6b73857-6b2d-49cd-8ce7-7d7f728d7f91',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('277a9ada-b2f1-45c8-ad0d-6040f0a08c09',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('94aa0386-8329-470b-a27c-63bacddd25e0',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('da1d2678-c14f-40f1-8334-f4ea7e4b40ed',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('baad43d5-49d5-4f4a-b6e3-618c59816b33',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('b199670b-cc8d-4799-82cb-b0c6b259ceb0',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('95cdd8ec-23e8-4565-ac5d-f9361f10cd3d',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('a46cf9a9-e6c6-4fb7-8637-f5109f537589',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('6fc45890-38af-4384-bbce-2bfcee285678',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('dbacfe9f-79cd-4706-a13f-b156594b528e',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('5abec830-9219-4048-abb0-d9594d2e1471',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('2770dfcd-a63c-4640-b98d-0bf4867c0812',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('802d1f73-ec9b-4b1e-90f9-655d0226fd94',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('40ef8e33-98c9-4e25-8811-58c31433062d',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('b93135fb-49eb-439c-9817-2b50d83ce869',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('ac67311c-6acb-4279-8010-2fc560a7250c',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('f2f57a7f-4e7f-4d34-a05a-89993c5bda84',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('5026a28b-3774-4976-9792-ece18496fc68',4);
INSERT INTO user_roles (user_id,role_id) VALUES ('92bc2988-2fa0-431d-965d-b600549387dc',4);




INSERT INTO user_roles (user_id,role_id) VALUES ('29f8f10a-3c0d-47cc-9eaf-ed0c9650b6de',3);
INSERT INTO user_roles (user_id,role_id) VALUES ('a21a5aec-08d5-4138-aef2-90a566507f43',3);
INSERT INTO user_roles (user_id,role_id) VALUES ('086e065c-e245-4b74-a60b-b2a66a0efcac',3);
INSERT INTO user_roles (user_id,role_id) VALUES ('7c774585-d051-48f7-82a9-0ac358afad4d',3);
INSERT INTO user_roles (user_id,role_id) VALUES ('b52190b8-976d-4a8b-9822-e886f718ae08',3);
INSERT INTO user_roles (user_id,role_id) VALUES ('735bdfc0-ec42-43e4-ae95-67b746fe740c',3);
INSERT INTO user_roles (user_id,role_id) VALUES ('bd517dcf-f52d-4f3e-95d7-6135e9795473',3);
INSERT INTO user_roles (user_id,role_id) VALUES ('1c74c073-267d-4666-b267-7be4b32735b9',3);
INSERT INTO user_roles (user_id,role_id) VALUES ('bc2ad8ed-0ef2-4bb7-9b25-e7546f4a9e3b',3);
INSERT INTO user_roles (user_id,role_id) VALUES ('e5189a4e-7152-46a2-9292-e9fc704a7506', 1);


select * from users;


SELECT
                        cc.id AS class_id,
                        cc.name AS class_name,
                        s.id AS student_id,
                        u.name AS student_name,
                        ccs.course_price,
                        s.due_date,
						u.created_at
                        FROM course_class_students ccs
                        INNER JOIN course_class cc
                        ON ccs.course_class_id = cc.id
                        INNER JOIN student s
                        ON ccs.student_id = s.id
            			INNER JOIN users u
            			ON s.user_id = u.id
                        WHERE u.status = true
                        AND
                        cc.status = true
						AND u.created_at >= DATE '2025-10-01'
                        ORDER BY s.id ASC

select * from course_class;



SELECT
    u.id,
    u.username,
    u.name,
    COALESCE(s.id, t.id)                          AS profile_id,
    CASE
      WHEN s.user_id IS NOT NULL THEN 'student'
      WHEN t.user_id IS NOT NULL THEN 'teacher'
      ELSE 'admin'
    END                                           AS profile_type,
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT r.role), NULL) AS roles
  FROM users u
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  LEFT JOIN roles r       ON r.id = ur.role_id
  LEFT JOIN student s     ON s.user_id = u.id
  LEFT JOIN teacher t     ON t.user_id = u.id
  WHERE
    u.status = TRUE
   -- AND  u.username = :login
  GROUP BY
    u.id, u.username, u.name,
    COALESCE(s.id, t.id),
    CASE
      WHEN s.user_id IS NOT NULL THEN 'student'
      WHEN t.user_id IS NOT NULL THEN 'teacher'
      ELSE 'admin'
    END
  ORDER BY u.username

select * from teacher;
select * from users;

select * from student s
inner join users u
on s.user_id = u.id
inner join course_class_students ccs
on s.id = ccs.student_id;

UPDATE teacher set user_id = 'a21a5aec-08d5-4138-aef2-90a566507f43'
where id = 2;


SELECT cc.* FROM course_class cc
INNER JOIN course_class_students ccs
ON cc.id = ccs.course_class_id
WHERE cc.status = true
AND ccs.student_id = 5;


select * from technical_config;



select r.role, u.* from users u
inner join user_roles ur
ON u.id = ur.user_id
inner join roles r
ON r.id = ur.role_id;

select * from user_roles
order by user_id;



SELECT COUNT(*) FROM roles
where id in (1,2,3);

select * from roles;