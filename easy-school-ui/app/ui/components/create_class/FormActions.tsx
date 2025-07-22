'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export default function FormActions({ onCancel, onSubmit }: FormActionsProps) {
  return (
    <div className="mt-6 flex justify-end gap-4">
      <Link
        href="/dashboard/courses-class"
        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
      >
        Cancelar
      </Link>
      <Button 
        className='hover:bg-purple-500' 
        type="submit" 
        onClick={onSubmit}
      >
        Criar Turma
      </Button>
    </div>
  );
}