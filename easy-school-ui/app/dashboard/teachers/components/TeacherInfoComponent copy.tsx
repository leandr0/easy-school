'use client';

import React from 'react';
import DateInput from '../../../ui/components/DateInput';
import BRLCurrency from '../../../ui/components/currency';
import { Switch } from '@/app/ui/components/switch';
import BRLCurrencyDebug from '@/app/ui/components/currency_debug';

type Props = {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompensationChange: (amount: number) => void;
  onSwitchStatus?: (checked: boolean) => void;
};

export function TeacherInfoComponent({
  formData = {},
  handleInputChange = () => { },
  onCompensationChange,
  onSwitchStatus,
}: Props) {

  return (
    <section className="rounded-2xl bg-white md:bg-gray-50 md:rounded-lg">
      <div className="px-4 pt-4 md:p-3">
        <h2 className="text-sm md:text-base font-semibold text-gray-900 md:font-bold md:text-left">
          Informações do Professor
        </h2>
        <p className="mt-0.5 text-xs text-gray-500 md:hidden">
          Preencha os dados básicos do professor.
        </p>
      </div>

      <div className="px-4 pb-4 md:p-2">
        <div className="space-y-4 md:space-y-3">
          {/* Nome */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[7.5rem,1fr] md:items-center">
            <label htmlFor="name" className="text-sm text-gray-700 md:text-right md:mr-3">
              Nome
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex.: Maria Silva"
              autoComplete="name"
            />
          </div>

          {/* Telefone / Email */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[7.5rem,1fr] md:items-center">
              <label htmlFor="phone_number" className="text-sm text-gray-700 md:text-right md:mr-3">
                Telefone
              </label>
              <input
                id="phone_number"
                type="tel"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(11) 99999-9999"
                autoComplete="tel"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-[7.5rem,1fr] md:items-center">
              <label htmlFor="email" className="text-sm text-gray-700 md:text-right md:mr-3">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="exemplo@dominio.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Hora/Aula / Data de início */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[7.5rem,1fr] md:items-center">
              <label htmlFor="compensation" className="text-sm text-gray-700 md:text-right md:mr-3">
                Hora/Aula
              </label>
              <BRLCurrency
                asInput
                name="compensation"
                value={formData.compensation ?? ''}
                onChange={onCompensationChange}
                placeholder="R$ 0,00"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-[7.5rem,1fr] md:items-center">
              <label htmlFor="start_date" className="text-sm text-gray-700 md:text-right md:mr-3">
                Data de início
              </label>
              <DateInput
                id="start_date"
                name="start_date"
                value={formData.start_date || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:block mb-1 pl-[71px]">
              {formData.id !== undefined && formData.id !== null  && ( 
                <Switch 
                  checked={Boolean(formData.status)}
                  onChange={onSwitchStatus ? onSwitchStatus : () => {} }
                  label={formData.status ? 'Ativo' : 'Inativo'}
                  color="green"
                />)
              
            }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
