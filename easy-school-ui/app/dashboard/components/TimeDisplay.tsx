'use client';

interface TimeDisplayProps {
  hour: number | undefined;
  minute: number | undefined;
}

export default function TimeDisplay({ hour, minute }: TimeDisplayProps) {
  if (hour === undefined || minute === undefined) {
    return <span>--:--</span>;
  }

  // Format hour and minute to always have 2 digits
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');

  return (
    <span className="font-mono">{`${formattedHour}:${formattedMinute}`}</span>
  );
}