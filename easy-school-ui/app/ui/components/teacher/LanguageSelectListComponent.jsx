'use client';

import React from 'react';

// Changed from default export to named export
export function LanguageSelectListComponent({ languages, formData, handleLanguageToggle, handleCheckboxChange }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Desktop view - Horizontal Layout */}
          <div className="hidden md:block">
            <div className="mb-4">
              <div className="relative">
                <div className="px-4 py-3 font-medium">
                  <strong>Idioma</strong>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex flex-wrap gap-3">
                    {languages?.map((language) => {
                      const langId = language.id?.toString() || '';
                      const isSelected = formData.language_ids.includes(langId);

                      return (
                        <div
                          key={langId}
                          onClick={() => handleLanguageToggle(langId)}
                          className={`cursor-pointer border rounded-md px-4 py-2
                              ${isSelected ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-100 border-gray-200'}`}
                        >
                          <div className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`lang-${langId}`}
                                checked={isSelected}
                                onChange={(e) => handleCheckboxChange(e, langId)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`lang-${langId}`} className="cursor-pointer text-sm">
                                {language.name}
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile view - Horizontal Grid with Wrapping */}
          <div className="md:hidden mt-4">
            <label className="block text-sm font-medium mb-1 px-2">
              <strong>Idiomas:</strong>
            </label>
            <div className="rounded-lg bg-white p-3">
              <div className="flex flex-wrap gap-2">
                {languages?.map((language) => {
                  const langId = language.id?.toString() || '';
                  const isSelected = formData.language_ids.includes(langId);

                  return (
                    <label
                      key={langId}
                      className={`flex items-center px-3 py-2 rounded-md border ${
                        isSelected
                          ? 'bg-blue-100 border-blue-400'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      } cursor-pointer transition`}
                    >
                      <input
                        type="checkbox"
                        id={`mobile-lang-${langId}`}
                        checked={isSelected}
                        onChange={(e) => handleCheckboxChange(e, langId)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-sm">{language.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}