'use client';

import Link from 'next/link';
import { Button, CancelButton } from '@/app/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  cancelText?: string;
  submitText?: string;
}

export default function FormActions({ 
  onCancel, 
  onSubmit, 
  cancelText = "Cancelar", 
  submitText = "Criar Turma" 
}: FormActionsProps) {
  return (
    <div className="mt-6 flex justify-end gap-4">

  <CancelButton 
        type="button"
        onClick={onCancel}
      >
        {cancelText}
      </CancelButton>

      <Button 
        className='hover:bg-purple-500' 
        type="submit" 
        onClick={onSubmit}
      >
        {submitText}
      </Button>
    </div>
  );
}