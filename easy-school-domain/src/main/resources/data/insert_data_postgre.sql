--insert into language (name,status,image_url ) values ( 'English',true, '/languages/united-kingdom.png');
--insert into language (name,status,image_url ) values ( 'Spanish',true, '/languages/spain.png');
--insert into language (name,status,image_url ) values ( 'Italian',true, '/languages/italy.png');
--insert into language (name,status,image_url ) values ( 'Mandarim',true, '/languages/china.png');
--insert into language (name,status,image_url ) values ( 'Grego',true, '/languages/greece.png');
--insert into language (name,status,image_url ) values ( 'Latim',true, '/languages/roma.png');

--insert into calendar_week_day (week_day ) values ( 'Segunda-feira');
--insert into calendar_week_day (week_day ) values ( 'Terça-feira');
--insert into calendar_week_day (week_day ) values ( 'Quarta-feira');
--insert into calendar_week_day (week_day ) values ( 'Quinta-feira');
--insert into calendar_week_day (week_day ) values ( 'Sexta-feira');
--insert into calendar_week_day (week_day ) values ( 'Sábado');


--INSERT INTO scheduled_job (name, type, cron_expression, active) VALUES ('reconcile-payments', 'CRON', '0 0 0 1 * ?', true);
--INSERT INTO scheduled_job (name, type, interval_ms, initial_delay_ms, active, payload_json) VALUES ('send-dunning-emails', 'FIXED_DELAY', 900000, 60000, false, '{"batchSize":200}');

--INSERT INTO revenues_message (payment_overdue_message,reminder_message) VALUES ('Hello, hello {nome}! Lembrete : seu pagamento no {valor} está atrasado.','Hello, hello {nome} ! Lembrete : Passando para lembrá-lo do pagamento de {valor} para o dia {data} !  ');

--INSERT INTO technical_config (code, param) VALUES (1,'http://api.whatsapp.com/send?phone={phone_number}&text={message}');

select * from student;


select * from revenue_message;

select * from technical_config;

