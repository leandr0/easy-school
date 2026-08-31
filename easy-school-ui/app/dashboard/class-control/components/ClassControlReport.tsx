'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

import { CourseClassCompleteModel } from '@/app/lib/definitions/course_class_definitions';
import { ClassControlModel, ClassControlResponseModel } from '@/app/lib/definitions/class_control_definitions';
import { StudentModel } from '@/app/lib/definitions/students_definitions';

import { getAllCourseClassAvailable } from '@/bff/services/courseClass.server';
import { getStudentsInCourseClass } from '@/bff/services/student.server';
import { controlFilteringDataRange } from '@/bff/services/classControl.server';

import { Button } from '@/app/ui/button';

function formatRecordDate(cc?: ClassControlModel): string {
  if (!cc?.day || !cc?.month) return '—';
  return `${String(cc.day).padStart(2, '0')}/${String(cc.month).padStart(2, '0')}`;
}

function isPresent(studentId: string, record: ClassControlResponseModel): boolean {
  return (record.students ?? []).some((s) => String(s.id) === studentId);
}

export default function ClassControlReport() {
  const [courseClassList, setCourseClassList] = useState<CourseClassCompleteModel[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [monthYm, setMonthYm] = useState<string>(() => format(new Date(), 'yyyy-MM'));

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [records, setRecords] = useState<ClassControlResponseModel[]>([]);
  const [roster, setRoster] = useState<StudentModel[]>([]);

  useEffect(() => {
    getAllCourseClassAvailable()
      .then((classes) => {
        const placeholder: CourseClassCompleteModel = {
          id: '',
          name: 'Selecione uma turma ... ',
          status: true,
          course: { id: '', name: '' },
          teacher: { id: '', name: '', language_ids: [], calendar_range_hour_days: [] },
          language: { id: '', name: '' },
        };
        setCourseClassList([placeholder, ...classes]);
      })
      .catch((err) => console.error(err));
  }, []);

  const selectedClassName = useMemo(
    () => courseClassList.find((c) => String(c.id) === selectedClassId)?.name ?? '',
    [courseClassList, selectedClassId]
  );

  const absencesByStudent = useMemo(() => {
    const map = new Map<string, number>();
    roster.forEach((s) => {
      const id = String(s.id);
      const absences = records.filter((r) => !isPresent(id, r)).length;
      map.set(id, absences);
    });
    return map;
  }, [roster, records]);

  const handleGenerate = async () => {
    if (!selectedClassId) {
      setError('Selecione uma turma.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [year, month] = monthYm.split('-').map(Number);
      const start = startOfMonth(new Date(year, month - 1, 1));
      const end = endOfMonth(start);

      const [classResult, studentsResult] = await Promise.all([
        controlFilteringDataRange(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'), Number(selectedClassId)),
        getStudentsInCourseClass(selectedClassId),
      ]);

      const sorted = (classResult ?? []).slice().sort((a, b) => {
        const ka = (a.class_control?.year ?? 0) * 10000 + (a.class_control?.month ?? 0) * 100 + (a.class_control?.day ?? 0);
        const kb = (b.class_control?.year ?? 0) * 10000 + (b.class_control?.month ?? 0) * 100 + (b.class_control?.day ?? 0);
        return ka - kb;
      });

      setRecords(sorted);
      setRoster(studentsResult ?? []);
      setHasGenerated(true);
    } catch (err) {
      console.error(err);
      setError('Erro ao gerar relatório. Tente novamente.');
      setRecords([]);
      setRoster([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    if (!roster.length) return;

    setExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'landscape' });
      const [year, month] = monthYm.split('-').map(Number);
      const monthLabel = format(new Date(year, month - 1, 1), 'MMMM/yyyy');

      doc.setFontSize(14);
      doc.text('Relatório de Frequência', 14, 15);
      doc.setFontSize(10);
      doc.text(`Turma: ${selectedClassName}    Mês: ${monthLabel}`, 14, 22);

      autoTable(doc, {
        startY: 28,
        head: [['Data', 'Livro', 'Capítulo']],
        body: records.length
          ? records.map((r) => [
              formatRecordDate(r.class_control),
              r.class_control?.book?.name ?? '—',
              r.class_control?.chapter?.name ?? '—',
            ])
          : [['—', '—', '—']],
        styles: { fontSize: 8 },
        headStyles: { fillColor: [124, 58, 237] },
      });

      const afterContentTableY = (doc as any).lastAutoTable.finalY + 10;

      autoTable(doc, {
        startY: afterContentTableY,
        head: [['Aluno', ...records.map((r) => formatRecordDate(r.class_control))]],
        body: roster.map((s) => [
          s.user?.name ?? '—',
          ...records.map((r) => (isPresent(String(s.id), r) ? 'P' : 'F')),
        ]),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [124, 58, 237] },
      });

      const afterAttendanceTableY = (doc as any).lastAutoTable.finalY + 10;

      autoTable(doc, {
        startY: afterAttendanceTableY,
        head: [['Aluno', 'Faltas']],
        body: roster.map((s) => [s.user?.name ?? '—', String(absencesByStudent.get(String(s.id)) ?? 0)]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [124, 58, 237] },
      });

      const safeClassName = (selectedClassName || 'turma').replace(/[^\w-]+/g, '_');
      doc.save(`relatorio-frequencia-${safeClassName}-${monthYm}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Filters */}
      <div className="rounded-lg bg-white p-4 border">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs text-gray-600 mb-1">Turma</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
            >
              {courseClassList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs text-gray-600 mb-1">Mês</label>
            <input
              type="month"
              value={monthYm}
              onChange={(e) => setMonthYm(e.target.value)}
              className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
            />
          </div>

          <div className="sm:col-span-2">
            <Button
              className="hover:bg-purple-500 w-full"
              type="button"
              disabled={loading}
              onClick={handleGenerate}
            >
              {loading ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </div>

          <div className="sm:col-span-2">
            <Button
              className="hover:bg-purple-500 w-full"
              type="button"
              disabled={!hasGenerated || !roster.length || exporting}
              onClick={handleExportPdf}
            >
              {exporting ? 'Exportando...' : 'Exportar PDF'}
            </Button>
          </div>
        </div>

        {!!error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {hasGenerated && (
        <>
          {/* Content taught per class */}
          <div className="rounded-lg bg-white p-4 border">
            <h2 className="font-semibold text-gray-800 mb-3">Conteúdo das Aulas</h2>
            {records.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma aula registrada neste mês.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left min-w-[80px]">Data</th>
                      <th className="border p-2 text-left">Livro</th>
                      <th className="border p-2 text-left">Capítulo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.class_control?.id} className="border-t">
                        <td className="border p-2">{formatRecordDate(r.class_control)}</td>
                        <td className="border p-2">{r.class_control?.book?.name ?? '—'}</td>
                        <td className="border p-2">{r.class_control?.chapter?.name ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Attendance matrix */}
          <div className="rounded-lg bg-white p-4 border">
            <h2 className="font-semibold text-gray-800 mb-3">Frequência dos Alunos</h2>
            {roster.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum aluno matriculado nesta turma.</p>
            ) : records.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma aula registrada neste mês.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left min-w-[160px] sticky left-0 bg-gray-100">Aluno</th>
                      {records.map((r) => (
                        <th key={r.class_control?.id} className="border p-2 text-center min-w-[60px]">
                          {formatRecordDate(r.class_control)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((s) => (
                      <tr key={s.id} className="border-t">
                        <td className="border p-2 sticky left-0 bg-white">{s.user?.name ?? '—'}</td>
                        {records.map((r) => {
                          const present = isPresent(String(s.id), r);
                          return (
                            <td
                              key={r.class_control?.id}
                              className={`border p-2 text-center ${present ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {present ? '✓' : '✗'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary of absences */}
          <div className="rounded-lg bg-white p-4 border">
            <h2 className="font-semibold text-gray-800 mb-3">Resumo de Faltas</h2>
            {roster.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum aluno matriculado nesta turma.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm max-w-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Aluno</th>
                      <th className="border p-2 text-left">Faltas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((s) => (
                      <tr key={s.id} className="border-t">
                        <td className="border p-2">{s.user?.name ?? '—'}</td>
                        <td className="border p-2">{absencesByStudent.get(String(s.id)) ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
