'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import React, { useEffect, useState } from "react";
import { CourseModel } from '@/app/lib/definitions/courses_definitions';
import { createCourse } from '@/app/lib/actions/course_actions';
import { BookOpenIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { LanguageModel } from '@/app/lib/definitions/language_definitions';
import { getAllLanguages } from '@/app/lib/actions/language_actions';

export default function CreateCourseForm() {

  const router = useRouter();

  const [languages, setLanguages] = useState<LanguageModel[]>([]);

  const [formData, setFormData] = useState<CourseModel>({
    name: "",
    status: true
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllLanguages()
      .then((languages) => {
        const updatedLanguages = [
          {
            id: "",
            name: "Selecione um idioma ... ",
            status: true,
          },
          ...languages,
        ];

        setLanguages(updatedLanguages);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createCourse(formData);

      setMessage("✅ Course created successfully!");
      setFormData({
        name: "",
        status: true,
      });

      router.push("/dashboard/courses");

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

      <div className="mb-4">
        <div className="relative">
          <select
            id="language_id"
            name="language_id"
            value={formData.language?.id}
            onChange={handleChange}
            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="operadora-error"
          >
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
          <GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>


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
      </table>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/courses"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Criar Curso</Button>
      </div>

    </form>
  );
}