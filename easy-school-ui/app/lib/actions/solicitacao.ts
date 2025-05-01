'use server';

import { z } from 'zod';

import { sql } from '@vercel/postgres';


const FormSchema = z.object(
    {
        contratante_id: z.string(),
        empresa_contratante_id: z.string(),
        empresa_prestadora_id: z.string({
            invalid_type_error: 'Selecione uma empresa prestadora.',}),
        prestador_id: z.string({
            invalid_type_error: 'Selecione um prestador',}),
        descricao: z.coerce
            .string()
            .min(15, { message: 'Username must be at least 15 characters long' })
            .max(100, { message: 'Username must be no more than 100 characters long' }),
        latitude: z.string(),
        longitude: z.string(),
        cidade: z.string(),
        estado: z.string()
});

const CreateSolicitacao = FormSchema;

export type State = {
    errors?: {
        empresa_prestadora_id?: string[];
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
        
    };
    message?: string | null;
  };
   

export async function createSolicitacao(prevState: State, formData: FormData) {
  
    console.log("createSolicitacao")
    // Validate form using Zod
    const validatedFields = CreateSolicitacao.safeParse({
        //contratante_id:         formData.get('contratante_id'),
        //empresa_contratante_id: formData.get('empresa_contratante_id'),
        empresa_prestadora_id:  formData.get('empresa_prestadora_id') ,
        //prestador_id:           formData.get('prestador_id'),
        descricao:              formData.get('descricao'),
        latitude:               formData.get('latitude'),
        longitude:              formData.get('longitude'),
        cidade:                 formData.get('cidade'),
        estado:                 formData.get('estado'),
	  	  codigo_empresa:         formData.get('codigo_empresa'),
			  codigo_prestadora:      formData.get('codigo_prestadora'),
			  codigo_candidato:       formData.get('codigo_candidato'),
			  alt_soi:                formData.get('alt_soi'),
			  pre_comar:              formData.get('pre_comar'),
			  limite_ev:              formData.get('limite_ev'),
			  altura_edificacao:      formData.get('altura_edificacao'),
			  alt_max_ev_mastros:     formData.get('alt_max_ev_mastros'),

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
    const { contratante_id, empresa_contratante_id, empresa_prestadora_id ,
        prestador_id,descricao,latitude,longitude,cidade,estado} = validatedFields.data;

    const data = new Date().toISOString().split('T')[0];
    const status = 'pending';
    const active = true;
   
    // Insert data into the database
    try {
      await sql`
        INSERT INTO solicitacao (
	      contratante_id ,empresa_contratante_id,empresa_prestadora_id,prestador_id,
          descricao,latitude,longitude,cidade,estado,data,status,active )
        VALUES (${contratante_id}, ${empresa_contratante_id}, ${empresa_prestadora_id}, ${prestador_id},
                ${descricao},${latitude},${longitude},${cidade},${estado},${data},${status},${active}
        )
      `;
    } catch (error) {
      // If a database error occurs, return a more specific error.
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
}