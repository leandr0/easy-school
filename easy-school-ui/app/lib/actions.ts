'use server';

import { z } from 'zod';

import { sql } from '@vercel/postgres';

import { revalidatePath } from 'next/cache';

import { redirect } from 'next/navigation';
import { UserField, EmpresaContratanteField, SolicitacoesField } from './definitions';
import { User } from 'next-auth';


//export {createSolicitacao} from './actions/solicitacao'

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    empresaPrestadoraId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  console.log("createInvoice")
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  console.log(validatedFields)

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function createPrestador(prevState: State, formData: FormData) {
  console.log("createPrestador")
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    empresaPrestadoraId: formData.get('empresaPrestadoraId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  console.log(validatedFields)

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  console.log(formData.get('customerId'))

  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');

  // Unreachable code block
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice' };
  }
}

export async function deleteSolicitacao(id: string){
  try{
    await sql` UPDATE solicitacao SET active = 'false' WHERE id = ${id}`;
    revalidatePath('/dashboard/solicitacoes');
    return { message: 'Deleted Solicitacao ID : '+id };
  }catch(error){
    throw new Error('Failed to delete solicitacao ID : '+id);
  }
}


const FormSchemaSolicitacao = z.object(
  {
    //contratante_id: z.string(),
    //empresa_contratante_id: z.string(),
    //empresa_prestadora_id: z.string({
    //invalid_type_error: 'Selecione uma empresa prestadora.',}),
    //prestador_id: z.string({
    //invalid_type_error: 'Selecione um prestador',}),
    descricao: z.coerce
      .string()
      .min(5, { message: 'Username must be at least 5 characters long' })
      .max(100, { message: 'Username must be no more than 100 characters long' }),
    latitude: z.string(),
    longitude: z.string(),
    cidade: z.string(),
    estado: z.string(),
    codigo_empresa: z.string(),
    codigo_prestadora: z.string(),
    codigo_candidato: z.string(),
    alt_soi: z.string(),
    pre_comar: z.string(),
    limite_ev: z.string(),
    altura_edificacao: z.string(),
    alt_max_ev_mastros: z.string(),
    ring_lat: z.string(),
    ring_long: z.string(),
    candidato_lat: z.string(),
    candidato_long: z.string(),
    ring_lat_dec: z.string(),
    ring_long_dec: z.string(),
    candidato_lat_dec: z.string(),
    candidato_long_dec: z.string(),
    //solicitacao_id: z.string(),
    //coordenada_id: z.string(),
    tipo_site: z.string(),
    endereco: z.string(),
    complemento: z.string(),
    bairro: z.string(),
    rel_estado: z.string(),
    distrito: z.string(),
    rel_cidade: z.string(),
    cep: z.string(),
    vlr_aluguel_negociado: z.string(),
    vlr_aluguel_referencia: z.string(),
    vlr_venda_negociado: z.string(),
    vlr_venda_referencia: z.string(),
    distancia_pn_sarf_ge: z.string(),
    alt_antenas_rf: z.string(),
    rel_alt_max_ev_mastros: z.string(),
    alt_candidato_gps_ge: z.string(),
    alt_estrutura_vertical: z.string(),
    alt_edificacao: z.string(),
    prestador_id: z.string(),
    empresa_contratante_id: z.string(),
  });

const CreateSolicitacao = FormSchemaSolicitacao;


export type StateSolicitacao = {
  errors?: {
    //empresa_prestadora_id?: string[];
    empresa_contratante_id?: string[];
    descricao?: string[];
    latitude?: string[];
    longitude?: string[];
    cidade?: string[];
    estado?: string[];
    codigo_empresa?: string[];
    codigo_prestadora?: string[];
    codigo_candidato?: string[];
    alt_soi?: string[];
    pre_comar?: string[];
    limite_ev?: string[];
    altura_edificacao?: string[];
    alt_max_ev_mastros?: string[];
    ring_lat?: string[];
    ring_long?: string[];
    candidato_lat?: string[];
    candidato_long?: string[];
    ring_lat_dec?: string[];
    ring_long_dec?: string[];
    candidato_lat_dec?: string[];
    candidato_long_dec?: string[];
    //solicitacao_id?: string[];
    //coordenada_id?: string[];
    tipo_site?: string[];
    endereco?: string[];
    complemento?: string[];
    bairro?: string[];
    rel_estado?: string[];
    distrito?: string[];
    rel_cidade?: string[];
    cep?: string[];
    vlr_aluguel_negociado?: string[];
    vlr_aluguel_referencia?: string[];
    vlr_venda_negociado?: string[];
    vlr_venda_referencia?: string[];
    distancia_pn_sarf_ge?: string[];
    alt_antenas_rf?: string[];
    rel_alt_max_ev_mastros?: string[];
    alt_candidato_gps_ge?: string[];
    alt_estrutura_vertical?: string[];
    alt_edificacao?: string[];
    prestador_id?: string[];

  };
  message?: string | null;
};

