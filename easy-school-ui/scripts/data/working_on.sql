select * from propriedade;
select * from energia;
select * from agua;
select * from telecomunicacao;
select * from caracteristica;

select 
          coordenada.id,ring_lat,ring_long,candidato_lat,candidato_long,
          ring_lat_dec,ring_long_dec,candidato_lat_dec,candidato_long_dec
      from coordenada 
      INNER JOIN relatorio_candidato
      ON coordenada.id = relatorio_candidato.coordenada_id

SELECT column_name
  FROM information_schema.columns
 WHERE table_schema = 'public'
   AND table_name   = 'caracteristica';


    select 
        propriedade.id,
        solicitacao_id,
        tipo_propriedade,
        construcao_existente,
        construcao_regular,
        area_total_imovel,
        matricula_transcricao,
        propriedade.altura_edificacao,
        area_locada,
        iptu_itr,
        acesso_local,
        prazo_locacao,
        confrontante_lateral_direita,
        confrontante_lateral_esquerda,
        confrontante_fundos
      from propriedade
      INNER JOIN solicitacao
      ON solicitacao.id = propriedade.solicitacao_id



	  delete from propriedade 
	  where id 
	  IN ('32a5a283-9123-491a-b530-6e071ad06da8',
					'd2fd4cdb-f114-421c-ac43-da9f8f2c1b51',
					'4693a5f2-41f8-47bf-b617-6a76ad676654');

	 delete from caracteristica 
	 where propriedade_id
	 IN ('32a5a283-9123-491a-b530-6e071ad06da8',
					'd2fd4cdb-f114-421c-ac43-da9f8f2c1b51',
					'4693a5f2-41f8-47bf-b617-6a76ad676654');




select 
        propriedade.id,
        solicitacao_id,
        tipo_propriedade,
        construcao_existente,
        construcao_regular,
        area_total_imovel,
        matricula_transcricao,
        propriedade.altura_edificacao,
        area_locada,
        iptu_itr,
        acesso_local,
        prazo_locacao,
        confrontante_lateral_direita,
        confrontante_lateral_esquerda,
        confrontante_fundos
      from propriedade
      INNER JOIN solicitacao
      ON solicitacao.id = propriedade.solicitacao_id
      WHERE solicitacao.id ='c1318767-186b-48a1-b8ec-5676bac06537'


TRUNCATE TABLE solicitacao CASCADE;
TRUNCATE TABLE agua;
TRUNCATE TABLE energia;
TRUNCATE TABLE telecomunicacao;
TRUNCATE TABLE caracteristica;

DELETE FROM solicitacao
WHERE id <> 'dfacf2d6-e26e-49e8-af86-ccc21a085f5d'

SELECT
	column_name
FROM
	information_schema.columns
WHERE
	table_schema = 'public'
	AND table_name = 'relatorio_candidato';

UPDATE solicitacao SET active = 'true' WHERE id = 'a929c9d4-f950-41b1-aff4-d7db1f975ea7' RETURNING id,active;

select * from caracteristica;
select * from coordenada;
select solicitacao.id, propriedade.id as propriedade_id from solicitacao
LEFT JOIN propriedade
ON solicitacao.id = propriedade.solicitacao_id
select * from propriedade;
select * from relatorio_candidato
where solicitacao_id = 'c1318767-186b-48a1-b8ec-5676bac06537';












SELECT
          solicitacao.id,
          solicitacao.empresa_contratante_id,
          solicitacao.descricao,
          solicitacao.cidade,
          solicitacao.estado,
          solicitacao.prestador_id,
          solicitacao.data,
          solicitacao.status,
          prestador.image_url as prestador_image_url,
          prestador.name as prestador_name,
          empresa_contratante.image_url as operadora_image_url,
          propriedade.id as propriedade_id
          
        FROM solicitacao
        JOIN prestador ON prestador.id = solicitacao.prestador_id
        JOIN empresa_contratante ON empresa_contratante.id = solicitacao.empresa_contratante_id 
        LEFT JOIN propriedade
        ON solicitacao.id = propriedade.solicitacao_id
        WHERE
			solicitacao.active = 'true' AND (	
          solicitacao.descricao ILIKE '%' OR
          prestador.name::text ILIKE '%' OR
          solicitacao.data::text ILIKE '%' OR
          solicitacao.status ILIKE '%' )
          
        ORDER BY solicitacao.data DESC