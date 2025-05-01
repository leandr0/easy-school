DELETE FROM users WHERE name <> 'User';
SET TIME ZONE 'America/Sao_Paulo';

INSERT INTO empresa_prestadora (name,cnpj,image_url,site_url,active)
VALUES ('Torre Seeker','34.916.234/0001-03','bla/bla','www.torreseeker.com.br',true);

INSERT INTO empresa_prestadora (name,cnpj,image_url,site_url,active)
VALUES ('Busca Torre','25.675.057/0001-11','bla/ble','www.buscatorre.com.br',true);

INSERT INTO empresa_prestadora (name,cnpj,image_url,site_url,active)
VALUES ('Mapeando Torres','53.133.876/0001-72','bla/bli','www.mapeandotorres.com.br',true);

INSERT INTO empresa_prestadora (name,cnpj,image_url,site_url,active)
VALUES ('Achei Torres','05.974.910/0001-99','bla/blo','www.acheitorres.com.br',true);

INSERT INTO empresa_prestadora (name,cnpj,image_url,site_url,active)
VALUES ('Titi Torres','19.121.944/0001-45','bla/blu','www.tititorres.com.br',true);


INSERT INTO users (name,email,password,active)
VALUES ('Genivaldo Martins','gm@target.com.br','$2b$10$3B.if8ZOXOZPW1twTa3lyuYodS5WdEHH0fV8FtAyV6ybsFs4pQuwy',true);

INSERT INTO users (name,email,password,active)
VALUES ('Herculano Torres','ht@target.com.br','$2b$10$3B.if8ZOXOZPW1twTa3lyuYodS5WdEHH0fV8FtAyV6ybsFs4pQuwy',true);

INSERT INTO users (name,email,password,active)
VALUES ('Adamastor Fonseca','af@target.com.br','$2b$10$3B.if8ZOXOZPW1twTa3lyuYodS5WdEHH0fV8FtAyV6ybsFs4pQuwy',true);

INSERT INTO users (name,email,password,active)
VALUES ('Francisco Silva','fs@target.com.br','$2b$10$3B.if8ZOXOZPW1twTa3lyuYodS5WdEHH0fV8FtAyV6ybsFs4pQuwy',true);

INSERT INTO users (name,email,password,active)
VALUES ('Adalberto Springfield','as@target.com.br','$2b$10$3B.if8ZOXOZPW1twTa3lyuYodS5WdEHH0fV8FtAyV6ybsFs4pQuwy',true);

INSERT INTO users (name,email,password,active)
VALUES ('Heleno Capixaba','hc@target.com.br','$2b$10$3B.if8ZOXOZPW1twTa3lyuYodS5WdEHH0fV8FtAyV6ybsFs4pQuwy',true);

INSERT INTO users (name,email,password,active)
VALUES ('Adjailson Vieira','av@target.com.br','$2b$10$3B.if8ZOXOZPW1twTa3lyuYodS5WdEHH0fV8FtAyV6ybsFs4pQuwy',true);


DO $$
DECLARE
    email_value VARCHAR(255) = 'gm@target.com.br';
    user_id UUID;
BEGIN
    -- Assign a value to the variable using a SELECT statement
    SELECT id INTO user_id FROM users WHERE email = email_value LIMIT 1;
    
  INSERT INTO prestador (user_id,name,email,cpf,image_url,active)
  VALUES (user_id,'Genivaldo Martins',email_value,'783.646.510-13','/customers/evil-rabbit.png',true);
END $$;

DO $$
DECLARE
    email_value VARCHAR(255) = 'ht@target.com.br';
    user_id UUID;
BEGIN
    -- Assign a value to the variable using a SELECT statement
    SELECT id INTO user_id FROM users WHERE email = email_value LIMIT 1;
    
    -- Use the variable in an INSERT statement
    INSERT INTO prestador (user_id,name,email,cpf,image_url,active)
		VALUES (user_id,'Herculano Torres',email_value,'538.717.330-16','/customers/balazs-orban.png',true);
END $$;

DO $$
DECLARE
    email_value VARCHAR(255) = 'af@target.com.br';
    user_id UUID;
BEGIN
    -- Assign a value to the variable using a SELECT statement
    SELECT id INTO user_id FROM users WHERE email = email_value LIMIT 1;
    INSERT INTO prestador (user_id,name,email,cpf,image_url,active)
    VALUES (user_id,'Adamastor Fonseca',email_value,'156.192.080-01','/customers/amy-burns.png',false);
END $$;

DO $$
DECLARE
    email_value VARCHAR(255) = 'fs@target.com.br';
    user_id UUID;
BEGIN
    -- Assign a value to the variable using a SELECT statement
    SELECT id INTO user_id FROM users WHERE email = email_value LIMIT 1;
    INSERT INTO prestador (user_id,name,email,cpf,image_url,active)
    VALUES (user_id,'Francisco Silva',email_value,'348.448.830-11','/customers/balazs-orban.png',true);
END $$;

DO $$
DECLARE
    email_value VARCHAR(255) = 'as@target.com.br';
    user_id UUID;
