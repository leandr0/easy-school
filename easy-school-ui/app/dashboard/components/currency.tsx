import React, { useState, useEffect, useRef } from 'react';

interface BRLCurrencyProps {
  value: number | string | undefined | null;
  className?: string;
  showSymbol?: boolean;
  prefix?: string;
  suffix?: string;
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

  // Convert any value to number - handles both string and number inputs
  const parseValue = (val: number | string | undefined | null): number => {
    if (val === null || val === undefined || val === '') return 0;
    
    // If it's already a number, return it
    if (typeof val === 'number') return val;
    
    // Handle string values
    const str = String(val).trim();
    if (str === '' || str === '0') return 0;
    
    // Check if it's in US/database format (dot as decimal separator)
    if (str.includes('.') && !str.includes(',')) {
      // It's likely a database value like "77.7" - parse directly
      const result = parseFloat(str);
      return isNaN(result) ? 0 : result;
    }
    
    // Check if it's in Brazilian format (comma as decimal separator)
    if (str.includes(',')) {
      // Remove everything except digits and comma
      const cleaned = str.replace(/[^\d,]/g, '');
      if (cleaned === '') return 0;
      
      // Convert Brazilian format to JavaScript number
      const withDot = cleaned.replace(',', '.');
      const result = parseFloat(withDot);
      return isNaN(result) ? 0 : result;
    }
    
    // No decimal separator, just digits
    const cleaned = str.replace(/[^\d]/g, '');
    if (cleaned === '') return 0;
    
    const result = parseFloat(cleaned);
    return isNaN(result) ? 0 : result;
  };

  // Convert number to Brazilian input format (for display in input)
  const numberToInputFormat = (num: number): string => {
    if (num === 0) return '';
    
    // Use toFixed to ensure 2 decimal places, then replace dot with comma
    return num.toFixed(2).replace('.', ',');
  };

  // Format for display (non-input)
  const formatForDisplay = (amount: number): string => {
    if (showSymbol) {
      return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    console.log(`Input changed - rawValue: "${rawValue}"`);
    
    // Allow empty value
    if (rawValue === '') {
      setInputValue('');
      onChange?.(0);
      return;
    }
    
    // Remove everything except digits and comma
    let cleaned = rawValue.replace(/[^\d,]/g, '');
    console.log(`Cleaned: "${cleaned}"`);
    
    // Handle multiple commas - keep only the first one
    if (cleaned.includes(',')) {
      const parts = cleaned.split(',');
      if (parts.length > 2) {
        cleaned = parts[0] + ',' + parts.slice(1).join('');
      }
      // Limit decimal places to 2
      const commaIndex = cleaned.indexOf(',');
      if (cleaned.length > commaIndex + 3) {
        cleaned = cleaned.substring(0, commaIndex + 3);
      }
    }
    
    // Remove leading zeros (except before comma)
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0,')) {
      cleaned = cleaned.substring(1);
    }
    
    console.log(`Final cleaned: "${cleaned}"`);
    setInputValue(cleaned);
    
    // Convert to number and notify parent
    const numericValue = parseValue(cleaned);
    console.log(`Numeric value to send: ${numericValue}`);
    onChange?.(numericValue);
  };

  // Initialize input value from props only on mount or when external value changes significantly
  useEffect(() => {
    if (!asInput) return;
    
    console.log(`useEffect triggered - value: "${value}", isFocused: ${isFocused}, inputValue: "${inputValue}"`);
    
    // Only update when not focused to avoid interfering with user input
    if (!isFocused) {
      const numValue = parseValue(value);
      console.log(`Parsed numValue: ${numValue}`);
      
      const formattedValue = numberToInputFormat(numValue);
      console.log(`Formatted for input: "${formattedValue}"`);
      
      // Only update if the numeric values are actually different
      // This prevents the useEffect from running when the user is typing
      const currentNumValue = parseValue(inputValue);
      console.log(`Current input numeric value: ${currentNumValue}`);
      
      if (Math.abs(numValue - currentNumValue) > 0.001) {
        console.log(`Updating inputValue from "${inputValue}" to "${formattedValue}"`);
        setInputValue(formattedValue);
      } else {
        console.log(`No update needed - values are the same`);
      }
    }
  }, [value, isFocused]); // Removed inputValue from dependencies

  // Handle focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    // Format to ensure 2 decimal places on blur
    const numValue = parseValue(inputValue);
    const formattedValue = numberToInputFormat(numValue);
    console.log(`Blur - formatting "${inputValue}" (${numValue}) to "${formattedValue}"`);
    setInputValue(formattedValue);
    
    onBlur?.(e);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
    
    const isNumber = /[0-9]/.test(e.key);
    const isComma = e.key === ',';
    const hasComma = inputValue.includes(',');
    
    // Prevent multiple commas and non-numeric characters
    if (!isNumber && !(isComma && !hasComma) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  // Render as input
  if (asInput) {
    return (
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            {prefix}
          </span>
        )}
        
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={inputValue}
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
        
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    );
  }

  // Render as display
  const numericValue = parseValue(value);
  const formattedValue = formatForDisplay(numericValue);

  return (
    <span className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};

export default BRLCurrency;
export type { BRLCurrencyProps };