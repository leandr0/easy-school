'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";

import { MessageModel } from '@/app/lib/definitions/messages_definitions';
import FormActions from '../../components/create_class/FormActions';
import { getAllMessages, saveMessages } from '@/app/lib/actions/revenue_messages';

// Import the new components


export default function CreateMessageForm() {
  const router = useRouter();

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState<MessageModel>({
    reminder_message: '',
    payment_overdue_message: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);

  useEffect(() => {
    getAllMessages()
      .then((data) => {
        setFormData(data);
      })
      .catch((err) => setError(err.message));
  }, []);


   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      console.log("Salvando mensagens");
      try {
        await saveMessages(formData);
  
        setMessage("✅ Course created successfully!");
  
        router.push("/adm");
  
      } catch (err: unknown) {
        if (err instanceof Error) {
          setMessage(`❌ ${err.message}`);
        } else {
          setMessage("❌ Unknown error occurred.");
        }
      }
    };
  

  return (
    <form  onSubmit={handleSubmit}  >

      <div className="mt-6 flow-root">

        <div className="rounded-lg bg-gray-50 p-4 md:pt-5">

          <div className="mb-4 grid grid-cols-6 gap-4 ">

            <div className="relative grid col-span-1 ">
              <div className="relative text-base mt-[10px] ml-[45px] ">Lembrete:</div>
            </div>

            <div className="relative col-span-5">
              <textarea
                rows={5}
                name="reminder_message"
                id="reminder_message"
                value={formData?.reminder_message}
                onChange={(e) => setFormData({ ...formData, reminder_message: e.target.value })}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>

            <div className="relative grid ">
              <div className="relative text-base mt-[10px] ml-[45px] ">Pagamento Atrasado:</div>
            </div>
            <div className="relative col-span-5">

              <textarea
                rows={5}
                name="payment_overdue_message"
                id="payment_overdue_message"
                value={formData?.payment_overdue_message}
                 onChange={(e) => setFormData({ ...formData, payment_overdue_message: e.target.value })}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>



        </div>


        <div >


          <FormActions
            cancelText='Cancelar'
            onCancel={() => router.push("/dashboard")}
            submitText='Salvar Mensagens'
            onSubmit={() => setActionType('')}
          />
        </div>

      </div>

    </form>
  );
}