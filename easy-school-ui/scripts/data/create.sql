DROP TABLE IF EXISTS energia;
DROP TABLE IF EXISTS agua;
DROP TABLE IF EXISTS telecomunicacao;
DROP TABLE IF EXISTS caracteristica;
DROP TABLE IF EXISTS propriedade;
DROP TABLE IF EXISTS empresa_prestadora_prestador;
DROP TABLE IF EXISTS empresa_prestadora_empresa_contratante;
DROP TABLE IF EXISTS solicitacao;
DROP TABLE IF EXISTS empresa_prestadora;
DROP TABLE IF EXISTS prestador;
DROP TABLE IF EXISTS contratante;
DROP TABLE IF EXISTS empresa_contratante;

SET TIME ZONE 'America/Sao_Paulo';

CREATE TABLE IF NOT EXISTS empresa_prestadora (
       	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       	name VARCHAR(255) NOT NULL,
       	cnpj TEXT NOT NULL UNIQUE,
  			image_url TEXT,
	  		site_url TEXT,
       	active BOOL NOT NULL
     );
     
CREATE TABLE IF NOT EXISTS prestador (
       	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  			user_id UUID NOT NULL,
       	name VARCHAR(255) NOT NULL,
			  email VARCHAR(255) NOT NULL,
       	cpf TEXT NOT NULL UNIQUE,
  			image_url TEXT,
	  		active BOOL NOT NULL,
        CONSTRAINT fk_user_prestador
            FOREIGN KEY(user_id) 
              REFERENCES users(id)
           );     

CREATE TABLE IF NOT EXISTS empresa_prestadora_prestador (
  			prestador_id UUID NOT NULL,
				empresa_prestadora_id UUID NOT NULL,
	  		active BOOL NOT NULL,
  			UNIQUE (prestador_id, empresa_prestadora_id),
        CONSTRAINT fk_empresa_prestadora_prestador
            FOREIGN KEY(empresa_prestadora_id) 
              REFERENCES empresa_prestadora(id),
  			CONSTRAINT fk_prestador_empresa_prestadora
            FOREIGN KEY(prestador_id) 
              REFERENCES prestador(id)
           );

CREATE TABLE IF NOT EXISTS empresa_contratante (
       	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       	name VARCHAR(255) NOT NULL,
       	cnpj TEXT NOT NULL UNIQUE,
  			image_url TEXT,
	  		site_url TEXT,
       	active BOOL NOT NULL
     );

CREATE TABLE IF NOT EXISTS contratante (
       	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  			user_id UUID NOT NULL,
  			empresa_contratante_id UUID NOT NULL,
       	name VARCHAR(255) NOT NULL,
			  email VARCHAR(255) NOT NULL,
       	cpf TEXT NOT NULL UNIQUE,
  			image_url TEXT,
	  		active BOOL NOT NULL,
        CONSTRAINT fk_user_contratante
            FOREIGN KEY(user_id) 
              REFERENCES users(id)
           ,
        CONSTRAINT fk_contratante_empresa_contratante
            FOREIGN KEY(empresa_contratante_id) 
              REFERENCES empresa_contratante(id)
           );


CREATE TABLE IF NOT EXISTS empresa_prestadora_empresa_contratante (
  			empresa_contratante_id UUID NOT NULL,
				empresa_prestadora_id UUID NOT NULL,
	  		active BOOL NOT NULL,
  			UNIQUE (empresa_contratante_id, empresa_prestadora_id),
        CONSTRAINT fk_empresa_prestadora_empresa_contratante
            FOREIGN KEY(empresa_prestadora_id) 
              REFERENCES empresa_prestadora(id),
  			CONSTRAINT fk_empresa_contratante_empresa_prestadora
            FOREIGN KEY(empresa_contratante_id) 
              REFERENCES empresa_contratante(id)
           );
