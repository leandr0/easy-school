'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { MessageModel } from '@/app/lib/definitions/messages_definitions';
import FormActions from '../../../courses-class/components/FormActions';
import { getAllMessages, saveMessages } from '@/app/services/revenueMessageService';

export default function CreateMessageForm() {
  const router = useRouter();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<MessageModel>({
    reminder_message: '',
    payment_overdue_message: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // (Optional) soft limits just to guide typing on mobile
  const REMINDER_MAX = 500;
  const OVERDUE_MAX = 500;

  useEffect(() => {
    getAllMessages()
      .then((data) => setFormData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const reminderCount = useMemo(
    () => (formData.reminder_message?.length ?? 0),
    [formData.reminder_message]
  );
  const overdueCount = useMemo(
    () => (formData.payment_overdue_message?.length ?? 0),
    [formData.payment_overdue_message]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setToastMsg(null);
      await saveMessages(formData);
      setToastMsg('✅ Mensagens salvas com sucesso!');
      router.push('/dashboard'); // mantenho seu destino original
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred';
      setToastMsg(`❌ ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => router.push('/dashboard');

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Page header */}
      <div className="px-4 pt-2 md:px-0 md:pt-4">
        <h1 className="text-base md:text-xl font-semibold text-gray-900">Mensagens Automáticas</h1>
        <p className="text-xs md:text-sm text-gray-500">
          Defina os textos usados para lembretes e cobranças em mensagens do sistema.
        </p>
      </div>

      {/* Toast / error */}
      <div className="px-4 md:px-0">
        {toastMsg && (
          <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
            {toastMsg}
          </div>
        )}
        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Content card */}
      <div className="mt-4 md:mt-6 px-4 md:px-0 pb-24 md:pb-0">
        <div className="rounded-lg bg-white md:bg-gray-50 border border-gray-200 md:border-0 p-3 md:p-5">
          {/* MOBILE: single column; DESKTOP: 2 columns if you prefer later */}
          <div className="space-y-5">
            {/* Lembrete */}
            <div>
              <label
                htmlFor="reminder_message"
                className="block text-sm font-medium text-gray-900"
              >
                Lembrete
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Use variáveis como <code className="bg-gray-100 px-1 rounded">{"{nome}"}</code>,{' '}
                <code className="bg-gray-100 px-1 rounded">{"{valor}"}</code> e{' '}
                <code className="bg-gray-100 px-1 rounded">{"{vencimento}"}</code>.
              </p>
              <div className="relative">
                <textarea
                  rows={5}
                  id="reminder_message"
                  name="reminder_message"
                  value={formData.reminder_message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reminder_message: e.target.value }))
                  }
                  placeholder="Olá {nome}, este é um lembrete do pagamento de {valor} com vencimento em {vencimento}."
                  className="
                    block w-full rounded-md border border-gray-300 bg-white
                    py-2 px-3 text-sm outline-none
                    focus:ring-2 focus:ring-purple-200 focus:border-purple-400
                  "
                />
                <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                  <span>{reminderCount}/{REMINDER_MAX}</span>
                  <span className="italic">Dica: mantenha curto e claro</span>
                </div>
              </div>
            </div>

            {/* Pagamento Atrasado */}
            <div>
              <label
                htmlFor="payment_overdue_message"
                className="block text-sm font-medium text-gray-900"
              >
                Pagamento Atrasado
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Ex.: <code className="bg-gray-100 px-1 rounded">“Seu pagamento de {`{valor}`} venceu em {`{vencimento}`}.”</code>
              </p>
              <div className="relative">
                <textarea
                  rows={5}
                  id="payment_overdue_message"
                  name="payment_overdue_message"
                  value={formData.payment_overdue_message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      payment_overdue_message: e.target.value,
                    }))
                  }
                  placeholder="Olá {nome}, identificamos um pagamento em atraso no valor de {valor}, com vencimento em {vencimento}. Por favor, regularize."
                  className="
                    block w-full rounded-md border border-gray-300 bg-white
                    py-2 px-3 text-sm outline-none
                    focus:ring-2 focus:ring-purple-200 focus:border-purple-400
                  "
                />
                <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                  <span>{overdueCount}/{OVERDUE_MAX}</span>
                  <span className="italic">Evite tons agressivos</span>
                </div>
              </div>
            </div>

            {/* Tiny helper box */}
            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
              <p className="text-xs text-gray-600">
                Variáveis suportadas:{' '}
                <code className="bg-white px-1 rounded border">{'{nome}'}</code>,{' '}
                <code className="bg-white px-1 rounded border">{'{valor}'}</code>,{' '}
                <code className="bg-white px-1 rounded border">{'{vencimento}'}</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop actions (keeps your existing FormActions) */}
        <div className="hidden md:block mt-4">
          <FormActions
            cancelText="Cancelar"
            onCancel={handleCancel}
            submitText={submitting ? 'Salvando...' : 'Salvar Mensagens'}
            onSubmit={() => {}}
          />
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div
        className="
          md:hidden
          fixed bottom-0 left-0 right-0
          bg-white border-t border-gray-200
          p-3
          flex items-center gap-2
        "
      >
        <button
          type="button"
          onClick={handleCancel}
          className="
            w-1/2 h-11 rounded-md border border-gray-300 bg-white
            text-sm font-medium text-gray-700
            active:bg-gray-100
          "
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || loading}
          className={`
            w-1/2 h-11 rounded-md
            text-sm font-semibold
            ${submitting || loading
              ? 'bg-purple-300 text-white'
              : 'bg-purple-600 text-white active:bg-purple-700'}
          `}
        >
          {submitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
