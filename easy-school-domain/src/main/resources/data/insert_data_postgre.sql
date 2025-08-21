insert into language (name,status,image_url ) values ( 'English',true, '/languages/united-kingdom.png');
insert into language (name,status,image_url ) values ( 'Spanish',true, '/languages/spain.png');
insert into language (name,status,image_url ) values ( 'Italian',true, '/languages/italy.png');
insert into language (name,status,image_url ) values ( 'Mandarim',true, '/languages/china.png');
insert into language (name,status,image_url ) values ( 'Greek',true, '/languages/greece.png');
insert into language (name,status,image_url ) values ( 'Latim',true, '/languages/roma.png');

insert into calendar_week_day (week_day ) values ( 'Segunda-feira');
insert into calendar_week_day (week_day ) values ( 'Terça-feira');
insert into calendar_week_day (week_day ) values ( 'Quarta-feira');
insert into calendar_week_day (week_day ) values ( 'Quinta-feira');
insert into calendar_week_day (week_day ) values ( 'Sexta-feira');
insert into calendar_week_day (week_day ) values ( 'Sábado');


INSERT INTO scheduled_job (name, type, cron_expression, active) VALUES ('reconcile-payments', 'CRON', '0 0 0 1 * ?', true);
INSERT INTO scheduled_job (name, type, interval_ms, initial_delay_ms, active, payload_json) VALUES ('send-dunning-emails', 'FIXED_DELAY', 900000, 60000, false, '{batchSize:200}');


INSERT INTO technical_config (code, param) VALUES (1,'http://api.whatsapp.com/send?phone={phone_number}&text={message}');

INSERT INTO revenue_message (payment_overdue_message,reminder_message ) VALUES ( 'Hello, hello , {nome} ! identificamos o atraso do pagamento no valor de  R${valor} que venceu dia {data}!','Hello, hello , {nome} ! passando para lembrá-lo do R${valor} que vence dia {data}!');



INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Panthro','11 67898-8765','panthro@esyschool.com.br',true,10,'2025-03-11 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Tygra','11 77665-3355','tygra@esyschool.com.br',true,20,'2024-03-11 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Cheetara','11 88776-9977','cheetara@esyschool.com.br',true,5,'2025-03-11 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Willy Kat','11 66778-4455','wkat@esyschool.com.br',true,10,'2013-11-10 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Willy Kit','11 66775-0099','wkit@esyschool.com.br',true,5,'2025-03-11 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Lion-O','11 99876-58765','lion@esyschool.com.br',true,5,'2013-01-14 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Lynx-O','11 88776-4453','lynx@easyschool.com.br',true,10,'2013-11-10 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Bengali','11 77665-9900','bengali@easyschool.com.br',true,20,'2025-05-01 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Pumyra','11 33445-1235','pumyra@easyschool.com.br',true,20,'2025-03-11 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Jaga','11 77665-8877','jaga@easyschool.com.br',true,20,'2013-01-14 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Snarf','11 77665-5678','snarf@easyschool.com.br',true,5,'2025-05-01 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Snarfinho','11 33442-7864','snarfinho@easyschool.com.br',true,5,'2025-05-01 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Claud-Us','11 55431-8753','claud@easyschool.com.br',true,20,'2024-03-11 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Mumm-Ra','11 944553-7756','mummra@easyschool.com.br',true,5,'2013-11-10 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Escamoso','90088-6612','escamoso@easyschool.com.br',true,5,'2025-05-01 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Abutre','11 95533-7564','abutre@easyschool.com.br',true,5,'2013-11-10 21:00:00');
INSERT INTO student (name,phone_number,email,status,due_date,start_date) VALUES ('Simiano','11 95566-3412','simiano@easyschool.com.br',true,10,'2025-05-01 21:00:00');



INSERT INTO teacher (name,phone_number,email,status,compensation,start_date) VALUES ('Velma Dinkley','11 98765-1234','velma@easyschool.com',true,80.33,'2025-07-31 21:00:00');
INSERT INTO teacher (name,phone_number,email,status,compensation,start_date) VALUES ('Fred Jones','1199876-4321','fred@easyschool.com.br',true,77.75,'2025-08-04 21:00:00');
INSERT INTO teacher (name,phone_number,email,status,compensation,start_date) VALUES ('Salsicha Rogers','1189765-7869','salsicha@easyschool.com.br',true,33.57,'2025-07-06 21:00:00');
INSERT INTO teacher (name,phone_number,email,status,compensation,start_date) VALUES ('Daphne Blake','1178907-6543','daphne@easyschool.com',true,80.33,'2024-03-11 21:00:00');
INSERT INTO teacher (name,phone_number,email,status,compensation,start_date) VALUES ('Scooby Doo','1199987-7599','scoob@easyschool.com.br',true,77.75,'2025-05-14 21:00:00');

INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (1,7,19,0,22,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (1,9,19,0,22,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (1,8,7,0,10,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (1,10,7,0,10,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (2,7,7,0,10,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (2,9,7,0,10,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (2,9,18,0,21,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (2,7,18,0,21,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (3,7,7,0,11,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (3,10,7,0,11,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (3,9,7,0,11,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (3,8,7,0,11,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (4,8,19,0,22,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (4,10,19,0,22,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (4,9,19,0,22,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (4,7,19,0,22,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (4,10,7,0,10,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (4,8,7,0,10,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (5,8,7,0,10,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (5,9,7,0,10,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (5,7,7,0,10,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (5,7,19,0,22,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (5,10,7,0,10,0);
INSERT INTO calendar_range_hour_day (teacher_id,calendar_week_day_id,start_hour,start_minute,end_hour,end_minute) VALUES (5,9,19,0,22,0);


INSERT INTO course (name,status,language_id,price) VALUES ('English-A1-M',true,7,350);
INSERT INTO course (name,status,language_id,price) VALUES ('English-C2-N',true,7,450);
INSERT INTO course (name,status,language_id,price) VALUES ('Latim Básico',true,12,760);
INSERT INTO course (name,status,language_id,price) VALUES ('Greek A1',true,11,350);
INSERT INTO course (name,status,language_id,price) VALUES ('Spanish A1',true,8,350);
INSERT INTO course (name,status,language_id,price) VALUES ('Mandarim A1',true,10,760);
INSERT INTO course (name,status,language_id,price) VALUES ('Italian A1',true,9,450);


INSERT INTO course_class (name,course_id,status,teacher_id,start_hour,start_minute,end_hour,end_minute) VALUES ('En-M-A1',1,true,3,7,0,8,0);
INSERT INTO course_class (name,course_id,status,teacher_id,start_hour,start_minute,end_hour,end_minute) VALUES ('En-N-C2',2,true,4,19,30,20,30);
INSERT INTO course_class (name,course_id,status,teacher_id,start_hour,start_minute,end_hour,end_minute) VALUES ('Lt-M-A1',3,true,5,7,30,8,30);
INSERT INTO course_class (name,course_id,status,teacher_id,start_hour,start_minute,end_hour,end_minute) VALUES ('Md-M-A1',6,true,3,7,0,9,0);
INSERT INTO course_class (name,course_id,status,teacher_id,start_hour,start_minute,end_hour,end_minute) VALUES ('Gk-N-A1',4,true,4,7,0,8,0);
INSERT INTO course_class (name,course_id,status,teacher_id,start_hour,start_minute,end_hour,end_minute) VALUES ('It-N-A1',7,true,4,20,0,21,0);
INSERT INTO course_class (name,course_id,status,teacher_id,start_hour,start_minute,end_hour,end_minute) VALUES ('Es-M-A1',5,true,1,8,0,9,0);
INSERT INTO course_class (name,course_id,status,teacher_id,start_hour,start_minute,end_hour,end_minute) VALUES ('En-N-C2-B',2,true,2,20,0,21,0);

--
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (1,9);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (2,8);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (2,10);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (3,8);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (3,10);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (4,8);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (4,10);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (5,8);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (5,10);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (6,7);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (6,8);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (6,9);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (6,10);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (6,11);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (7,7);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (7,8);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (7,9);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (7,10);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (7,11);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (8,7);
INSERT INTO course_class_calendar (course_class_id,calendar_week_day_id) VALUES (8,9);


INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (1,2,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (1,5,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (1,10,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (1,17,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (2,6,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (2,8,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (2,14,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (2,15,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (3,5,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (3,9,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (3,16,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (3,17,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (4,8,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (4,9,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (4,10,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (4,11,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (4,12,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (5,15,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (5,16,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (5,17,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (5,8,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (5,9,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (6,10,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (6,11,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (6,12,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (6,13,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (6,14,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (6,15,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (8,2,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (8,3,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (8,4,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (8,7,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (8,9,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (8,15,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (8,17,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (7,1,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (7,7,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (7,8,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (7,9,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (7,10,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (7,11,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (7,12,500.001);
INSERT INTO course_class_students (course_class_id,student_id,course_price) VALUES (7,13,500.001);

INSERT INTO teacher_skill (teacher_id,language_id) VALUES (1,7);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (1,8);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (1,9);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (2,7);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (2,12);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (3,7);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (3,10);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (4,7);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (4,9);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (4,11);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (5,7);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (5,8);
INSERT INTO teacher_skill (teacher_id,language_id) VALUES (5,12);