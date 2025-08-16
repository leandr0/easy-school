import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function RevenueStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          
          'bg-red-500 text-white': status === 'OVERDUE',
          'bg-green-500 text-white': status === 'OK',
          'bg-yellow-500 text-white': status === 'OPEN',
        },
      )}
    >
 
      {status === 'OK' ? (
        <>
          OK
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'OVERDUE' ? (
        <>
          OVERDUE 
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'OPEN' ? (
        <>
          OPEN
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
