'use client';
import React from 'react';
import InputMask from 'react-input-mask';

type MaskedNumberInputProps = {
  name: string;
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  mask: string;
  placeholder?: string;
  className?: string;
};

export default function MaskedNumberInput({
  name,
  id,
  value,
  onChange,
  min,
  max,
  mask,
  placeholder = "",
  className = "",
}: MaskedNumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseInt(e.target.value, 10);

    if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
      const padded = numericValue.toString().padStart(2, '0');
      onChange(padded);
    } else if (e.target.value === "") {
      onChange(""); // allow clearing
    }
  };

  return (
    <InputMask
      mask={mask}
      value={value}
      onChange={handleChange}
    >
      {(inputProps) => (
        <input
          {...inputProps}
          type="text"
          name={name}
          id={id || name}
          className={`peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 ${className}`}
          placeholder={placeholder}
        />
      )}
    </InputMask>
  );
}
