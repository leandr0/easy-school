import React, { useState, useEffect } from 'react';

export default function DateInput(props:any) {
  const { value, onChange, name, className } = props;
  
  // State to hold the displayed value (DD/MM/YYYY)
  const [displayValue, setDisplayValue] = useState('');
  
  // Initialize display value from the stored ISO date string
  useEffect(() => {
    if (value) {
      // If we have a date value in ISO format, convert it to DD/MM/YYYY for display
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          setDisplayValue(`${day}/${month}/${year}`);
        }
      } catch (error) {
        // If conversion fails, just show the raw value
        setDisplayValue(value);
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Handle input changes and apply formatting
  const handleInputChange = (e:any) => {
    let input = e.target.value;
    
    // Remove any non-digit characters
    input = input.replace(/\D/g, '');
    
    // Apply formatting as user types (DD/MM/YYYY)
    let formatted = '';
    if (input.length > 0) {
      formatted = input.substring(0, 2);
    }
    if (input.length > 2) {
      formatted += '/' + input.substring(2, 4);
    }
    if (input.length > 4) {
      formatted += '/' + input.substring(4, 8);
    }
    
    setDisplayValue(formatted);
    
    // Convert DD/MM/YYYY to YYYY-MM-DDT00:00:00 for data storage
    if (input.length === 8) {
      const day = input.substring(0, 2);
      const month = input.substring(2, 4);
      const year = input.substring(4, 8);
      
      // Create ISO date string
      const isoDate = `${year}-${month}-${day}T00:00:00`;
      
      // Call the parent's onChange handler with the new value
      onChange({ 
        target: { 
          name, 
          value: isoDate
        } 
      });
    } else if (input.length < 8 && value) {
      // If the input is incomplete but we had a previous value, clear it
      onChange({
        target: {
          name,
          value: ''
        }
      });
    }
  };

  return (
    <input
      type="text"
      name={name}
      value={displayValue}
      onChange={handleInputChange}
      placeholder="DD/MM/YYYY"
      maxLength={10}
      className={className}
    />
  );
}