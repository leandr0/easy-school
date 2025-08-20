// LanguageSelectListComponent.tsx
'use client';

import React from 'react';

type Props = {
  languages: Array<{ id?: string | number; name?: string }>;
  language_ids: string[];
  handleLanguageToggle: (langId: string) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>, langId: string) => void;
};

export function LanguageSelectListComponent({
  languages,
  language_ids,
  handleLanguageToggle,
  handleCheckboxChange,
}: Props) {
  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Idiomas</h3>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-2">
            {languages?.map((language) => {
              const langId = String(language.id ?? '');
              var isSelected = false;
              
              if(language_ids)
                isSelected = language_ids.includes(langId);

              return (
                <label
                  key={langId}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition
                  ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                  onClick={() => handleLanguageToggle(langId)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleCheckboxChange(e, langId)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>{language.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {languages?.map((language) => {
              const langId = String(language.id ?? '');
              var isSelected = false;
              
              if(language_ids)
                isSelected = language_ids.includes(langId);
              return (
                <label
                  key={langId}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition
                  ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleCheckboxChange(e, langId)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="truncate">{language.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
