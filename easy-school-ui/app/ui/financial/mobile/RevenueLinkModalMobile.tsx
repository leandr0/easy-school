'use client';

import React from 'react';

interface RevenueLinkModalProps {
  show: boolean;
  link: string | null;
  onOpenLink: () => void;
  onClose: () => void;
}

export default function RevenueLinkModalMobile({ show, link, onOpenLink, onClose }: RevenueLinkModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-sm">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Link Gerado</h3>
        {link ? (
          <p className="text-sm text-gray-700 break-words mb-5 sm:mb-6">
            O link para a mensagem foi gerado:{" "}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {link}
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-700 mb-6">Nenhum link foi gerado.</p>
        )}
        <div className="flex flex-col sm:flex-row justify-end sm:gap-3 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onOpenLink}
            disabled={!link}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Abrir Link
          </button>
        </div>
      </div>
    </div>
  );
}
