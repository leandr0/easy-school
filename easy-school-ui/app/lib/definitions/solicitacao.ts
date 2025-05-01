export type SolicitacoesTable = {
  id: string;
  contratante_id: string; // pessoa que criou a solicitação
  empresa_contratante_id: string; // VIVO
  empresa_prestadora_id: string; //Empresa que executará o serviço
  prestador_id: string; //Pessoa que executará o serviço
  descricao: string;
  latitude: string;
  longitude: string;
  cidade: string;
  estado: string;
  codigo_empresa: string; //ID Empresa
  codigo_prestadora: string; //ID VIVO
  codigo_candidato: string; // identificador candidato
  alt_soi: string;
  pre_comar: string;
  limite_ev: string;
  altura_edificacao: string;
  alt_max_ev_mastros: string;
  data: string;
  active: boolean;
  status: 'pending' | 'aproved' | 'ongoing' | 'done';
};

export type SolicitacoesField = {
  id?: string;
  empresa_contratante_id?: string;
  descricao?: string;
  cidade?: string;
  estado?: string;
  prestador_id?: string;
  data?: string,
  status?: 'pending' | 'aproved' | 'ongoing' | 'done',
  prestador_image_url?: string,
  prestador_name?: string,
  operadora_name?: string,
  operadora_image_url?: string,
  propriedade_id?: string;
};

export type RelatorioCandidatoTable = {
  id: string;
  solicitacao_id: string;
  coordenada_id: string;
  tipo_site: string;
  endereco: string;
  complemento: string;
  bairro: string;
  estado: string;
  distrito: string;
  cidade: string;
  cep: string;
  vlr_aluguel_negociado: string;
  vlr_aluguel_referencia: string;
  vlr_venda_negociado: string;
  vlr_venda_referencia: string;
  distancia_pn_sarf_ge: string;
  alt_antenas_rf: string;
  alt_max_ev_mastros: string;
  alt_candidato_gps_ge: string;
  alt_estrutura_vertical: string;
  alt_edificacao: string;
}

export type CoordenadaTable = {
  id: string;
  ring_lat: string;
  ring_long: string;
  candidato_lat: string;
  candidato_long: string;
  ring_lat_dec: string;
  ring_long_dec: string;
  candidato_lat_dec: string;
  candidato_long_dec: string;
}