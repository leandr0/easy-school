'use client';

import React from 'react';
import DateInput from '@/app/dashboard/components/DateInput';
import BRLCurrency from '@/app/dashboard/components/currency';
import { Switch } from '@/app/dashboard/components/switch';

import { Can } from '@/components/Can';
import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';


type Props = {
  formData: TeacherModel;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompensationChange?: (amount: number) => void;
  onSwitchStatus?: (checked: boolean) => void;
  /** Hides the Hora/Aula (compensation) field. Used by the edit screens; the create flow keeps showing it. */
  hideCompensation?: boolean;
};

export function TeacherInfoComponent({
  formData = {},
  handleInputChange,
  onCompensationChange,
  onSwitchStatus,
  hideCompensation = false,
}: Props) {
  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Informações do Professor</h2>
          {formData.id &&

            <div className="shrink-0">
               <Can perm="admin.all">
              <Switch
                checked={Boolean(formData.status ?? formData.user?.status)}
                onChange={(checked) => onSwitchStatus?.(checked)}
                label={(formData.status ?? formData.user?.status) ? 'Ativo' : 'Inativo'}
                color="green"
              />
              </Can>
            </div>
          }
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Nome */}
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name ?? formData.user?.name ?? ''}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
              placeholder="Nome do professor"
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number ?? formData.user?.phone_number ?? ''}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
              placeholder="(00) 00000-0000"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <Can
              perm="teachers.write"
              fallback={

                <Can perm="teachers.read">
                  <input
                    type="email"
                    name="email"
                    readOnly={true}
                    value={formData.email ?? formData.user?.username ?? ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                    placeholder="email@exemplo.com"
                  />
                </Can>
              }
            >
              <input
                type="email"
                name="email"
                value={formData.email ?? formData.user?.username ?? ''}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                placeholder="email@exemplo.com"
              />
            </Can>
          </div>

          {/* Hora/Aula */}
          {!hideCompensation && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Hora/Aula
              </label>
              <Can
                perm="admin.all"
                fallback={

                  <Can perm="teachers.read">
                    <BRLCurrency
                      asInput
                      name="compensation"
                      readonly={true}
                      value={formData.compensation ?? ''}
                      onChange={onCompensationChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                    />
                  </Can>
                }
              >
                <BRLCurrency
                  asInput
                  name="compensation"
                  value={formData.compensation ?? ''}
                  onChange={onCompensationChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                />
              </Can>

            </div>
          )}

          {/* Data de início */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Data de início
            </label>
            <Can
              perm="teachers.write"
              fallback={

                <Can perm="teachers.read">
                  <DateInput
                    name="start_date"
                    readonly={true}
                    value={formData.start_date ?? formData.user?.created_at ?? ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                  />
                </Can>
              }
            >
              <DateInput
                name="start_date"
                value={formData.start_date ?? formData.user?.created_at ?? ''}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
              />

            </Can>

          </div>
        </div>
      </div>
    </section>
  );
}