/**
ALTER TABLE solicitacao
ALTER COLUMN contratante_id DROP NOT NULL,
ALTER COLUMN empresa_contratante_id DROP NOT NULL,
ALTER COLUMN prestador_id SET NOT NULL;
**/
-- Solicitação
CREATE TABLE IF NOT EXISTS solicitacao (
       	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  			contratante_id UUID--, NOT NULL,
  			empresa_contratante_id UUID ,--NOT NULL,
  			empresa_prestadora_id UUID,
  			prestador_id UUID NOT NULL,
	       	descricao VARCHAR(255) NOT NULL,
	        latitude VARCHAR(255) NOT NULL,
	        longitude VARCHAR(255) NOT NULL,
	  		cidade VARCHAR(255) NOT NULL,
 			estado VARCHAR(255) NOT NULL,
			codigo_empresa VARCHAR(255) NOT NULL,
			codigo_prestadora VARCHAR(255) NOT NULL,
			codigo_candidato VARCHAR(255) NOT NULL,
			alt_soi VARCHAR(255) NOT NULL,		
			pre_comar VARCHAR(255) NOT NULL,				
			limite_ev VARCHAR(255) NOT NULL,				
			altura_edificacao VARCHAR(255) NOT NULL,				
			alt_max_ev_mastros VARCHAR(255) NOT NULL,		
  			data TIMESTAMP WITH TIME ZONE NOT NULL,
  			status TEXT NOT NULL,
	  		active BOOL NOT NULL,
        CONSTRAINT fk_solicitacao_contratante
            FOREIGN KEY(contratante_id) 
              REFERENCES contratante(id)
           ,
        CONSTRAINT fk_solicitacao_empresa_contratante
            FOREIGN KEY(empresa_contratante_id) 
              REFERENCES empresa_contratante(id)
           ,
        CONSTRAINT fk_solicitacao_empresa_prestadora
            FOREIGN KEY(empresa_prestadora_id) 
              REFERENCES empresa_prestadora(id)
           ,
        CONSTRAINT fk_solicitacao_prestador
            FOREIGN KEY(prestador_id) 
              REFERENCES prestador(id)
           );

CREATE TABLE IF NOT EXISTS coordenada(
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	ring_lat VARCHAR(255) NOT NULL,
	ring_long VARCHAR(255) NOT NULL,	 
	candidato_lat VARCHAR(255) NOT NULL,	
	candidato_long VARCHAR(255) NOT NULL,
	ring_lat_dec VARCHAR(255) NOT NULL,	
	ring_long_dec VARCHAR(255) NOT NULL,	 
	candidato_lat_dec VARCHAR(255) NOT NULL,	
	candidato_long_dec VARCHAR(255) NOT NULL
)

CREATE TABLE IF NOT EXISTS relatorio_candidato(
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	solicitacao_id UUID NOT NULL,
	coordenada_id UUID NOT NULL,
	tipo_site VARCHAR(255) NOT NULL,	
	endereco VARCHAR(255) NOT NULL,	
	complemento VARCHAR(255) NOT NULL,	
	bairro VARCHAR(255) NOT NULL,
	estado VARCHAR(255) NOT NULL,
	distrito VARCHAR(255) NOT NULL,
	cidade VARCHAR(255) NOT NULL,
	cep VARCHAR(255) NOT NULL,
	vlr_aluguel_negociado VARCHAR(255) NOT NULL,
	vlr_aluguel_referencia VARCHAR(255) NOT NULL,
	vlr_venda_negociado VARCHAR(255) NOT NULL,
	vlr_venda_referencia VARCHAR(255) NOT NULL,
	distancia_pn_sarf_ge VARCHAR(255) NOT NULL,
	alt_antenas_rf VARCHAR(255) NOT NULL,
	alt_max_ev_mastros VARCHAR(255) NOT NULL,
	alt_candidato_gps_ge VARCHAR(255) NOT NULL,
	alt_estrutura_vertical VARCHAR(255) NOT NULL,
	alt_edificacao VARCHAR(255) NOT NULL,
	CONSTRAINT fk_relatorio_candidato_solicitacao
            FOREIGN KEY(solicitacao_id) 
              REFERENCES solicitacao(id),
	CONSTRAINT fk_relatorio_candidato_coordenada
            FOREIGN KEY(coordenada_id) 
              REFERENCES coordenada(id)		  
);



