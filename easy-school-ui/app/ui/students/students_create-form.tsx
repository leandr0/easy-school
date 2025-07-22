'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import React, { useState } from "react";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import { createStudent } from '@/app/lib/actions/students_actions';
import DateInput from '../components/DateInput';

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


      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">

            <h2 className="text-base font-bold text-left mb-4 p-3 text-gray-800">Informações do Professor</h2>

            <div className="space-y-4">
              {/* Nome - Full width */}
              <div className="flex items-center justify-center">
                <div className="w-full flex items-center">
                  <label className="w-24 text-sm text-right mr-3">Nome:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleChange}
                    className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Telefone and Email on same line */}
              <div className="flex items-center justify-center">
                <div className="w-full flex items-center">
                  <label className="w-24 text-sm text-right mr-3">Telefone:</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number || ""}
                    onChange={handleChange}
                    className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                  />
                  <label className="w-24 text-sm text-right mr-3">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Salário and Data de início on same line */}
              <div className="flex">
                <div className="w-1/2 flex items-center">
                  <label className="w-24 text-sm text-right mr-3">Vencimento:</label>
                  <input
                    type="number"
                    name="due_date"
                    id="due_date"
                    min={5}
                    max={20}
                    step={5}
                    value={formData?.due_date}
                    onChange={(e) => {
                      const allowed = [5, 10, 15, 20];
                      const val = Number(e.target.value);
                      if (allowed.includes(val) || e.target.value === "") {
                        handleChange(e);
                      }
                    }}
                    className="text-center peer block w-15 rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                  />
                  <label className="w-34 text-sm text-right mr-3 pl-[115px]" >Início:</label>
                  <DateInput
                    name="start_date"
                    value={formData.start_date || ""}
                    onChange={handleChange}
                    className="text-center rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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