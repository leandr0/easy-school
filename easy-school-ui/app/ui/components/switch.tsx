import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'purple';
  disabled?: boolean;
}

export function Switch({
  checked,
  onChange,
  label,
  size = 'md',
  color = 'green',
  disabled = false,
}: SwitchProps) {
  // Size classes based on switch size
  const sizeClasses = {
    sm: {
      switch: 'h-5 w-9',
      thumb: 'h-3 w-3',
      thumbOn: 'translate-x-4',
      thumbOff: 'translate-x-1',
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-4 w-4',
      thumbOn: 'translate-x-6',
      thumbOff: 'translate-x-1',
    },
    lg: {
      switch: 'h-7 w-14',
      thumb: 'h-5 w-5',
      thumbOn: 'translate-x-8',
      thumbOff: 'translate-x-1',
    },
  };

  // Color classes based on selected color
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            onChange(!checked);
          }
        }}
        disabled={disabled}
        className={`relative inline-flex ${sizeClasses[size].switch} items-center rounded-full transition-colors 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500
          ${checked ? colorClasses[color] : 'bg-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-checked={checked}
        role="switch"
      >
        <span className="sr-only">{label || (checked ? 'Enabled' : 'Disabled')}</span>
        <span
          className={`inline-block ${sizeClasses[size].thumb} transform rounded-full bg-white 
            transition-transform duration-200 ease-in-out
            ${checked ? sizeClasses[size].thumbOn : sizeClasses[size].thumbOff}`}
        />
      </button>
      {label && (
        <span className={`text-sm font-medium text-gray-900 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
    </div>
  );
}