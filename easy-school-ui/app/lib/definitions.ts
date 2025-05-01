// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export * from '@/app/lib/definitions/solicitacao';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
};

export type UserField = {
  id: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
};

export type EmpresaPrestadora = {
  id: string;
  name: string;
  cnpj: string;
  image_url: string;
  site_url: string;
  active: boolean;
};

export type Prestador = {
  id: string;
  user_id: string;
  name: string;
  cpf: string;
  email: string;
  image_url: string;
  active: boolean;
};


export type EmpresaContratante = {
  id: string;
  name: string;
  cnpj: string;
  image_url: string;
  site_url: string;
  active: boolean;
};

export type Contratante = {
  id: string;
  user_id: string;
  empresa_contratante_id: string;
  name: string;
  cpf: string;
  email: string;
  image_url: string;
  active: boolean;
};

export type Solicitacao = {
  id: string;
  contratante_id: string;
  telefone: string;
  email: string;
  empresa_prestadora_id: string;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the status property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'aproved' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type SolicitacaoMonth = {
  total: number;
  month: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the status property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type ReportByOperadora = {
  id: string;
  name: string;
  image_url: string;
  site_url: string;
  solicitacao_count: string;
};


export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'aproved' | 'paid';
};

export type PrestadorTable = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  image_url: string;
  cpf: string;
  active: boolean;
};

export type EmpresaContratanteTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  site_url: string;
  cnpj: string;
  active: boolean;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type EmpresaPrestadoraField = {
  id: string;
  name: string;
};

export type EmpresaContratanteField = {
  id: string;
  name: string;
};

export type SolicitacaoField = {
  id: string;
}

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'aproved' | 'paid';
};

export type SolicitacaoForm = {
  id: string;
  empresa_contratante_id: string;
  prestador_id: string;
  descricao: string;
  latitude: string;
  longitude: string;
  cidade: string;
  estado: string;
  codigo_empresa: string;
  codigo_prestadora: string;
  codigo_candidato: string;
  alt_soi: string;
  pre_comar: string;
  limite_ev: string;
  altura_edificacao: string;
  alt_max_ev_mastros: string;
};

export type RelatorioCandidatoForm = {
  id: string;
  solicitacao_id: string;
  coordenada_id: string;
  tipo_site: string;
  endereco: string;
  complemento: string;
  cidade: string;
  estado: string;
  bairro: string;
  distrito: string;
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
};

export type CoordenadaForm = {
  id: string;
  ring_lat: string;
  ring_long: string;
  candidato_lat: string;
  candidato_long: string;
  ring_lat_dec: string;
  ring_long_dec: string;
  candidato_lat_dec: string;
  candidato_long_dec: string;
};

export type EmpresaContratanteForm = {
  id: string;
  name: string;
  cnpj: string;
  image_url: string;
  site_url: string;
  active: string;
};

export type PropriedadeForm = {
  id?: string;
  solicitacao_id?: string;
  tipo_propriedade?: string;
  construcao_existente?: string;
  construcao_regular?: string;
  area_total_imovel?: string;
  matricula_transcricao?: string;
  altura_edificacao?: string;
  area_locada?: string;
  iptu_itr?: string;
  acesso_local?: string;
  prazo_locacao?: string;
  confrontante_lateral_direita?: string;
  confrontante_lateral_esquerda?: string;
  confrontante_fundos?: string;
};

export type EnergiaForm = {
  id: string;
  propriedade_id: string;
  necessario_extensao: string;
  distancia_extensao: string;
  energia_provisoria: string;
  energia_ponto_emissao: string;
  distancia_medidor_energia: string;
  distancia_transformador: string;
  tensao_energia: string;
  concessionaria_energia: string;
};


export type AguaForm = {
  id: string;
  propriedade_id: string;
  agua_instalada: string;
  distancia_agua: string;
  rede_esgoto: string;
  distancia_rede_esgoto: string;
}

export type TelecomunicacaoForm = {
  id: string;
  propriedade_id: string;
  rede_telefone_fixo_movel: string;
  cobertura_celular: string;
  possui_fibra: string;
  localizacao_dgo: string;
}

export type CaracteristicaForm = {
  id: string;
  propriedade_id: string;
  topografia: string;
  sujeito_enchentes: string;
  necessario_extensao_acesso: string;
  metros_extensao: string;
  metros_melhoria: string;
  demolicao_remocao: string;
  demolicao_autoriazada: string;
  uso_guindaste: string;
  observacao_guindaste: string;
  descricao_acesso_propriedade: string;
  descricao_restricao_inicio_obra: string;
  descricao_proprietario_propriedade: string;
  observacao: string;
  roteiro: string;
  informacao_adicional: string;
}