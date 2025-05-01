'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import React, { useState } from "react";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import { createStudent } from '@/app/lib/actions/students_actions';

export default function CreateStudentForm() {

  const router = useRouter();



  const [formData, setFormData] = useState<StudentModel>({
    name: "",
    email: "",
    phone_number: "",
    due_date: "",
    start_date: "",
    status: true,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createStudent(formData);

      setMessage("✅ Course created successfully!");
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        due_date: "",
        start_date: "",
        status: true,
      });

      router.push("/dashboard/students");

    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`❌ ${err.message}`);
      } else {
        setMessage("❌ Unknown error occurred.");
      }
    }
  };



  return (

    <form onSubmit={handleSubmit} >

      <table className="hidden min-w-full text-gray-900 md:table">

        <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
          <th>Nome :</th>
          <td>
            <input
              type="text"
              name="name"
              id="name"
              value={formData?.name}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </td>
        </tr>
        <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
          <th>Telefone:</th>
          <td>
            <input type="text" name="phone_number" id="phone_number"
              value={formData?.phone_number}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" />
          </td>
        </tr>
        <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
          <th>email:</th>
          <td>
            <input type="text" name="email" id="email"
              value={formData?.email}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" />
          </td>
        </tr>


        <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
          <th>Dia de vencimento</th>
          <td>
            <input type="text" name="due_date" id="due_date"
              value={formData?.due_date}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" />
          </td>
        </tr>
        <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
          <th>Date de início</th>
          <td>
            <input type="text" name="start_date" id="start_date"
              value={formData?.start_date}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" />
          </td>
        </tr>
      </table>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/students"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button className='hover:bg-purple-500' type="submit">Criar Aluno</Button>
      </div>

    </form>
  );
}