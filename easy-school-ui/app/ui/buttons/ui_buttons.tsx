import { PencilIcon, PlusIcon, TrashIcon, DocumentPlusIcon ,UserGroupIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

import { deleteInvoice, deleteSolicitacao } from 'app/lib/actions';



export function CreateStudent() {
  return (
    <Link
      href="/dashboard/students/create"
      className="flex h-10 items-center rounded-lg bg-purple-400 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
    >
      <span className="hidden md:block">Criar Aluno</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}


export function CreateCourse() {
  return (
    <Link
      href="/dashboard/courses/create"
      className="flex h-10 items-center rounded-lg bg-purple-400 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
    >
      <span className="hidden md:block">Criar Curso</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function CreateCourseClass() {
  return (
    <Link
      href="/dashboard/courses-class/create"
      className="flex h-10 items-center rounded-lg bg-purple-400 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
    >
      <span className="hidden md:block">Criar Turma</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
  export function CreateTeacher() {
    return (
      <Link
        href="/dashboard/teachers/create"
        className="flex h-10 items-center rounded-lg bg-purple-400 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
      >
        <span className="hidden md:block">Criar Professor</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </Link>
    );
  }
  

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
 
  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}


export function CreateSolicitacao() {
  return (
    <Link
      href="/dashboard/solicitacoes/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Criar Solicitação</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateSolicitacao({ id , disabled }: { id: string ,disabled: boolean }) {
  return (
    <Link
      href={ disabled ?  `/dashboard/solicitacoes/${id}/edit` : ''}
      className={disabled ? " rounded-md border p-2 hover:bg-gray-100" :  'rounded-md border p-2 hover:bg-gray-100 read-only-select'}
    >
      <PencilIcon className="w-5" color={disabled ? 'blue' : ''}/>
    </Link>
  );
}

export function UpdateCourseClass({ id , disabled }: { id: string ,disabled: boolean }) {
  return (
    <Link
      href={ disabled ?  '' :  `/dashboard/courses-class/${id}/edit`}
      className={disabled ? 'rounded-md border p-2 hover:bg-gray-100 read-only-select' : " rounded-md border p-2 hover:bg-gray-100" }
    >
      <PencilIcon className="w-5" color={disabled ?   '' : 'blue'}/>
    </Link>
  );
}


export function AddPropriedade({ idSolicitacao , disabled}: { idSolicitacao: string ,disabled: boolean}) {
  return (
    <Link
      href={ disabled ?  `/dashboard/propriedade/solicitacao/${idSolicitacao}` : ''}
      className={disabled ? " rounded-md border p-2 hover:bg-gray-100" :  'rounded-md border p-2 hover:bg-gray-100 read-only-select'}
      
      >
      <DocumentPlusIcon className="w-5" aria-readonly={disabled} color={disabled ?  'green' : '' } />
    </Link>
  );
}

export function AddStudents({ id_course_class , disabled}: { id_course_class: string ,disabled: boolean}) {
  return (
    <Link
      href={ disabled ?  '' : `/dashboard/courses-class/${id_course_class}/students/`}
      className={disabled ? 'rounded-md border p-2 hover:bg-gray-100 read-only-select' : " rounded-md border p-2 hover:bg-gray-100" }
      
      >
      <UserGroupIcon className="w-5" aria-readonly={disabled} color={disabled ?  '' : 'green'} />
    </Link>
  );
}

export function DeleteSolicitacao({ id , disabled}: { id: string,disabled: boolean}) {
  const deleteInvoiceWithId = deleteSolicitacao.bind(null, id);
 
  return (
    <form action={deleteInvoiceWithId}>
      <button className={disabled ? " rounded-md border p-2 hover:bg-gray-100" :  'rounded-md border p-2 hover:bg-gray-100 read-only-select'} >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4"  color={disabled ?  'red' : '' }/>
      </button>
    </form>
  );
}


export function DeleteStudantFromCourseClassList({ id , disabled,setActionType}: { id: string,disabled: boolean,setActionType: (action: string) => void;}) {

  return (
  
      <button 
          type="submit"
          name="action"
          onClick={() => setActionType('remove_student_from_class')}
          value="remove_student_from_class"
      className={disabled ? " rounded-md border p-2 hover:bg-gray-100" :  'rounded-md border p-2 hover:bg-gray-100 read-only-select'} >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4"  color={disabled ?  'red' : '' }/>
      </button>
  );
}

export function DeleteWeekDayAvailability({ disabled,setActionType}: { disabled: boolean,setActionType: (action: string) => void;}) {

  return (
  
      <button 
          type="submit"
          name="action"
          onClick={() => setActionType('remove_week_day_availability')}
          value="remove_week_day_availability"
      className={disabled ? " rounded-md border p-2 hover:bg-gray-100" :  'rounded-md border p-2 hover:bg-gray-100 read-only-select'} >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4"  color={disabled ?  'red' : '' }/>
      </button>
  );
}