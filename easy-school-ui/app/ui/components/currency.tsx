import React, { useState, useEffect, useRef } from 'react';

interface BRLCurrencyProps {
  value: number | string | undefined | null;
  className?: string;
  showSymbol?: boolean;
  prefix?: string;
  suffix?: string;
  // Input-specific props
  asInput?: boolean;
  onChange?: (value: number) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  name?: string;
  id?: string;
  maxLength?: number;
  autoFocus?: boolean;
}

const BRLCurrency: React.FC<BRLCurrencyProps> = ({ 
  value, 
  className = '', 
  showSymbol = true,
  prefix = '',
  suffix = '',
  asInput = false,
  onChange,
  onBlur,
  onFocus,
  placeholder = 'R$ 0,00',
  disabled = false,
  readonly = false,
  name,
  id,
  maxLength,
  autoFocus = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert any value to number
  const parseValue = (val: number | string | undefined | null): number => {
    if (val === null || val === undefined || val === '') return 0;
    const numericValue = typeof val === 'string' ? parseFloat(val.replace(/[^\d,-]/g, '').replace(',', '.')) : val;
    return isNaN(numericValue) ? 0 : numericValue;
  };

  // Format number to Brazilian currency display
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Format number without currency symbol
  const formatNumber = (amount: number): string => {
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Format input value (less strict for better UX while typing)
  const formatInputValue = (val: string): string => {
    // Remove all non-numeric characters except comma and period
    let cleaned = val.replace(/[^\d,.]/g, '');
    
    // Replace periods with commas for consistency
    cleaned = cleaned.replace(/\./g, ',');
    
    // Only keep the last comma
    const parts = cleaned.split(',');
    if (parts.length > 2) {
      cleaned = parts[0] + ',' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + ',' + parts[1].substring(0, 2);
    }
    
    return cleaned;
  };

  // Update input value when prop value changes
  useEffect(() => {
    if (asInput && !isFocused) {
      const numValue = parseValue(value);
      setInputValue(numValue === 0 ? '' : formatNumber(numValue));
    }
  }, [value, asInput, isFocused]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatInputValue(rawValue);
    setInputValue(formatted);
    
    // Convert to number and call onChange
    if (onChange) {
      const numericValue = parseValue(formatted);
      onChange(numericValue);
    }
  };

  // Handle input focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    // Format the final value on blur
    const numValue = parseValue(inputValue);
    const formatted = numValue === 0 ? '' : formatNumber(numValue);
    setInputValue(formatted);
    
    onBlur?.(e);
  };

  // Handle key press (prevent invalid characters)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isNumber = /[0-9]/.test(e.key);
    const isComma = e.key === ',';
    const isAllowedKey = allowedKeys.includes(e.key);
    
    if (!isNumber && !isComma && !isAllowedKey) {
      e.preventDefault();
    }
  };

  // Render as input
  if (asInput) {
    return (
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">{prefix}</span>}
        
        <input
          ref={inputRef}
          type="text"
          value={showSymbol ? `R$ ${inputValue}` : inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readonly}
          name={name}
          id={id}
          maxLength={maxLength}
          autoFocus={autoFocus}
          className={`${className} ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
        />
        
        {suffix && <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">{suffix}</span>}
      </div>
    );
  }

  // Render as display (original functionality)
  const numericValue = parseValue(value);
  const formattedValue = showSymbol ? formatCurrency(numericValue) : formatNumber(numericValue);

  return (
    <span className={className}>
      {prefix}
      {showSymbol ? formattedValue : `R$ ${formattedValue}`}
      {suffix}
    </span>
  );
};

export default BRLCurrency;
export type { BRLCurrencyProps };