CREATE TABLE propriedade(
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	solicitacao_id UUID NOT NULL,
	tipo_propriedade VARCHAR(255) NOT NULL,
	construcao_existente VARCHAR(10) NOT NULL,
	construcao_regular VARCHAR(255),
	area_total_imovel VARCHAR(255) NOT NULL,
	matricula_transcricao VARCHAR(255) NOT NULL,
	altura_edificacao VARCHAR(255) NOT NULL,
	area_locada VARCHAR(255) NOT NULL,
	iptu_itr VARCHAR(255) NOT NULL,
	acesso_local VARCHAR(255) NOT NULL,
	prazo_locacao VARCHAR(255) NOT NULL,
	confrontante_lateral_direita VARCHAR(255) NOT NULL,
	confrontante_lateral_esquerda VARCHAR(255) NOT NULL,
	confrontante_fundos VARCHAR(255) NOT NULL,
	CONSTRAINT fk_propriedade_solicitacao
            FOREIGN KEY(solicitacao_id) 
              REFERENCES solicitacao(id)
);

CREATE TABLE energia(
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	propriedade_id UUID NOT NULL,
	necessario_extensao VARCHAR(10) NOT NULL,
	distancia_extensao VARCHAR(255),
	energia_provisoria VARCHAR(10) NOT NULL,
	energia_ponto_emissao VARCHAR(10) NOT NULL,
	distancia_medidor_energia VARCHAR(255) NOT NULL,
	distancia_transformador VARCHAR(255) NOT NULL,
	tensao_energia VARCHAR(255) NOT NULL,
	concessionaria_energia VARCHAR(255) NOT NULL,
	CONSTRAINT fk_energia_propriedade
            FOREIGN KEY(propriedade_id) 
              REFERENCES propriedade(id)
);

CREATE TABLE agua(
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	propriedade_id UUID NOT NULL,
	agua_instalada VARCHAR(10) NOT NULL,
	distancia_agua VARCHAR(255) NOT NULL,
	rede_esgoto VARCHAR(10) NOT NULL,
	distancia_rede_esgoto VARCHAR(255) NOT NULL,
	CONSTRAINT fk_agua_propriedade
            FOREIGN KEY(propriedade_id) 
              REFERENCES propriedade(id)
);

CREATE TABLE telecomunicacao (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	propriedade_id UUID NOT NULL,
	rede_telefone_fixo_movel VARCHAR(10) NOT NULL,
	cobertura_celular VARCHAR(10) NOT NULL,
	possui_fibra VARCHAR(10) NOT NULL,
	localizacao_dgo VARCHAR(255) NOT NULL,
	CONSTRAINT fk_telecomunicacao_propriedade
            FOREIGN KEY(propriedade_id) 
              REFERENCES propriedade(id)
);

CREATE TABLE caracteristica (
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	propriedade_id UUID NOT NULL,
	topografia VARCHAR(255) NOT NULL,
	sujeito_enchentes VARCHAR(10) NOT NULL,
	necessario_extensao_acesso VARCHAR(10) NOT NULL,
	metros_extensao VARCHAR(255) NOT NULL,
	metros_melhoria VARCHAR(255) NOT NULL,
	demolicao_remocao VARCHAR(10) NOT NULL,
	demolicao_autoriazada VARCHAR(10) NOT NULL,
	uso_guindaste VARCHAR(10) NOT NULL,
	observacao_guindaste VARCHAR(255) NOT NULL,
	descricao_acesso_propriedade VARCHAR(255) NOT NULL,
	descricao_restricao_inicio_obra VARCHAR(255) NOT NULL,
	descricao_proprietario_propriedade VARCHAR(255) NOT NULL,
	observacao VARCHAR(255) NOT NULL,
	roteiro VARCHAR(255) NOT NULL,
	informacao_adicional VARCHAR(255) NOT NULL,
	CONSTRAINT fk_telecomunicacao_propriedade
            FOREIGN KEY(propriedade_id) 
              REFERENCES propriedade(id)
);

--DROP TABLE IF EXISTS arquivo_relatorio_candidato;
CREATE TABLE arquivo_relatorio_candidato (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255),
    data bytea,
	propriedade_id UUID NOT NULL,
	CONSTRAINT fk_arquivo_relatorio_candidato_propriedade
            FOREIGN KEY(propriedade_id) 
              REFERENCES propriedade(id)
);