BEGIN
    -- Assign a value to the variable using a SELECT statement
    SELECT id INTO user_id FROM users WHERE email = email_value LIMIT 1;
    INSERT INTO prestador (user_id,name,email,cpf,image_url,active)
    VALUES (user_id,'Adalberto Springfield',email_value,'360.808.740-08','/customers/michael-novotny.png',true);
END $$;

DO $$
DECLARE
    email_value VARCHAR(255) = 'hc@target.com.br';
    user_id UUID;
BEGIN
    -- Assign a value to the variable using a SELECT statement
    SELECT id INTO user_id FROM users WHERE email = email_value LIMIT 1;
INSERT INTO prestador (user_id,name,email,cpf,image_url,active)
VALUES (user_id,'Heleno Capixaba',email_value,'130.026.050-50','/customers/lee-robinson.png',true);
END $$;

DO $$
DECLARE
    email_value VARCHAR(255) = 'av@target.com.br';
    user_id UUID;
BEGIN
    -- Assign a value to the variable using a SELECT statement
    SELECT id INTO user_id FROM users WHERE email = email_value LIMIT 1;
INSERT INTO prestador (user_id,name,email,cpf,image_url,active)
VALUES (user_id,'Adjailson Vieira',email_value,'274.542.110-70','/customers/delba-de-oliveira.png',true);
END $$;


INSERT INTO empresa_contratante (name,cnpj,image_url,site_url,active)
VALUES('VIVO','92.304.161/0001-97','img/01','vivo.com.br',true);

INSERT INTO empresa_contratante (name,cnpj,image_url,site_url,active)
VALUES('CLARO','99.917.456/0001-88','img/02','claro.com.br',true);

INSERT INTO empresa_contratante (name,cnpj,image_url,site_url,active)
VALUES('TIM','86.288.767/0001-83','img/03','tim.com.br',true);


DO $$
DECLARE
    email_value VARCHAR(255) = 'as@vivo.com.br';
    user_id UUID;
    empresa_value VARCHAR(255) = 'VIVO';
    empresa_contratante_id UUID;
    cpf_value VARCHAR(255) = '885.014.640-07';
    name_value VARCHAR(255) = 'Ana Silva';
BEGIN
		
    -- Create user
    INSERT INTO users (name,email,password,active)
		VALUES (name_value,email_value,'$2b$10$3B.if8ZOXOZPW1twTa3lyuYodS5WdEHH0fV8FtAyV6ybsFs4pQuwy',true);
    
    -- Assign a value to the variable using a SELECT statement
    SELECT id INTO user_id FROM users WHERE email = email_value LIMIT 1;
    SELECT id INTO empresa_contratante_id FROM empresa_contratante WHERE name = empresa_value LIMIT 1;
    
    -- Insert values 
    INSERT INTO contratante (user_id,empresa_contratante_id,name,email,cpf,image_url,active)
    VALUES (user_id,empresa_contratante_id,name_value,email_value,cpf_value,'/customers/delba-de-oliveira.png',true);
END $$;

DO $$
DECLARE
    email_value VARCHAR(255) = 'tl@tim.com.br';
    user_id UUID;
    empresa_value VARCHAR(255) = 'TIM';
    empresa_contratante_id UUID;
    cpf_value VARCHAR(255) = '162.348.160-02';
    name_value VARCHAR(255) = 'Tereza Lima';
BEGIN
		
    -- Create user
    INSERT INTO users (name,email,password,active)
		VALUES (name_value,email_value,'$2b$10$3B.if8ZOXOZPW1twTa3lyuYodS5WdEHH0fV8FtAyV6ybsFs4pQuwy',true);
    
    -- Assign a value to the variable using a SELECT statement
    SELECT id INTO user_id FROM users WHERE email = email_value LIMIT 1;
    SELECT id INTO empresa_contratante_id FROM empresa_contratante WHERE name = empresa_value LIMIT 1;
    
    -- Insert values 
    INSERT INTO contratante (user_id,empresa_contratante_id,name,email,cpf,image_url,active)
    VALUES (user_id,empresa_contratante_id,name_value,email_value,cpf_value,'/customers/delba-de-oliveira.png',true);
END $$;

DO $$
DECLARE
    email_value VARCHAR(255) = 'hq@claro.com.br';
    user_id UUID;
    empresa_value VARCHAR(255) = 'CLARO';
    empresa_contratante_id UUID;
    cpf_value VARCHAR(255) = '649.495.750-15';
    name_value VARCHAR(255) = 'Helena Queirós';
BEGIN
		
    -- Create user
    INSERT INTO users (name,email,password,active)
		VALUES (name_value,email_value,'$2b$10$3B.if8ZOXOZPW1twTa3lyuYodS5WdEHH0fV8FtAyV6ybsFs4pQuwy',true);
    
    -- Assign a value to the variable using a SELECT statement
    SELECT id INTO user_id FROM users WHERE email = email_value LIMIT 1;
    SELECT id INTO empresa_contratante_id FROM empresa_contratante WHERE name = empresa_value LIMIT 1;
    
    -- Insert values 
    INSERT INTO contratante (user_id,empresa_contratante_id,name,email,cpf,image_url,active)
    VALUES (user_id,empresa_contratante_id,name_value,email_value,cpf_value,'/customers/delba-de-oliveira.png',true);