//(?<=id=\").*(?<!\")
export type StatePropriedade = {
  errors?: {
    solicitacao_id?: string[];
    tipo_pripriedade?: string[];
    construcao_existente?: string[];
    altura_edificacao?: string[];
    construcao_regular?: string[];
    area_locada?: string[];
    area_total_imovel?: string[];
    iptu_itr?: string[];
    matricula_transcricao?: string[];
    acesso_local?: string[];
    prazo_locacao?: string[];
    confrontante_lateral_direita?: string[];
    confrontante_lateral_esquerda?: string[];
    confrontante_fundos?: string[];
    agua_instalada?: string[];
    distancia_agua?: string[];
    rede_esgoto?: string[];
    distancia_rede_esgoto?: string[];
    topografia?: string[];
    sujeito_enchentes?: string[];
    necessario_extensao_acesso?: string[];
    metros_extensao?: string[];
    metros_melhoria?: string[];
    demolicao_remocao?: string[];
    demolicao_autoriazada?: string[];
    uso_guindaste?: string[];
    observacao_guindaste?: string[];
    descricao_acesso_propriedade?: string[];
    descricao_restricao_inicio_obra?: string[];
    descricao_proprietario_propriedade?: string[];
    observacao?: string[];
    roteiro?: string[];
    informacao_adicional?: string[];
    necessario_extensao?: string[];
    distancia_extensao?: string[];
    energia_provisoria?: string[];
    energia_ponto_emissao?: string[];
    distancia_medidor_energia?: string[];
    distancia_transformador?: string[];
    tensao_energia?: string[];
    concessionaria_energia?: string[];
    rede_telefone_fixo_movel?: string[];
    cobertura_celular?: string[];
    possui_fibra?: string[];
    localizacao_dgo?: string[];
  };
  message?: string | null;
};

const FormSchemaPropriedade = z.object(
  {
    solicitacao_id: z.string().min(1),
    tipo_pripriedade: z.string().min(1),
    construcao_existente: z.string().min(1),
    altura_edificacao: z.string().min(1),
    construcao_regular: z.string().min(1),
    area_locada: z.string().min(1),
    area_total_imovel: z.string().min(1),
    iptu_itr: z.string().min(1),
    matricula_transcricao: z.string().min(1),
    acesso_local: z.string().min(1),
    prazo_locacao: z.string().min(1),
    confrontante_lateral_direita: z.string().min(1),
    confrontante_lateral_esquerda: z.string().min(1),
    confrontante_fundos: z.string().min(1),
    agua_instalada: z.string().min(1),
    distancia_agua: z.string().min(1),
    rede_esgoto: z.string().min(1),
    distancia_rede_esgoto: z.string().min(1),
    topografia: z.string().min(1),
    sujeito_enchentes: z.string().min(1),
    necessario_extensao_acesso: z.string().min(1),
    metros_extensao: z.string().min(1),
    metros_melhoria: z.string().min(1),
    demolicao_remocao: z.string().min(1),
    demolicao_autoriazada: z.string().min(1),
    uso_guindaste: z.string().min(1),
    observacao_guindaste: z.string().min(1),
    descricao_acesso_propriedade: z.string().min(1),
    descricao_restricao_inicio_obra: z.string().min(1),
    descricao_proprietario_propriedade: z.string().min(1),
    observacao: z.string().min(1),
    roteiro: z.string().min(1),
    informacao_adicional: z.string().min(1),
    necessario_extensao: z.string().min(1),
    distancia_extensao: z.string().min(1),
    energia_provisoria: z.string().min(1),
    energia_ponto_emissao: z.string().min(1),
    distancia_medidor_energia: z.string().min(1),
    distancia_transformador: z.string().min(1),
    tensao_energia: z.string().min(1),
    concessionaria_energia: z.string().min(1),
    rede_telefone_fixo_movel: z.string().min(1),
    cobertura_celular: z.string().min(1),
    possui_fibra: z.string().min(1),
    localizacao_dgo: z.string().min(1),
  });

const CreatePropriedade = FormSchemaPropriedade;

