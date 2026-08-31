// components/PhoneNumberField.tsx
'use client';

import React from 'react';

type Mode = 'edit' | 'display';

export type PhoneNumberFieldProps = {
  mode?: Mode;                     // 'edit' (default) | 'display'
  label?: string;                  // Optional label
  value?: string;                  // Controlled value (formatted or digits; component will reformat)
  defaultValue?: string;           // Uncontrolled initial value
  onChange?: (formatted: string, digits: string) => void;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;              // Read-only input (still renders input if mode='edit')
  placeholder?: string;            // Defaults to "(11) 99999-9999"
  className?: string;              // Tailwind classes for the input/span
  error?: string;                  // Optional error message
};

/** Keep only digits (max 11: 2 DDD + 9 local) */
export function onlyDigits(v: string): string {
  return (v || '').replace(/\D/g, '').slice(0, 11);
}

/** Format BR phone: (11) 99999-9999 or (11) 2345-6789 */
export function formatBRPhone(v: string): string {
  const digits = onlyDigits(v);
  const ddd = digits.slice(0, 2);
  const local = digits.slice(2);

  if (!ddd) return '';
  if (local.length <= 4) return `(${ddd}) ${local}`;
  if (local.length <= 8) return `(${ddd}) ${local.slice(0, 4)}-${local.slice(4)}`; // landline path (4+4)
  // mobile path (5+4)
  return `(${ddd}) ${local.slice(0, 5)}-${local.slice(5, 9)}`;
}

/** Accept (11) 99999-9999 or (11) 2345-6789; DDD 11..99 */
export const BR_PHONE_PATTERN = /^\([1-9]{2}\)\s\d{4,5}-\d{4}$/;

export default function PhoneNumberField({
  mode = 'edit',
  label = 'Telefone',
  value,
  defaultValue,
  onChange,
  name = 'phone_number',
  id,
  required,
  disabled,
  readOnly,
  placeholder = '(11) 99999-9999',
  className = 'mt-1 w-full rounded-md border px-3 py-2',
  error,
}: PhoneNumberFieldProps) {
  const inputId = id || name;

  // Internal state only when uncontrolled
  const [inner, setInner] = React.useState<string>(() =>
    formatBRPhone(value ?? defaultValue ?? '')
  );

  // Sync when parent controls value
  React.useEffect(() => {
    if (value !== undefined) setInner(formatBRPhone(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBRPhone(e.target.value);
    const digits = onlyDigits(e.target.value);

    // Uncontrolled: update internal state
    if (value === undefined) setInner(formatted);

    // Notify parent (give formatted and raw digits)
    onChange?.(formatted, digits);
  };

  // DISPLAY MODE (read-only span, nice formatting)
  if (mode === 'display') {
    const formatted = formatBRPhone(value ?? inner);
    return (
      <div className="flex flex-col">
        {label && (
          <label className="block text-sm font-medium text-gray-700">{label}</label>
        )}
        <span
          className={className}
          aria-label={label}
        >
          {formatted || '—'}
        </span>
      </div>
    );
  }

  // EDIT MODE (input)
  const formatted = formatBRPhone(value ?? inner);

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder={placeholder}
        className={`${className} ${error ? 'border-red-500' : ''}`}
        value={formatted}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        pattern={BR_PHONE_PATTERN.source}
        minLength={15}
        maxLength={15} // (11) 99999-9999 = 15 chars; landline fits too due to mask logic
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}