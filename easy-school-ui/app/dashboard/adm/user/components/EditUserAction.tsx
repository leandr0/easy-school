// app/adm/user/components/EditUserAction.tsx
'use client';

import { beginEditUser } from '@/app/actions/users';
import { useFormStatus } from 'react-dom';

import { PencilIcon} from '@heroicons/react/24/outline';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-md px-3 py-1.5 border">
      <PencilIcon className="w-5" color={pending ? '' : 'blue'} />
    </button>
  );
}

export default function EditUserAction({ id }: { id: string }) {
  return (
    <form action={beginEditUser}>
      <input type="hidden" name="id" value={id} />
      <Submit />
    </form>
  );
}
