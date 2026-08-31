'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { StudentModel } from '@/app/lib/definitions/students_definitions';
import { StudentContractModel, ContractCourseModel } from '@/app/lib/definitions/contracts_definitions';
import { findByIdCoursePrice, updateStudentContracts } from '@/bff/services/student.server';
import ContractsDesktop from './ContractsDesktop';
import ContractsMobile from './ContractsMobile';
import ContractsStudentsTable from './ContractsStudentsTable';

interface Props {
  students: StudentModel[];
}

export default function ContractsPageClient({ students }: Props) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [contract, setContract] = useState<StudentContractModel | null>(null);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const buildPricesFromCourses = (courses?: ContractCourseModel[]) => {
    const initialPrices: Record<string, string> = {};
    (courses ?? []).forEach((course) => {
      if (course.id) {
        initialPrices[course.id] = (course.course_price ?? 0).toString();
      }
    });
    return initialPrices;
  };

  const handleSelectStudent = async (id: string) => {
    setSelectedStudentId(id);
    setContract(null);
    setPrices({});
    setMessage('');
    setError(null);

    if (!id) return;

    setLoading(true);
    try {
      const data = await findByIdCoursePrice(id);
      setContract(data);
      setPrices(buildPricesFromCourses(data.courses));
    } catch (e) {
      setError('Não foi possível carregar os cursos deste aluno.');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (courseId: string, value: string) => {
    setPrices((prev) => ({ ...prev, [courseId]: value }));
  };

  const handleSave = async () => {
    if (!contract?.id) return;

    setSaving(true);
    setMessage('');
    setError(null);

    try {
      const coursesToSend: ContractCourseModel[] = (contract.courses ?? []).map((course) => {
        const rawValue = (prices[course.id ?? ''] ?? '0').toString().replace(',', '.');
        const parsed = parseFloat(rawValue);
        return {
          id: course.id,
          name: course.name,
          course_price: Number.isNaN(parsed) ? (course.course_price ?? 0) : parsed,
        };
      });

      const updated = await updateStudentContracts(contract.id, coursesToSend);

      setContract((prev) => (prev ? { ...prev, courses: updated ?? coursesToSend } : prev));
      setPrices(buildPricesFromCourses(updated ?? coursesToSend));
      setMessage('✅ Contrato atualizado com sucesso!');
    } catch (e) {
      setMessage('❌ Erro ao atualizar o contrato.');
    } finally {
      setSaving(false);
    }
  };

  const courses = contract?.courses ?? [];
  const selectedStudent = students.find((student) => student.id === selectedStudentId);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selecione um aluno
        </label>
        <ContractsStudentsTable
          students={students}
          selectedStudentId={selectedStudentId}
          onSelectStudent={handleSelectStudent}
          onSearchChange={() => handleSelectStudent('')}
        />
      </div>

      {loading && <p className="text-sm text-gray-500">Carregando cursos...</p>}

      {message && (
        <div
          className={`p-3 rounded-md text-center ${
            message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
      {error && <div className="p-3 rounded-md bg-red-100 text-red-700 text-center">{error}</div>}

      {contract && !loading && (
        <>
          {courses.length === 0 ? (
            <p className="text-sm text-gray-500">Este aluno não possui cursos ativos.</p>
          ) : (
            <>
              <div className="mb-1">
                <label className="block text-sm font-medium">
                  <strong>Cursos ativos{selectedStudent?.user?.name ? ` de ${selectedStudent.user.name}` : ''}:</strong>
                </label>
              </div>

              <div className="hidden md:block">
                <ContractsDesktop courses={courses} prices={prices} onPriceChange={handlePriceChange} />
              </div>
              <div className="block md:hidden">
                <ContractsMobile courses={courses} prices={prices} onPriceChange={handlePriceChange} />
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <Link
                  href="/dashboard/financial"
                  className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                  Voltar
                </Link>
                <Button type="button" onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Contrato'}
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {!contract && (
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/financial"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Voltar
          </Link>
        </div>
      )}
    </div>
  );
}
