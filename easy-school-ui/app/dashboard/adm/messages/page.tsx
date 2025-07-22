"use client";
import React, { useEffect, useState } from "react";
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CreateMessageForm from "@/app/ui/adm/message/message_create-form";


export default function Page({ params }: { params: { id: string } }) {
  
  const id = params.id;


  const [error, setError] = useState<null | string>(null); // Error can be a string
  
  return (
    <main>
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Mensagens', href: '/dashboard/adm/messages' },
        {
          label: 'Criar Mensagens',
          href: `/dashboard/adm/messages`,
          active: true,
        },
      ]}
    />
    <CreateMessageForm/>
  </main>
  );
}
