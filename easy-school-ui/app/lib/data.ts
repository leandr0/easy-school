import { sql } from '@vercel/postgres';

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  PrestadorTable,
  EmpresaContratanteField,
  SolicitacaoForm,
  RelatorioCandidatoForm,
  CoordenadaForm,
  EmpresaContratanteForm,
  PropriedadeForm,
  EnergiaForm,
  AguaForm,
  TelecomunicacaoForm,
  CaracteristicaForm,
  ReportByOperadora,
  SolicitacaoMonth,
} from './definitions';

import { formatCurrency } from './utils';

import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    //console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchSolicitacaoByMonth() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    //console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<SolicitacaoMonth>`SELECT
                                        COUNT(*) AS total,
                                        to_char(date_trunc('month', solicitacao.data), 'Mon YY') AS month
                                    FROM
                                        solicitacao
                                    WHERE
                                        solicitacao.data >= (CURRENT_DATE - INTERVAL '60 months')    
                                    GROUP BY
                                        to_char(date_trunc('month', solicitacao.data), 'Mon YY')
                                    ORDER BY
                                        to_char(date_trunc('month', solicitacao.data), 'Mon YY') ASC`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}


export async function fetchSolicitacao() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    //console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM solicitacao`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchReportByOperadora() {

  noStore();

  try {
    // Fetch the last 5 invoices, sorted by date
    const data = await sql<ReportByOperadora>`
    SELECT ec.name, ec.image_url,ec.site_url, COUNT(s.id) as solicitacao_count
    FROM solicitacao s
    INNER JOIN empresa_contratante ec
    ON s.empresa_contratante_id = ec.id
    GROUP BY ec.name,ec.image_url,ec.site_url 
    LIMIT 5`;

    const reportByOperadora = data.rows;
    return reportByOperadora;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchLatestInvoices() {

  noStore();

  try {
    // Fetch the last 5 invoices, sorted by date
    const data = await sql<LatestInvoiceRaw>`
    SELECT invoices.amount, customers.name, customers.image_url, customers.email
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    ORDER BY invoices.date DESC

    LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardDataRelatorio() {

  noStore();

  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const relatorioDoneCountPromise = sql`SELECT COUNT(*) FROM solicitacao WHERE status = 'done'`;
    const relatorioPendentePromise = sql`SELECT COUNT(*) FROM solicitacao WHERE status <> 'done'`;
    const relatorioTotalPromise = sql`SELECT COUNT(*) FROM solicitacao`;
    const totalOperadoraPromise = sql`SELECT 
                                        COUNT(DISTINCT econtr.name) AS "total_operadoras"
                                        FROM solicitacao sol
                                        INNER JOIN empresa_contratante econtr
                                        ON sol.empresa_contratante_id = econtr.id
                                        WHERE sol.status <> 'done'`;

    const data = await Promise.all([
      relatorioDoneCountPromise,
      relatorioPendentePromise,
      relatorioTotalPromise,
      totalOperadoraPromise,
    ]);

    const numberOfDoneReport = Number(data[0].rows[0].count ?? '0');
    const numberOfPendingReport = Number(data[1].rows[0].count ?? '0');
    const totalOfAllReport = Number(data[2].rows[0].count ?? '0');
    const totalOperadora = Number(data[3].rows[0].total_operadoras ?? '0');

    return {
      numberOfDoneReport,
      numberOfPendingReport,
      totalOfAllReport,
      totalOperadora,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchCardData() {

  noStore();

  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {

  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {

  noStore();

  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {

  noStore();

  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    console.log(invoice);
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}
export async function fetchSolicitacaoById(id: string) {

  noStore();

  try {
    const data = await sql<SolicitacaoForm>`
      select id, empresa_contratante_id, prestador_id,
      descricao, latitude,longitude,
      cidade,estado,codigo_empresa,
      codigo_prestadora, codigo_candidato,
      alt_soi,pre_comar,limite_ev,
      altura_edificacao, alt_max_ev_mastros from solicitacao
      WHERE id = ${id};
    `;

    const solicitacao = data.rows;

    return solicitacao[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchRelatorioCandidatoByIdSolicitacao(idSolicitacao: string) {

  noStore();

  try {
    const data = await sql<RelatorioCandidatoForm>`
      select id,solicitacao_id,coordenada_id,tipo_site,endereco,complemento,bairro,estado,distrito,cidade,cep
          ,vlr_aluguel_negociado,vlr_aluguel_referencia,vlr_venda_negociado,vlr_venda_referencia,distancia_pn_sarf_ge
        ,alt_antenas_rf,alt_max_ev_mastros,alt_candidato_gps_ge,alt_estrutura_vertical,alt_edificacao
      from relatorio_candidato 
      WHERE solicitacao_id = ${idSolicitacao};
    `;

    const relatorioCandidato = data.rows;

    return relatorioCandidato[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchEmpresaContratanteByIdSolicitacao(idSolicitacao: string) {

  noStore();

  try {
    const data = await sql<EmpresaContratanteForm>`
      select empresa_contratante.id,name,cnpj,image_url,site_url,empresa_contratante.active
      from empresa_contratante
      INNER JOIN solicitacao
      ON solicitacao.empresa_contratante_id = empresa_contratante.id 
      WHERE solicitacao.id = ${idSolicitacao};
    `;

    const empresaContratante = data.rows;

    return empresaContratante[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchPropriedadeByIdSolicitacao(idSolicitacao: string) {

  noStore();

  try {
    const data = await sql<PropriedadeForm>`
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
      WHERE solicitacao.id = ${idSolicitacao};
    `;

    const propriedade = data.rows;

    return propriedade[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}


export async function fetchEnergiaByIdSolicitacao(idSolicitacao: string) {

  noStore();

  try {
    const data = await sql<EnergiaForm>`
      select energia.id, propriedade_id,necessario_extensao,distancia_extensao,energia_provisoria,energia_ponto_emissao,distancia_medidor_energia,distancia_transformador,tensao_energia,concessionaria_energia
      from energia
      INNER JOIN propriedade
      ON propriedade.id = energia.propriedade_id
      INNER JOIN solicitacao
      ON solicitacao.id = propriedade.solicitacao_id 
      WHERE solicitacao.id = ${idSolicitacao};
    `;

    const energia = data.rows;

    return energia[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchAguaByIdSolicitacao(idSolicitacao: string) {

  noStore();

  try {
    const data = await sql<AguaForm>`
      select agua.id, propriedade_id,agua_instalada,distancia_agua,rede_esgoto,distancia_rede_esgoto
      from agua
      INNER JOIN propriedade
      ON propriedade.id = agua.propriedade_id
      INNER JOIN solicitacao
      ON solicitacao.id = propriedade.solicitacao_id 
      WHERE solicitacao.id = ${idSolicitacao};
    `;

    const energia = data.rows;

    return energia[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchTelecomunicacaoByIdSolicitacao(idSolicitacao: string) {

  noStore();

  try {
    const data = await sql<TelecomunicacaoForm>`
      select telecomunicacao.id, propriedade_id,rede_telefone_fixo_movel,cobertura_celular,possui_fibra,localizacao_dgo
      from telecomunicacao
      INNER JOIN propriedade
      ON propriedade.id = telecomunicacao.propriedade_id
      INNER JOIN solicitacao
      ON solicitacao.id = propriedade.solicitacao_id 
      WHERE solicitacao.id = ${idSolicitacao};
    `;

    const telecomunicacao = data.rows;

    return telecomunicacao[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}


export async function fetchCaracteristicaObraByIdSolicitacao(idSolicitacao: string) {

  noStore();

  try {
    const data = await sql<CaracteristicaForm>`
      select caracteristica.id, propriedade_id,
        topografia,
        sujeito_enchentes,
        necessario_extensao_acesso,
        metros_extensao,
        metros_melhoria,
        demolicao_remocao,
        demolicao_autoriazada,
        uso_guindaste,
        observacao_guindaste,
        descricao_acesso_propriedade,
        descricao_restricao_inicio_obra,
        descricao_proprietario_propriedade,
        observacao,
        roteiro,
        informacao_adicional
      from caracteristica
      INNER JOIN propriedade
      ON propriedade.id = caracteristica.propriedade_id
      INNER JOIN solicitacao
      ON solicitacao.id = propriedade.solicitacao_id 
      WHERE solicitacao.id = ${idSolicitacao};
    `;

    const caracteristicaObra = data.rows;

    return caracteristicaObra[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCoordenadaByIdSolicitacao(idSolicitacao: string) {

  noStore();

  try {
    const data = await sql<CoordenadaForm>`
      select 
          coordenada.id,ring_lat,ring_long,candidato_lat,candidato_long,
          ring_lat_dec,ring_long_dec,candidato_lat_dec,candidato_long_dec
      from coordenada 
      INNER JOIN relatorio_candidato
      ON coordenada.id = relatorio_candidato.coordenada_id
      WHERE relatorio_candidato.solicitacao_id = ${idSolicitacao};
    `;

    const coordenada = data.rows;

    return coordenada[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {

  noStore();
  console.log('Customers from data base');
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    console.log(customers);
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchEmpresasPrestadoras() {

  noStore();

  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM empresa_prestadora
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredPrestador(
  query: string,
  currentPage: number,
) {

  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const prestador = await sql<PrestadorTable>`
      SELECT
        prestador.id,
        prestador.user_id,
        prestador.active,
        prestador.cpf,
        prestador.name,
        prestador.email,
        prestador.image_url
      FROM prestador
      WHERE
        prestador.name ILIKE ${`%${query}%`} OR
        prestador.email ILIKE ${`%${query}%`}
      ORDER BY prestador.name DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return prestador.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch prestadores.');
  }
}

export async function fetchFilteredCustomers(query: string) {

  noStore();

  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {

  noStore();

  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;