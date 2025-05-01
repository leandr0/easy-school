'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { v4 as uuid } from 'uuid'

import React, { useState, useEffect } from "react";
import { createTeacher } from '@/app/lib/actions/teacher_actions';
import { CreateTeacherFormModel, TeacherModel, TeacherWeekDayAvailableModel } from '@/app/lib/definitions/teacher_definitions';
import { LanguageModel } from '@/app/lib/definitions/language_definitions';
import { getAllLanguages } from '@/app/lib/actions/language_actions';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';
import { getAllWeekDays } from '@/app/lib/actions/calendar_week_day_actions';
import { DeleteStudantFromCourseClassList, DeleteWeekDayAvailability } from '../buttons/ui_buttons';

import { FolderMinusIcon } from '@heroicons/react/20/solid';
import { CalendarRangeHourDayModel } from '@/app/lib/definitions/calendat_range_hour_day_definitions';

export default function CreateTeacherForm() {

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateTeacherFormModel>({
    name: "",
    status: true,
    phone_number: "",
    language_ids: [],
  });

  const [teacherWeeDayAvailables, setTeacherWeeDayAvailables] = useState<TeacherWeekDayAvailableModel[]>([]);

  const [calendarRangeHourDayModels, setCalendarRangeHourDayModels] = useState<CalendarRangeHourDayModel[]>([]);

  const [languages, setLanguages] = useState<LanguageModel[]>([]);

  const [weekDays, setWeekDays] = useState<CalendarWeekDayModel[]>([]);

  const [teacher, setTeacher] = useState<TeacherModel>();

  const [actionType, setActionType] = useState<string | null>(null);

  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWeekDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    // Force both sides to string to ensure match
    const selectedWeekDay = weekDays.find(day => day.id?.toString() === selectedId);

    if (selectedWeekDay) {
      setFormData(prev => ({
        ...prev,
        week_day: selectedWeekDay
      }));
    }
  };


  // Modified to ensure consistent string type for language IDs
  const handleLanguageToggle = (langId: string) => {
    console.log(`ROW CLICK - Toggle language: ${langId} (type: ${typeof langId})`);

    setFormData((prev) => {
      // Check if this ID already exists in the array
      const exists = prev.language_ids.includes(langId);
      console.log(`  - Current exists in array? ${exists}`);
      console.log(`  - Current language_ids: ${JSON.stringify(prev.language_ids)}`);

      // Return updated array with consistent string type
      const updatedIds = exists
        ? prev.language_ids.filter(id => id !== langId)
        : [...prev.language_ids, langId];

      console.log(`  - Updated language_ids: ${JSON.stringify(updatedIds)}`);
      return {
        ...prev,
        language_ids: updatedIds
      };
    });
  };

  // Special handler for checkbox changes to prevent event bubbling issues
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, langId: string) => {
    e.stopPropagation(); // Stop event from bubbling up to the row
    const { checked } = e.target;

    console.log(`CHECKBOX CHANGE - Language: ${langId} (type: ${typeof langId}), Checked: ${checked}`);

    setFormData((prev) => {
      console.log(`  - Current language_ids: ${JSON.stringify(prev.language_ids)}`);
      console.log(`  - Current includes this ID? ${prev.language_ids.includes(langId)}`);

      let updatedIds = [...prev.language_ids];

      if (checked && !prev.language_ids.includes(langId)) {
        updatedIds = [...prev.language_ids, langId];
      } else if (!checked && prev.language_ids.includes(langId)) {
        updatedIds = prev.language_ids.filter(id => id !== langId);
      }

      console.log(`  - Updated language_ids: ${JSON.stringify(updatedIds)}`);
      return {
        ...prev,
        language_ids: updatedIds
      };
    });
  };

  useEffect(() => {
    getAllLanguages()
      .then(languages => {
        setLanguages(languages);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    getAllWeekDays()
      .then((weekDays) => {
        const updatedWeekDays = [
          {
            id: "",
            week_day: "Selecione um dia da semana ... ",
          },
          ...weekDays,
        ];

        setWeekDays(updatedWeekDays);
      })
      .catch((err) => setError(err.message));
  }, []);


  useEffect(() => {
    // Check for duplicates
    const uniqueIds = [...new Set(formData.language_ids)];

  }, [formData.language_ids]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (actionType === 'add_teacher_availability') {

      if (!formData.week_day || formData.week_day.id === "") {
        console.warn("🚫 Week day not selected.");
        setMessage("❌ Por favor, selecione um dia da semana.");
        return;
      }

      const newAvailability: TeacherWeekDayAvailableModel = {
        uddi: uuid(),
        week_day: formData.week_day,
        start_hour: formData.start_hour,
        start_minute: formData.start_minute,
        end_hour: formData.end_hour,
        end_minute: formData.end_minute,
      };

      setTeacherWeeDayAvailables(prev => {
        const updated = [...prev, newAvailability];
        console.log("✅ Updated availabilities:", updated);
        return updated;
      });

      setFormData(prev => ({
        ...prev,
        week_day: undefined,
        start_hour: "",
        start_minute: "",
        end_hour: "",
        end_minute: "",
      }));

      return;

    }
    else if(actionType === 'remove_week_day_availability'){
      setTeacherWeeDayAvailables(prev => prev.filter(item => item.uddi !== formData.week_day?.id));
    }

    else {

      console.log("Creating teacher ...");

      try {


        /** 
       setCalendarRangeHourDayModels( teacherWeeDayAvailables.map((item): CalendarRangeHourDayModel => ({
          week_day: item.week_day,
          start_hour: item.start_hour,
          start_minute: item.start_minute,
          end_hour: item.end_hour,
          end_minute: item.end_minute
        })));

        console.log("CalendarRangeHourDayModel :: ");
        console.log(calendarRangeHourDayModels);
*/

        /** 
        setTeacher({
          name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          status: formData.status,
          compensation: formData.compensation,
          start_date: formData.start_date,
          language_ids: formData.language_ids,
          calendar_range_hour_days: teacherWeeDayAvailables.map((item): CalendarRangeHourDayModel => ({
            week_day: item.week_day,
            start_hour: item.start_hour,
            start_minute: item.start_minute,
            end_hour: item.end_hour,
            end_minute: item.end_minute,
          })),
        });*/

        const newTeacher: TeacherModel = {
          name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          status: formData.status,
          compensation: formData.compensation,
          start_date: formData.start_date,
          language_ids: formData.language_ids,
          calendar_range_hour_days: teacherWeeDayAvailables.map((item): CalendarRangeHourDayModel => ({
            week_day: item.week_day,
            start_hour: item.start_hour,
            start_minute: item.start_minute,
            end_hour: item.end_hour,
            end_minute: item.end_minute,
          })),
        };

        
        console.log("Teacher :: ");
        console.log(newTeacher);

        await createTeacher(newTeacher);
        


        //await createTeacher(teacher!);

        setMessage("✅ Teacher created successfully!");
        setFormData({
          name: "",
          status: true,
          language_ids: [],
        });

        router.push("/dashboard/teachers");

      } catch (err: unknown) {
        if (err instanceof Error) {
          setMessage(`❌ ${err.message}`);
          console.error("Form submission error:", err);
        } else {
          setMessage("❌ Unknown error occurred.");
          console.error("Unknown form submission error:", err);
        }
      }
    }

  };

  return (
    <form onSubmit={handleSubmit}>


      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="hidden min-w-full text-gray-900 md:table">
              <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <th>Nome :</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData?.name || ""}
                    onChange={handleInputChange}
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <th>Telefone:</th>
                <td>
                  <input
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    value={formData?.phone_number || ""}
                    onChange={handleInputChange}
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <th>email:</th>
                <td>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={formData?.email || ""}
                    onChange={handleInputChange}
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <th>Salário</th>
                <td>
                  <input
                    type="text"
                    name="compensation"
                    id="compensation"
                    value={formData?.compensation || ""}
                    onChange={handleInputChange}
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <th>Date de início</th>
                <td>
                  <input
                    type="text"
                    name="start_date"
                    id="start_date"
                    value={formData?.start_date || ""}
                    onChange={handleInputChange}
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      {/** Lista de idiomas for desktop **/}


      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="mb-4">
              <div className="relative">
                <table className="hidden min-w-full text-gray-900 md:table">
                  <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                      <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                        <strong>Idioma</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {languages?.map((language) => {
                      // Ensure language.id is treated as string
                      const langId = language.id?.toString() || '';
                      const isSelected = formData.language_ids.includes(langId);

                      return (
                        <tr
                          key={langId}
                          onClick={() => handleLanguageToggle(langId)}
                          className={`w-full cursor-pointer border-b py-3 text-sm last-of-type:border-none
                ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}
                [&:first-child>td:first-child]:rounded-tl-lg
                [&:first-child>td:last-child]:rounded-tr-lg
                [&:last-child>td:first-child]:rounded-bl-lg
                [&:last-child>td:last-child]:rounded-br-lg`}
                        >
                          <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={`lang-${langId}`}
                                checked={isSelected}
                                onChange={(e) => handleCheckboxChange(e, langId)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`lang-${langId}`} className="cursor-pointer">
                                {language.name}
                              </label>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/** Mobile view for language selection **/}
      <div className="md:hidden mt-4">
        <label className="block text-sm font-medium mb-1">
          <strong>Idiomas:</strong>
        </label>
        <div className="rounded-lg bg-gray-50 p-2">
          {languages?.map((language) => {
            // Ensure consistent string type for ID
            const langId = language.id?.toString() || '';
            const isSelected = formData.language_ids.includes(langId);

            return (
              <label
                key={langId}
                className={`flex items-center p-4 mb-2 rounded-md border ${isSelected
                  ? 'bg-blue-100 border-blue-400'
                  : 'bg-white border-gray-200 hover:bg-gray-100'
                  } cursor-pointer transition`}
              >
                <input
                  type="checkbox"
                  id={`mobile-lang-${langId}`}
                  checked={isSelected}
                  onChange={(e) => handleCheckboxChange(e, langId)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{language.name} (ID: {langId})</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}




      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Dia
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Hora Inicio
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    Hora Fim
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {teacherWeeDayAvailables?.map((teacherWeeDayAvailable) => {


                  return (
                    <tr
                      key={teacherWeeDayAvailable.uddi}
                      className={`w-full cursor-pointer border-b py-3 text-sm last-of-type:border-none}
                [&:first-child>td:first-child]:rounded-tl-lg
                [&:first-child>td:last-child]:rounded-tr-lg
                [&:last-child>td:first-child]:rounded-bl-lg
                [&:last-child>td:last-child]:rounded-br-lg`
              }
              onClick={() => {
                if (teacherWeeDayAvailable.uddi) {
                  // Update form data directly
                  setFormData(prev => ({
                    ...prev,
                    week_day: {
                      ...prev.week_day,
                      id: teacherWeeDayAvailable.uddi
                    }
                  }));
                  

                }
              }}
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">

                          <label className="cursor-pointer">
                            {teacherWeeDayAvailable.week_day?.week_day}
                          </label>
                        </div>
                      </td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">

                          <label className="cursor-pointer">
                            {teacherWeeDayAvailable.start_hour + ":" + teacherWeeDayAvailable.start_minute}
                          </label>
                        </div>
                      </td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">

                          <label className="cursor-pointer">
                            {teacherWeeDayAvailable.end_hour + ":" + teacherWeeDayAvailable.end_minute}
                          </label>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <div className="flex justify gap-3">
                          <DeleteWeekDayAvailability disabled={true} setActionType={setActionType} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-4 md:pt-5">
            <div className="mb-4">
              <div className="relative">
                <select
                  id="week_day_id"
                  name="week_day_id"
                  value={formData.week_day?.id || ""}
                  onChange={handleWeekDayChange}
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                >
                  {weekDays.map((weekDay) => (
                    <option key={weekDay.id} value={weekDay.id}>
                      {weekDay.week_day}
                    </option>
                  ))}
                </select>
                <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>


            <table className="hidden min-w-full text-gray-900 md:table">
              <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">

                <th>Horário de Início :</th>
                <div className="relative">
                  <td>

                    <input
                      type="number"
                      name="start_hour"
                      id="start_hour"
                      value={formData?.start_hour || ""}
                      onChange={handleInputChange}
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />

                  </td>
                  <td>
                    <input
                      type="number"
                      name="start_minute"
                      id="start_minute"
                      value={formData?.start_minute || ""}
                      onChange={handleInputChange}
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                  </td>
                </div>
              </tr>
              <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">

                <th>Horário final :</th>
                <div className="relative">
                  <td>
                    <input
                      type="number"
                      name="end_hour"
                      id="end_hour"
                      value={formData?.end_hour || ""}
                      onChange={handleInputChange}
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="end_minute"
                      id="end_minute"
                      value={formData?.end_minute || ""}
                      onChange={handleInputChange}
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                  </td>
                </div>
              </tr>
            </table>
            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="submit"
                name="action"
                onClick={() => setActionType('add_teacher_availability')}
                value="add_teacher_availability"
                className='hover:bg-purple-500'>
                Adicionar disponibilidade
              </Button>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/teachers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button onClick={() => setActionType('')}
        className='hover:bg-purple-500' type="submit">Criar Professor</Button>
      </div>
    </form>
  );
}