'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import React, { useEffect, useMemo, useState } from 'react';
import { BookModel, ChapterModel } from '@/app/lib/definitions/books_definitions';
import { Pagination } from '@/app/dashboard/components/Pagination';

import { BookOpenIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

type Props = {
  onSave: (b: BookModel) => Promise<BookModel>;
};

const CHAPTER_PAGE_SIZE_OPTIONS = [5, 10, 20];
const DEFAULT_CHAPTER_PAGE_SIZE = 5;

export default function CreateBookForm({ onSave }: Props) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [chapters, setChapters] = useState<ChapterModel[]>([{ name: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Chapters can pile up (some books have dozens), so they're paginated
  // instead of rendered as one long scrolling list of inputs.
  const [chapterPage, setChapterPage] = useState(1);
  const [chapterPageSize, setChapterPageSize] = useState(DEFAULT_CHAPTER_PAGE_SIZE);

  const totalChapters = chapters.length;
  const totalChapterPages = Math.max(1, Math.ceil(totalChapters / Math.max(1, chapterPageSize)));

  useEffect(() => {
    if (chapterPage > totalChapterPages) setChapterPage(totalChapterPages);
  }, [totalChapterPages, chapterPage]);

  // Each visible row keeps track of its index in the full `chapters` array,
  // so edits/removals apply to the right chapter regardless of the page.
  const visibleChapters = useMemo(() => {
    const start = (chapterPage - 1) * chapterPageSize;
    return chapters.slice(start, start + chapterPageSize).map((chapter, i) => ({
      chapter,
      index: start + i,
    }));
  }, [chapters, chapterPage, chapterPageSize]);

  const handleChapterChange = (index: number, value: string) => {
    setChapters((prev) => prev.map((c, i) => (i === index ? { ...c, name: value } : c)));
  };

  const addChapter = () => {
    const newLength = chapters.length + 1;
    setChapters((prev) => [...prev, { name: '' }]);
    // Jump to the page that will contain the new chapter so it's visible right away.
    setChapterPage(Math.max(1, Math.ceil(newLength / chapterPageSize)));
  };

  const removeChapter = (index: number) => {
    setChapters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);
      setToast(null);

      const payload: BookModel = {
        name: name.trim(),
        status: true,
        chapters: chapters
          .map((c) => ({ ...c, name: (c.name ?? '').trim() }))
          .filter((c) => c.name.length > 0)
          .map((c, index) => ({ name: c.name, position: index + 1 })),
      };

      await onSave(payload);
      setToast('✅ Livro criado com sucesso!');
      router.push('/dashboard/books');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred.';
      setToast(`❌ ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const hasValidChapter = chapters.some((c) => (c.name ?? '').trim().length > 0);
  const disableSubmit = submitting || !name.trim() || !hasValidChapter;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Header */}
      <div className="px-4 pt-2 md:px-0 md:pt-4">
        <h1 className="text-base md:text-xl font-semibold text-gray-900 flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          Cadastrar Livro
        </h1>
        <p className="text-xs md:text-sm text-gray-500">
          Defina o nome do livro e os capítulos que ele contém.
        </p>
      </div>

      {/* Toast */}
      <div className="px-4 md:px-0">
        {toast && (
          <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
            {toast}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 md:mt-6 px-4 md:px-0 pb-24 md:pb-0">
        <div className="rounded-lg bg-white md:bg-gray-50 border border-gray-200 md:border-0 p-3 md:p-5">
          <div className="space-y-5">
            {/* Nome do livro */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Nome do Livro
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Inglês Básico - Volume 1"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
              />
            </div>

            {/* Capítulos */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-900">
                  Capítulos
                  <span className="ml-1 font-normal text-gray-500">({totalChapters})</span>
                </label>
                <button
                  type="button"
                  onClick={addChapter}
                  className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <PlusIcon className="w-4 h-4" />
                  Adicionar capítulo
                </button>
              </div>

              <div className="mt-2 space-y-2">
                {visibleChapters.map(({ chapter, index }) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-6 shrink-0 text-sm text-gray-500">{index + 1}.</span>
                    <input
                      type="text"
                      value={chapter.name ?? ''}
                      onChange={(e) => handleChapterChange(index, e.target.value)}
                      placeholder={`Nome do capítulo ${index + 1}`}
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeChapter(index)}
                      disabled={chapters.length === 1}
                      className="rounded-md border border-gray-300 p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {totalChapters > CHAPTER_PAGE_SIZE_OPTIONS[0] && (
                <div className="mt-3">
                  <Pagination
                    totalCount={totalChapters}
                    currentPage={chapterPage}
                    pageSize={chapterPageSize}
                    onPageChange={setChapterPage}
                    onPageSizeChange={(s) => {
                      setChapterPageSize(s);
                      setChapterPage(1);
                    }}
                    pageSizeOptions={CHAPTER_PAGE_SIZE_OPTIONS}
                    labels={{ previous: 'Anterior', next: 'Próxima', of: 'de', perPage: 'capítulos', page: 'Página', goTo: 'Ir para' }}
                  />
                </div>
              )}

              <p className="mt-2 text-[11px] text-gray-500">Informe ao menos um capítulo.</p>
            </div>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex justify-end gap-3 mt-4">
          <Link
            href="/dashboard/books"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={disableSubmit}>
            {submitting ? 'Criando...' : 'Criar Livro'}
          </Button>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center gap-2">
        <Link
          href="/dashboard/books"
          className="w-1/2 h-11 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 active:bg-gray-100 flex items-center justify-center"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={disableSubmit}
          className={`w-1/2 h-11 rounded-md text-sm font-semibold ${
            disableSubmit ? 'bg-purple-300 text-white' : 'bg-purple-600 text-white active:bg-purple-700'
          }`}
        >
          {submitting ? 'Criando...' : 'Criar'}
        </button>
      </div>
    </form>
  );
}
