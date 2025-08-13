import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, className,variant = 'primary', ...rest }: ButtonProps) {
  const baseClasses =
    'flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';

  const variantClasses = {
    primary:
      'bg-purple-400 text-white hover:bg-purple-500 focus-visible:outline-blue-500 active:bg-blue-600',
    secondary:
      'bg-gray-100 text-gray-600 hover:bg-gray-200 focus-visible:outline-gray-400',
  };
    return (
    <button {...rest} className={clsx(baseClasses, variantClasses[variant], className)}>
      {children}
    </button>
  );
}


export function CancelButton({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200',
        className,
      )}
    >
      {children}
    </button>
  );
}