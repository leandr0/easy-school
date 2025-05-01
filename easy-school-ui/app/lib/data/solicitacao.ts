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
  SolicitacoesTable,
  SolicitacoesField,
} from '../definitions';

import { formatCurrency } from '../utils';

import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredSolicitacoes(
    query: string,
    currentPage: number,
  ) {
  
    noStore();
  
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  /**
   *  prestador.image_url,
          prestador.name
  
           
   */
    try {
      const solicitacoes = await sql<SolicitacoesField>`
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
          solicitacao.active = 'true'  AND 
          (
            solicitacao.descricao ILIKE ${`%${query}%`} OR
            prestador.name::text ILIKE ${`%${query}%`} OR
            solicitacao.data::text ILIKE ${`%${query}%`} OR
            solicitacao.status ILIKE ${`%${query}%`}
          )
          
        ORDER BY solicitacao.data DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
  
      return solicitacoes.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch solicitacoes.');
    }
  }
  