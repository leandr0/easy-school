'use client';

import React, { useState, useEffect } from 'react';

interface MaskedNumberInputProps {
  name: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  mask: string;
  placeholder: string;
  className?: string;
}

export default function MaskedNumberInput({
  name,
  id,
  value,
  onChange,
  min,
  max,
  mask,
  placeholder,
  className = '',
}: MaskedNumberInputProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Only allow digits
    inputValue = inputValue.replace(/\D/g, '');
    
    // Enforce maximum length based on mask
    if (inputValue.length > mask.length) {
      inputValue = inputValue.slice(0, mask.length);
    }
    
    // Update local state
    setDisplayValue(inputValue);
    
    // Validate min/max if there's a value
    if (inputValue !== '') {
      const numValue = parseInt(inputValue, 10);
      if (numValue < min) inputValue = min.toString();
      if (numValue > max) inputValue = max.toString();
    }
    
    // Call parent's onChange
    onChange(inputValue);
  };

  // Handle blur to ensure value is within bounds
  const handleBlur = () => {
    if (displayValue !== '') {
      let numValue = parseInt(displayValue, 10);
      if (numValue < min) {
        setDisplayValue(min.toString());
        onChange(min.toString());
      } else if (numValue > max) {
        setDisplayValue(max.toString());
        onChange(max.toString());
      }
    }
  };

  return (
    <input
      type="text"
      name={name}
      id={id}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`rounded-md border border-gray-200 p-2 text-center text-sm ${className}`}
      maxLength={mask.length}
    />
  );
}