export async function fetchEmpresasContratantes() {

  try {
    const data = await sql<EmpresaContratanteField>`
      SELECT
        id,
        name
      FROM empresa_contratante
      WHERE active = true
      ORDER BY name ASC
    `;

    const prestadoras = data.rows;
    return prestadoras;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function createPropriedade(prevState: StatePropriedade, formData: FormData, solicitacao: SolicitacoesField) {

  console.log("createPropriedade")

  

  // Validate form using Zod
  const validatedFields = CreatePropriedade.safeParse({
    solicitacao_id: solicitacao.id,
    tipo_pripriedade: formData.get('tipo_pripriedade'),
    construcao_existente: formData.get('construcao_existente'),
    altura_edificacao: formData.get('altura_edificacao'),
    construcao_regular: formData.get('construcao_regular'),
    area_locada: formData.get('area_locada'),
    area_total_imovel: formData.get('area_total_imovel'),
    iptu_itr: formData.get('iptu_itr'),
    matricula_transcricao: formData.get('matricula_transcricao'),
    acesso_local: formData.get('acesso_local'),
    prazo_locacao: formData.get('prazo_locacao'),
    confrontante_lateral_direita: formData.get('confrontante_lateral_direita'),
    confrontante_lateral_esquerda: formData.get('confrontante_lateral_esquerda'),
    confrontante_fundos: formData.get('confrontante_fundos'),
    agua_instalada: formData.get('agua_instalada'),
    distancia_agua: formData.get('distancia_agua'),
    rede_esgoto: formData.get('rede_esgoto'),
    distancia_rede_esgoto: formData.get('distancia_rede_esgoto'),
    topografia: formData.get('topografia'),
    sujeito_enchentes: formData.get('sujeito_enchentes'),
    necessario_extensao_acesso: formData.get('necessario_extensao_acesso'),
    metros_extensao: formData.get('metros_extensao'),
    metros_melhoria: formData.get('metros_melhoria'),
    demolicao_remocao: formData.get('demolicao_remocao'),
    demolicao_autoriazada: formData.get('demolicao_autoriazada'),
    uso_guindaste: formData.get('uso_guindaste'),
    observacao_guindaste: formData.get('observacao_guindaste'),
    descricao_acesso_propriedade: formData.get('descricao_acesso_propriedade'),
    descricao_restricao_inicio_obra: formData.get('descricao_restricao_inicio_obra'),
    descricao_proprietario_propriedade: formData.get('descricao_proprietario_propriedade'),
    observacao: formData.get('observacao'),
    roteiro: formData.get('roteiro'),
    informacao_adicional: formData.get('informacao_adicional'),
    necessario_extensao: formData.get('necessario_extensao'),
    distancia_extensao: formData.get('distancia_extensao'),
    energia_provisoria: formData.get('energia_provisoria'),
    energia_ponto_emissao: formData.get('energia_ponto_emissao'),
    distancia_medidor_energia: formData.get('distancia_medidor_energia'),
    distancia_transformador: formData.get('distancia_transformador'),
    tensao_energia: formData.get('tensao_energia'),
    concessionaria_energia: formData.get('concessionaria_energia'),
    rede_telefone_fixo_movel: formData.get('rede_telefone_fixo_movel'),
    cobertura_celular: formData.get('cobertura_celular'),
    possui_fibra: formData.get('possui_fibra'),
    localizacao_dgo: formData.get('localizacao_dgo'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log('createPropriedade validation error');
    console.log(validatedFields.error)

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { solicitacao_id,tipo_pripriedade, construcao_existente, altura_edificacao, construcao_regular, area_locada, area_total_imovel, iptu_itr, matricula_transcricao, acesso_local, prazo_locacao, confrontante_lateral_direita, confrontante_lateral_esquerda, confrontante_fundos, agua_instalada, distancia_agua, rede_esgoto, distancia_rede_esgoto, topografia, sujeito_enchentes, necessario_extensao_acesso, metros_extensao, metros_melhoria, demolicao_remocao, demolicao_autoriazada, uso_guindaste, observacao_guindaste, descricao_acesso_propriedade, descricao_restricao_inicio_obra, descricao_proprietario_propriedade, observacao, roteiro, informacao_adicional, necessario_extensao, distancia_extensao, energia_provisoria, energia_ponto_emissao, distancia_medidor_energia, distancia_transformador, tensao_energia, concessionaria_energia, rede_telefone_fixo_movel, cobertura_celular, possui_fibra, localizacao_dgo } = validatedFields.data;

  const date = new Date().toISOString().split('T')[0];
  const status = 'pending';
  const active = true;


  // Insert data into the database
  try {
    const res = await sql`
    INSERT INTO propriedade (
			solicitacao_id,
			tipo_propriedade,
			construcao_existente,
			construcao_regular,
			area_total_imovel,
			matricula_transcricao,
			altura_edificacao,
			area_locada,
			iptu_itr,
			acesso_local,
			prazo_locacao,
			confrontante_lateral_direita,
			confrontante_lateral_esquerda,
			confrontante_fundos
		)
  VALUES (   
    ${solicitacao_id},${tipo_pripriedade},${construcao_existente},${construcao_regular},${area_total_imovel},${matricula_transcricao},${altura_edificacao},${area_locada},${iptu_itr},
    ${acesso_local},${prazo_locacao},${confrontante_lateral_direita},${confrontante_lateral_esquerda},${confrontante_fundos}
    )
  RETURNING id `;

    const propriedadeID = res.rows[0].id;


    createEnergia(prevState, formData, propriedadeID, validatedFields);
    createAgua(prevState, formData, propriedadeID, validatedFields);
    createTelecomunicacao(prevState, formData, propriedadeID, validatedFields);
    createCaracteristicaObra(prevState, formData, propriedadeID, validatedFields);

  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }

  revalidatePath('/dashboard/solicitacoes');
  redirect('/dashboard/solicitacoes');
}

export async function updatePropriedade(prevState: StatePropriedade, formData: FormData, solicitacao: SolicitacoesField) {

  console.log("updatePropriedade")

  

  // Validate form using Zod
  const validatedFields = CreatePropriedade.safeParse({
    solicitacao_id: solicitacao.id,
    tipo_pripriedade: formData.get('tipo_pripriedade'),
    construcao_existente: formData.get('construcao_existente'),
    altura_edificacao: formData.get('altura_edificacao'),
    construcao_regular: formData.get('construcao_regular'),
    area_locada: formData.get('area_locada'),
    area_total_imovel: formData.get('area_total_imovel'),
    iptu_itr: formData.get('iptu_itr'),
    matricula_transcricao: formData.get('matricula_transcricao'),
    acesso_local: formData.get('acesso_local'),
    prazo_locacao: formData.get('prazo_locacao'),
    confrontante_lateral_direita: formData.get('confrontante_lateral_direita'),
    confrontante_lateral_esquerda: formData.get('confrontante_lateral_esquerda'),
    confrontante_fundos: formData.get('confrontante_fundos'),
    agua_instalada: formData.get('agua_instalada'),
    distancia_agua: formData.get('distancia_agua'),
    rede_esgoto: formData.get('rede_esgoto'),
    distancia_rede_esgoto: formData.get('distancia_rede_esgoto'),
    topografia: formData.get('topografia'),
    sujeito_enchentes: formData.get('sujeito_enchentes'),
    necessario_extensao_acesso: formData.get('necessario_extensao_acesso'),
    metros_extensao: formData.get('metros_extensao'),
    metros_melhoria: formData.get('metros_melhoria'),
    demolicao_remocao: formData.get('demolicao_remocao'),
    demolicao_autoriazada: formData.get('demolicao_autoriazada'),
    uso_guindaste: formData.get('uso_guindaste'),
    observacao_guindaste: formData.get('observacao_guindaste'),
    descricao_acesso_propriedade: formData.get('descricao_acesso_propriedade'),
    descricao_restricao_inicio_obra: formData.get('descricao_restricao_inicio_obra'),
    descricao_proprietario_propriedade: formData.get('descricao_proprietario_propriedade'),
    observacao: formData.get('observacao'),
    roteiro: formData.get('roteiro'),
    informacao_adicional: formData.get('informacao_adicional'),
    necessario_extensao: formData.get('necessario_extensao'),
    distancia_extensao: formData.get('distancia_extensao'),
    energia_provisoria: formData.get('energia_provisoria'),
    energia_ponto_emissao: formData.get('energia_ponto_emissao'),
    distancia_medidor_energia: formData.get('distancia_medidor_energia'),
    distancia_transformador: formData.get('distancia_transformador'),
    tensao_energia: formData.get('tensao_energia'),
    concessionaria_energia: formData.get('concessionaria_energia'),
    rede_telefone_fixo_movel: formData.get('rede_telefone_fixo_movel'),
    cobertura_celular: formData.get('cobertura_celular'),
    possui_fibra: formData.get('possui_fibra'),
    localizacao_dgo: formData.get('localizacao_dgo'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log('createPropriedade validation error');
    console.log(validatedFields.error)

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { solicitacao_id,tipo_pripriedade, construcao_existente, altura_edificacao, construcao_regular, area_locada, area_total_imovel, iptu_itr, matricula_transcricao, acesso_local, prazo_locacao, confrontante_lateral_direita, confrontante_lateral_esquerda, confrontante_fundos, agua_instalada, distancia_agua, rede_esgoto, distancia_rede_esgoto, topografia, sujeito_enchentes, necessario_extensao_acesso, metros_extensao, metros_melhoria, demolicao_remocao, demolicao_autoriazada, uso_guindaste, observacao_guindaste, descricao_acesso_propriedade, descricao_restricao_inicio_obra, descricao_proprietario_propriedade, observacao, roteiro, informacao_adicional, necessario_extensao, distancia_extensao, energia_provisoria, energia_ponto_emissao, distancia_medidor_energia, distancia_transformador, tensao_energia, concessionaria_energia, rede_telefone_fixo_movel, cobertura_celular, possui_fibra, localizacao_dgo } = validatedFields.data;

  const date = new Date().toISOString().split('T')[0];
  const status = 'pending';
  const active = true;


  // Insert data into the database
  try {
    const res = await sql`
    UPDATE propriedade 
      SET tipo_propriedade = ${tipo_pripriedade},
			SET construcao_existente = ${construcao_existente},
			SET construcao_regular = ${construcao_regular},
			SET area_total_imovel = ${area_total_imovel},
			SET matricula_transcricao = ${matricula_transcricao},
			SET altura_edificacao = ${altura_edificacao},
			SET area_locada = ${area_locada},
			SET iptu_itr = ${iptu_itr},
			SET acesso_local = ${acesso_local},
			SET prazo_locacao = ${prazo_locacao},
			SET confrontante_lateral_direita = ${confrontante_lateral_direita},
			SET confrontante_lateral_esquerda = ${confrontante_lateral_esquerda},
			SET confrontante_fundos = ${confrontante_fundos}
      WHERE solicitacao_id = ${solicitacao_id}

    )
    RETURNING id `;

    const propriedadeID = res.rows[0].id;


    updateEnergia(prevState, formData, propriedadeID, validatedFields);
    updateAgua(prevState, formData, propriedadeID, validatedFields);
    updateTelecomunicacao(prevState, formData, propriedadeID, validatedFields);
    updateCaracteristicaObra(prevState, formData, propriedadeID, validatedFields);

  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }

  revalidatePath('/dashboard/solicitacoes');
  redirect('/dashboard/solicitacoes');
}

export async function createEnergia(prevState: StateSolicitacao, formData: FormData, propriedade_id: string, validatedFields:any) {

  console.log("createEnergia")
  
  const { necessario_extensao, distancia_extensao, energia_provisoria, energia_ponto_emissao, distancia_medidor_energia, distancia_transformador, tensao_energia, concessionaria_energia } = validatedFields.data;

  try {
    const res = await sql`
    INSERT INTO energia (
			propriedade_id,
			necessario_extensao,
			distancia_extensao,
			energia_provisoria,
			energia_ponto_emissao,
			distancia_medidor_energia,
			distancia_transformador,
			tensao_energia,
			concessionaria_energia
		)
  VALUES (   
    ${propriedade_id},${necessario_extensao},${distancia_extensao},${energia_provisoria},${energia_ponto_emissao},
    ${distancia_medidor_energia},${distancia_transformador},${tensao_energia},${concessionaria_energia}
    )`;
  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}

export async function updateEnergia(prevState: StateSolicitacao, formData: FormData, propriedade_id: string, validatedFields:any) {

  console.log("updateEnergia")
  
  const { necessario_extensao, distancia_extensao, energia_provisoria, energia_ponto_emissao, distancia_medidor_energia, distancia_transformador, tensao_energia, concessionaria_energia } = validatedFields.data;

  try {
    const res = await sql`
    UPDATE energia 
			SET necessario_extensao = ${necessario_extensao},
			SET distancia_extensao = ${distancia_extensao},
			SET energia_provisoria = ${energia_provisoria},
			SET energia_ponto_emissao = ${energia_provisoria},
			SET distancia_medidor_energia = ${distancia_medidor_energia},
			SET distancia_transformador = ${distancia_transformador},
			SET tensao_energia = ${tensao_energia},
			SET concessionaria_energia = ${concessionaria_energia}
		WHERE propriedade_id = ${propriedade_id}`;
  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}

export async function createAgua(prevState: StateSolicitacao, formData: FormData, propriedade_id: string, validatedFields:any) {

  console.log("createAgua")
  
  const { agua_instalada,distancia_agua, rede_esgoto,distancia_rede_esgoto} = validatedFields.data;

  try {
    const res = await sql`
    INSERT INTO agua (
			propriedade_id,agua_instalada,distancia_agua,rede_esgoto,distancia_rede_esgoto
		)
  VALUES (   
    ${propriedade_id},${agua_instalada},${distancia_agua},${rede_esgoto},${distancia_rede_esgoto}
    )`;
  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}

export async function updateAgua(prevState: StateSolicitacao, formData: FormData, propriedade_id: string, validatedFields:any) {

  console.log("updateAgua")
  
  const { agua_instalada,distancia_agua, rede_esgoto,distancia_rede_esgoto} = validatedFields.data;

  try {
    const res = await sql`
    UPDATE agua 
			SET agua_instalada = ${agua_instalada},
      SET distancia_agua = ${distancia_agua},
      SET rede_esgoto = ${rede_esgoto},
      SET distancia_rede_esgoto = ${distancia_rede_esgoto}
		WHERE propriedade_id = ${propriedade_id}`;
  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}

export async function createTelecomunicacao(prevState: StateSolicitacao, formData: FormData, propriedade_id: string, validatedFields:any) {

  console.log("createTelecomunicacao")
  
  const { rede_telefone_fixo_movel,cobertura_celular, possui_fibra,localizacao_dgo} = validatedFields.data;

  try {
    const res = await sql`
    INSERT INTO telecomunicacao (
			propriedade_id,rede_telefone_fixo_movel,cobertura_celular,possui_fibra,localizacao_dgo
		)
  VALUES (   
    ${propriedade_id},${rede_telefone_fixo_movel},${cobertura_celular},${possui_fibra},${localizacao_dgo}
    )`;
  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}

export async function updateTelecomunicacao(prevState: StateSolicitacao, formData: FormData, propriedade_id: string, validatedFields:any) {

  console.log("updateTelecomunicacao")
  
  const { rede_telefone_fixo_movel,cobertura_celular, possui_fibra,localizacao_dgo} = validatedFields.data;

  try {
    const res = await sql`
    UPDATE telecomunicacao 
		SET rede_telefone_fixo_movel = ${rede_telefone_fixo_movel},
    SET cobertura_celular = ${cobertura_celular},
    SET possui_fibra = ${possui_fibra},
    SET localizacao_dgo = ${localizacao_dgo}
		WHERE propriedade_id = ${propriedade_id}`;
  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}

export async function createCaracteristicaObra(prevState: StateSolicitacao, formData: FormData, propriedade_id: string, validatedFields:any) {

  console.log("createCaracteristicaObra")
  
  const { topografia,sujeito_enchentes, necessario_extensao_acesso,metros_extensao,metros_melhoria,demolicao_remocao,
          demolicao_autoriazada,uso_guindaste,observacao_guindaste,descricao_acesso_propriedade,
          descricao_restricao_inicio_obra,descricao_proprietario_propriedade,observacao,roteiro,informacao_adicional} = validatedFields.data;

  try {
    const res = await sql`
    INSERT INTO caracteristica (
			propriedade_id,topografia,sujeito_enchentes, necessario_extensao_acesso,metros_extensao,metros_melhoria,
      demolicao_remocao,demolicao_autoriazada,uso_guindaste,observacao_guindaste,descricao_acesso_propriedade,
      descricao_restricao_inicio_obra,descricao_proprietario_propriedade,observacao,roteiro,informacao_adicional
		)
  VALUES (   
    ${propriedade_id},${topografia},${sujeito_enchentes},${necessario_extensao_acesso},${metros_extensao},
    ${metros_melhoria},${demolicao_remocao},${demolicao_autoriazada},${uso_guindaste},${observacao_guindaste}
    ,${descricao_acesso_propriedade},${descricao_restricao_inicio_obra},${descricao_proprietario_propriedade}
    ,${observacao},${roteiro},${informacao_adicional}
    )`;
  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}

export async function updateCaracteristicaObra(prevState: StateSolicitacao, formData: FormData, propriedade_id: string, validatedFields:any) {

  console.log("updateCaracteristicaObra")
  
  const { topografia,sujeito_enchentes, necessario_extensao_acesso,metros_extensao,metros_melhoria,demolicao_remocao,
          demolicao_autoriazada,uso_guindaste,observacao_guindaste,descricao_acesso_propriedade,
          descricao_restricao_inicio_obra,descricao_proprietario_propriedade,observacao,roteiro,informacao_adicional} = validatedFields.data;

  try {
    const res = await sql`
    UPDATE caracteristica
			SET topografia = ${topografia},
      SET sujeito_enchentes = ${sujeito_enchentes}, 
      SET necessario_extensao_acesso = ${necessario_extensao_acesso},
      SET metros_extensao = ${metros_extensao},
      SET metros_melhoria = ${metros_melhoria},
      SET demolicao_remocao = ${demolicao_remocao},
      SET demolicao_autoriazada = ${demolicao_autoriazada},
      SET uso_guindaste = ${uso_guindaste},
      SET observacao_guindaste = ${observacao_guindaste},
      SET descricao_acesso_propriedade = ${descricao_acesso_propriedade},
      SET descricao_restricao_inicio_obra = ${descricao_restricao_inicio_obra},
      SET descricao_proprietario_propriedade = ${descricao_proprietario_propriedade},
      SET observacao = ${observacao},
      SET roteiro = ${roteiro},
      SET informacao_adicional = ${informacao_adicional}
		WHERE propriedade_id  = ${propriedade_id}`;
  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}

export async function createSolicitacao(prevState: StateSolicitacao, formData: FormData, message: User) {

  console.log("createSolicitacao")
  console.log("Empresa contratante : "+formData.get('empresa_contratante_id'));
  // Validate form using Zod
  const validatedFields = CreateSolicitacao.safeParse({
    prestador_id: message.id,         //formData.get('prestador_id'),fcfd4ce8-17d6-4a04-9b75-31722ad75b06
    descricao: formData.get('descricao'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
    cidade: formData.get('cidade'),
    estado: formData.get('estado'),
    codigo_empresa: formData.get('codigo_empresa'),
    codigo_prestadora: formData.get('codigo_prestadora'),
    codigo_candidato: formData.get('codigo_candidato'),
    alt_soi: formData.get('alt_soi'),
    pre_comar: formData.get('pre_comar'),
    limite_ev: formData.get('limite_ev'),
    altura_edificacao: formData.get('altura_edificacao'),
    alt_max_ev_mastros: formData.get('alt_max_ev_mastros'),
    ring_lat: formData.get('ring_lat'),
    ring_long: formData.get('ring_long'),
    candidato_lat: formData.get('candidato_lat'),
    candidato_long: formData.get('candidato_long'),
    ring_lat_dec: formData.get('ring_lat_dec'),
    ring_long_dec: formData.get('ring_long_dec'),
    candidato_lat_dec: formData.get('candidato_lat_dec'),
    candidato_long_dec: formData.get('candidato_long_dec'),
    tipo_site: formData.get('tipo_site'),
    endereco: formData.get('endereco'),
    complemento: formData.get('complemento'),
    bairro: formData.get('candidato_long'),
    rel_estado: formData.get('rel_estado'),
    distrito: formData.get('distrito'),
    rel_cidade: formData.get('rel_cidade'),
    cep: formData.get('cep'),
    vlr_aluguel_negociado: formData.get('vlr_aluguel_negociado'),
    vlr_aluguel_referencia: formData.get('vlr_aluguel_referencia'),
    vlr_venda_negociado: formData.get('vlr_venda_negociado'),
    vlr_venda_referencia: formData.get('vlr_venda_referencia'),
    distancia_pn_sarf_ge: formData.get('distancia_pn_sarf_ge'),
    alt_antenas_rf: formData.get('alt_antenas_rf'),
    rel_alt_max_ev_mastros: formData.get('rel_alt_max_ev_mastros'),
    alt_candidato_gps_ge: formData.get('alt_candidato_gps_ge'),
    alt_estrutura_vertical: formData.get('alt_estrutura_vertical'),
    alt_edificacao: formData.get('alt_edificacao'),
    empresa_contratante_id: formData.get('empresa_contratante_id'),

  });
  /**
  formData.forEach((value, key) => {
    console.log(key, value);
  });*/


  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log('createSolicitacao validation error');
    console.log(validatedFields.error)

    console.error('Database operation failed:', validatedFields.error.flatten().fieldErrors); // Log the error
    throw new Error(); // Re-throw the original error
  }

  // Prepare data for insertion into the database
  const { empresa_contratante_id, prestador_id, descricao, latitude, longitude, cidade, estado, codigo_empresa, codigo_prestadora, codigo_candidato, alt_soi, pre_comar, limite_ev, altura_edificacao, alt_max_ev_mastros } = validatedFields.data;

  const date = new Date().toISOString().split('T')[0];
  const status = 'pending';
  const active = true;
  console.log('Empresa Contratante :: ')
  console.log(empresa_contratante_id);

  // Insert data into the database
  try {
    const res = await sql`
      INSERT INTO solicitacao (
		    prestador_id,descricao,latitude,longitude,cidade,estado,
        empresa_contratante_id,
		  	codigo_empresa,
			  codigo_prestadora,
			  codigo_candidato,
			  alt_soi,
			  pre_comar,
			  limite_ev,
			  altura_edificacao,
			  alt_max_ev_mastros,
        data,status,active
	    	)
		VALUES ( ${prestador_id},
              ${descricao},${latitude},${longitude},${cidade},${estado},${empresa_contratante_id},${codigo_empresa},${codigo_prestadora},
              ${codigo_candidato},${alt_soi},${pre_comar},${limite_ev},${altura_edificacao},${alt_max_ev_mastros},
              ${date},${status},${active})
    RETURNING id `;

    const solicitacaoID = res.rows[0].id;
    console.log('Solicitacao ID : ' + solicitacaoID);
    const coordenadaID = await createCoordenada(prevState, formData,validatedFields);
    console.log('Coordenada ID : '+ coordenadaID);
    const relatorioCandidatoID = await createRelatorioCandidato(prevState, formData, solicitacaoID, coordenadaID,validatedFields);
    console.log('Relatorio Candidato ID : '+ relatorioCandidatoID);
  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
  revalidatePath('/dashboard/solicitacoes');
  redirect('/dashboard/solicitacoes');
}

export async function updateSolicitacao(prevState: StateSolicitacao, formData: FormData, message: User) {

  console.log("updateSolicitacao")
  console.log("Empresa contratante : "+formData.get('empresa_contratante_id'));

  let solicitacao_id = formData.get('solicitacao_id');

  if (typeof solicitacao_id !== 'string') {
    throw new Error(); 
}

  // Validate form using Zod
  const validatedFields = CreateSolicitacao.safeParse({
    prestador_id: message.id,         //formData.get('prestador_id'),fcfd4ce8-17d6-4a04-9b75-31722ad75b06
    solicitacao_id: formData.get('solicitacao_id'),
    descricao: formData.get('descricao'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
    cidade: formData.get('cidade'),
    estado: formData.get('estado'),
    codigo_empresa: formData.get('codigo_empresa'),
    codigo_prestadora: formData.get('codigo_prestadora'),
    codigo_candidato: formData.get('codigo_candidato'),
    alt_soi: formData.get('alt_soi'),
    pre_comar: formData.get('pre_comar'),
    limite_ev: formData.get('limite_ev'),
    altura_edificacao: formData.get('altura_edificacao'),
    alt_max_ev_mastros: formData.get('alt_max_ev_mastros'),
    ring_lat: formData.get('ring_lat'),
    ring_long: formData.get('ring_long'),
    candidato_lat: formData.get('candidato_lat'),
    candidato_long: formData.get('candidato_long'),
    ring_lat_dec: formData.get('ring_lat_dec'),
    ring_long_dec: formData.get('ring_long_dec'),
    candidato_lat_dec: formData.get('candidato_lat_dec'),
    candidato_long_dec: formData.get('candidato_long_dec'),
    tipo_site: formData.get('tipo_site'),
    endereco: formData.get('endereco'),
    complemento: formData.get('complemento'),
    bairro: formData.get('candidato_long'),
    rel_estado: formData.get('rel_estado'),
    distrito: formData.get('distrito'),
    rel_cidade: formData.get('rel_cidade'),
    cep: formData.get('cep'),
    vlr_aluguel_negociado: formData.get('vlr_aluguel_negociado'),
    vlr_aluguel_referencia: formData.get('vlr_aluguel_referencia'),
    vlr_venda_negociado: formData.get('vlr_venda_negociado'),
    vlr_venda_referencia: formData.get('vlr_venda_referencia'),
    distancia_pn_sarf_ge: formData.get('distancia_pn_sarf_ge'),
    alt_antenas_rf: formData.get('alt_antenas_rf'),
    rel_alt_max_ev_mastros: formData.get('rel_alt_max_ev_mastros'),
    alt_candidato_gps_ge: formData.get('alt_candidato_gps_ge'),
    alt_estrutura_vertical: formData.get('alt_estrutura_vertical'),
    alt_edificacao: formData.get('alt_edificacao'),
    empresa_contratante_id: formData.get('empresa_contratante_id'),

  });
  /**
  formData.forEach((value, key) => {
    console.log(key, value);
  });*/


  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log('createSolicitacao validation error');
    console.log(validatedFields.error)

    console.error('Database operation failed:', validatedFields.error.flatten().fieldErrors); // Log the error
    throw new Error(); // Re-throw the original error
  }

  // Prepare data for insertion into the database
  const { empresa_contratante_id, prestador_id, descricao, latitude, longitude, cidade, estado, codigo_empresa, codigo_prestadora, codigo_candidato, alt_soi, pre_comar, limite_ev, altura_edificacao, alt_max_ev_mastros } = validatedFields.data;

  const date = new Date().toISOString().split('T')[0];
  console.log('Empresa Contratante :: ')
  console.log(empresa_contratante_id);

  // Insert data into the database
  try {
    const res = await sql`
      UPDATE solicitacao (
        SET = descricao = ${descricao},
        SET = latitude = ${latitude},
        SET = longitude = ${longitude},
        SET = cidade = ${cidade},
        SET = estado = ${estado},
        SET = empresa_contratante_id = ${empresa_contratante_id},
		  	SET = codigo_empresa = ${codigo_empresa},
			  SET = codigo_prestadora = ${codigo_prestadora},
			  SET = codigo_candidato = ${codigo_candidato},
			  SET = alt_soi = ${alt_soi},
			  SET = pre_comar = ${pre_comar},
			  SET = limite_ev = ${limite_ev},
			  SET = altura_edificacao = ${altura_edificacao},
			  SET = alt_max_ev_mastros = ${alt_max_ev_mastros},
        SET = data = ${date}
      WHERE id = ${solicitacao_id}
    RETURNING id,coordenada_id `;

    const solicitacaoID = res.rows[0].id;
    const coordenadaID = res.rows[0].coordenada_id;
    console.log('Solicitacao ID : ' + solicitacaoID);
    await updateCoordenada(prevState, formData,validatedFields,coordenadaID);
    console.log('Coordenada ID : '+ coordenadaID);
    await updateRelatorioCandidato(prevState, formData, solicitacaoID,validatedFields);
    
  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
  revalidatePath('/dashboard/solicitacoes');
  redirect('/dashboard/solicitacoes');
}


export async function createCoordenada(prevState: StateSolicitacao, formData: FormData,validatedFields:any) {

  console.log("createCoordenada")
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    //console.log(validatedFields.error)
    console.log('createCoordenada');
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const {
    ring_lat,
    ring_long,
    candidato_lat,
    candidato_long,
    ring_lat_dec,
    ring_long_dec,
    candidato_lat_dec,
    candidato_long_dec
  } = validatedFields.data;

  // Insert data into the database
  try {
    const res = await sql`
      INSERT INTO coordenada (
	      ring_lat,
        ring_long,
        candidato_lat,
        candidato_long,
        ring_lat_dec,
        ring_long_dec,
        candidato_lat_dec,
        candidato_long_dec
	    	)
		VALUES (${ring_lat}, ${ring_long}, ${candidato_lat}, ${candidato_long},
              ${ring_lat_dec},${ring_long_dec},${candidato_lat_dec},${candidato_long_dec})
    RETURNING id `;

    const coordenadaID = res.rows[0].id;

    return coordenadaID;

  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}


export async function updateCoordenada(prevState: StateSolicitacao, formData: FormData,validatedFields:any,coordenadaID : string) {

  console.log("updateCoordenada")

  // Prepare data for insertion into the database
  const {
    ring_lat,
    ring_long,
    candidato_lat,
    candidato_long,
    ring_lat_dec,
    ring_long_dec,
    candidato_lat_dec,
    candidato_long_dec
  } = validatedFields.data;

  // Insert data into the database
  try {
    const res = await sql`
      UPDATE coordenada (
	      SET ring_lat = ${ring_lat},
        SET ring_long = ${ring_long},
        SET candidato_lat = ${candidato_lat},
        SET candidato_long = ${candidato_long},
        SET ring_lat_dec = ${ring_lat_dec},
        SET ring_long_dec = ${ring_long_dec},
        SET candidato_lat_dec = ${candidato_lat_dec},
        SET candidato_long_dec = ${candidato_long_dec}
	    WHERE id = ${coordenadaID} `;

  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}


export async function createRelatorioCandidato(prevState: StateSolicitacao, formData: FormData, solicitacao_id: string, coordenada_id: string,validatedFields:any) {

  console.log("createRelatorioCandidato")
  // Validate form using Zod


  //console.log(validatedFields)

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log('createRelatorioCandidato');
    //console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const {
    tipo_site,
    endereco,
    complemento,
    bairro,
    rel_estado,
    distrito,
    rel_cidade,
    cep,
    vlr_aluguel_negociado,
    vlr_aluguel_referencia,
    vlr_venda_negociado,
    vlr_venda_referencia,
    distancia_pn_sarf_ge,
    alt_antenas_rf,
    rel_alt_max_ev_mastros,
    alt_candidato_gps_ge,
    alt_estrutura_vertical, alt_edificacao
  } = validatedFields.data;

  // Insert data into the database
  try {
    const res = await sql`
      INSERT INTO relatorio_candidato (
	      solicitacao_id,
        coordenada_id,
        tipo_site,
        endereco,
        complemento,
        bairro,
        estado,
        distrito,
        cidade,
        cep,
        vlr_aluguel_negociado,
        vlr_aluguel_referencia,
        vlr_venda_negociado,
        vlr_venda_referencia,
        distancia_pn_sarf_ge,
        alt_antenas_rf,
        alt_max_ev_mastros,
        alt_candidato_gps_ge,
        alt_estrutura_vertical,
        alt_edificacao
	    	)
		VALUES (${solicitacao_id},
      ${coordenada_id},
        ${tipo_site},
          ${endereco},
            ${complemento},
              ${bairro},
                ${rel_estado},
                  ${distrito},
                    ${rel_cidade},
                      ${cep},
                        ${vlr_aluguel_negociado},
                          ${vlr_aluguel_referencia},
                            ${vlr_venda_negociado},
                              ${vlr_venda_referencia},
                                ${distancia_pn_sarf_ge},
                                  ${alt_antenas_rf},
                                    ${rel_alt_max_ev_mastros},
                                    ${alt_candidato_gps_ge},
                                    ${alt_estrutura_vertical},
                                    ${alt_edificacao})
    RETURNING id `;

  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}


export async function updateRelatorioCandidato(prevState: StateSolicitacao, formData: FormData, solicitacao_id: string, validatedFields:any) {

  console.log("createRelatorioCandidato")
  // Validate form using Zod


  //console.log(validatedFields)

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log('createRelatorioCandidato');
    //console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const {
    tipo_site,
    endereco,
    complemento,
    bairro,
    rel_estado,
    distrito,
    rel_cidade,
    cep,
    vlr_aluguel_negociado,
    vlr_aluguel_referencia,
    vlr_venda_negociado,
    vlr_venda_referencia,
    distancia_pn_sarf_ge,
    alt_antenas_rf,
    rel_alt_max_ev_mastros,
    alt_candidato_gps_ge,
    alt_estrutura_vertical, alt_edificacao
  } = validatedFields.data;

  // Insert data into the database
  try {
    const res = await sql`
      UPDATE relatorio_candidato
        SET tipo_site = ${tipo_site},
        SET endereco = ${endereco},
        SET complemento = ${complemento},
        SET bairro = ${bairro},
        SET estado = ${rel_estado},
        SET distrito = ${distrito},
        SET cidade = ${rel_cidade},
        SET cep = ${cep},
        SET vlr_aluguel_negociado = ${vlr_aluguel_negociado},
        SET vlr_aluguel_referencia = ${vlr_aluguel_referencia},
        SET vlr_venda_negociado = ${vlr_venda_negociado},
        SET vlr_venda_referencia = ${vlr_venda_referencia},
        SET distancia_pn_sarf_ge = ${distancia_pn_sarf_ge},
        SET alt_antenas_rf = ${alt_antenas_rf},
        SET alt_max_ev_mastros = ${rel_alt_max_ev_mastros},
        SET alt_candidato_gps_ge = ${alt_candidato_gps_ge},
        SET alt_estrutura_vertical = ${alt_estrutura_vertical},
        SET alt_edificacao = ${alt_edificacao}
	  WHERE solicitacao_id  = ${solicitacao_id} `;

  } catch (error) {
    console.error('Database operation failed:', error); // Log the error
    throw error; // Re-throw the original error
  }
}