'use client';
import React from 'react';

type TimeDisplayProps = {
  hour?: string | number;
  minute?: string | number;
};

export default function TimeDisplay({ hour, minute }: TimeDisplayProps) {
  const pad = (n: string | number = 0) => String(n).padStart(2, '0');

  return (
    <span>
      {pad(hour)} : {pad(minute)}
    </span>
  );
}