END $$;


select ctt.name,empctt.name,ptd.name,empptd.name FROM solicitacao stt
INNER JOIN contratante ctt
ON stt.contratante_id = ctt.id
INNER JOIN empresa_contratante empctt
ON empctt.id = stt.empresa_contratante_id
INNER JOIN empresa_prestadora empptd
ON empptd.id = stt.empresa_prestadora_id
INNER JOIN prestador ptd
ON ptd.id = stt.prestador_id;

-- Solicitação
DO $$
DECLARE
		contratante_name VARCHAR(255) = 'Tereza Lima';
	    empresa_contratante_name VARCHAR(255) = 'TIM';
	    prestador_name VARCHAR(255) = 'Adalberto Springfield';
	    empresa_prestadora_name VARCHAR(255) = 'Achei Torres';
		contratante_id	UUID;
	    empresa_contratante_id UUID;
	    empresa_prestadora_id UUID;
	    prestador_id UUID;
BEGIN
		SELECT id INTO contratante_id FROM contratante WHERE name = contratante_name LIMIT 1;
	  	SELECT id INTO empresa_contratante_id FROM empresa_contratante WHERE name = empresa_contratante_name LIMIT 1;
	  	SELECT id INTO empresa_prestadora_id FROM empresa_prestadora WHERE name = empresa_prestadora_name LIMIT 1;
	  	SELECT id INTO prestador_id FROM prestador WHERE name = prestador_name LIMIT 1;
		-- Insert solicitacao 
	  	INSERT INTO solicitacao (
	      --contratante_id ,empresa_contratante_id,empresa_prestadora_id,
		  prestador_id,descricao,latitude,longitude,cidade,estado,
		  data,status,active,
		  	codigo_empresa,
			codigo_prestadora,
			codigo_candidato,
			alt_soi,
			pre_comar,
			limite_ev,
			altura_edificacao,
			alt_max_ev_mastros
	    	)
		VALUES (--contratante_id,empresa_contratante_id,empresa_prestadora_id,
		prestador_id,
         'Torre Norte de Bertioga','23°48''53.21"S','46° 2''44.39"W','SP','Bertioga',NOW(),'New',true
		 ,'SPRNS','SPRNS','D','50m','n/a',
		 '40m','N/A','27,5M');
END $$;

-- Coordenada
DO $$
DECLARE
	
BEGIN
		-- Insert coordenada 
	  	INSERT INTO coordenada (
	      	ring_lat, 
			ring_long,
			candidato_lat,
			candidato_long,
			ring_lat_dec ,
			ring_long_dec ,
			candidato_lat_dec,
			candidato_long_dec)
		VALUES ('23°48''53.21""S','46°2''44.39""W','23°48''54.02""S','46°2''38.72""W',
				'-23,810886','-46,043811°','-23.815006°','-46.044089');
END $$;


-- Relatório Candidato
DO $$
DECLARE	
		solicitacao_id	UUID;
	    coordenada_id UUID = '0ba337e5-85e6-46bc-be04-12fc6f1f12fc';
		
BEGIN
		SELECT id INTO solicitacao_id FROM solicitacao WHERE codigo_prestadora = 'SPRNS' LIMIT 1;
	  
		-- Insert relatorio_candidato 
	  	INSERT INTO relatorio_candidato (
	      	solicitacao_id,
		  	coordenada_id,
			tipo_site,endereco,
			complemento,bairro,
			estado,distrito,
			cidade,cep,
			vlr_aluguel_negociado,vlr_aluguel_referencia,
			vlr_venda_negociado,vlr_venda_referencia,
			distancia_pn_sarf_ge,alt_antenas_rf,
			alt_max_ev_mastros,alt_candidato_gps_ge,
			alt_estrutura_vertical,alt_edificacao)
		VALUES (solicitacao_id,coordenada_id
			,'GREENFIELD','R VOTORIO GUIDOLIN 270',
			'N/A','REMANSO',
			'SP','SÃO PAULO',
			'SÃO PAULO','11250-000',
			'EM NEGOCIAÇÃO','S/I',
			'N/A','N/A',
			'165M','27,5m',
			'27,5M','8M',
			'N/A','N/A');
END $$;

DO $$

	DECLARE	
		--8cf0f4da-d8c2-483e-81c8-21d10133b72c
		--50622bf5-6468-47c5-a9fe-b574de2004a3
		propriedade_id	UUID = '8cf0f4da-d8c2-483e-81c8-21d10133b72c';
	    file_name VARCHAR(255) = 'Teste001.jpeg';
		file_path VARCHAR(255) = '/Users/lrgoncalves/Downloads/WhatsApp Image 2024-11-13 at 14.26.48.jpeg';
		
	BEGIN

		INSERT INTO arquivo_relatorio_candidato (nome,propriedade_id, data) 
		VALUES (file_name,propriedade_id ,bytea(bytea_import(file_path)));
END $$;
		