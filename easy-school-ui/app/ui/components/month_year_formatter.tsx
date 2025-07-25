import React from 'react';

interface MonthYearFormatterProps {
  month: number | undefined;
  year: number | undefined;
  locale?: string;
  className?: string;
}

export const MonthYearFormatter: React.FC<MonthYearFormatterProps> = ({ month, year, locale = 'en', className = "px-3 py-3 col-span-1" }) => {
  const formatMonthYear = (monthNum: number, yearNum: number, locale: string) => {
    try {
      // Create a date object with the given month and year
      const date = new Date(yearNum, monthNum - 1, 1);
      
      // Format the date to get abbreviated month name
      const monthName = date.toLocaleDateString(locale, { month: 'short' });
      
      // Get last 2 digits of year
      const shortYear = yearNum.toString().slice(-2);
      
      return `${monthName} ${shortYear}`;
    } catch (error) {
      // Fallback if formatting fails
      return `${monthNum}/${yearNum}`;
    }
  };

  // Handle undefined values
  if (month === undefined || year === undefined) {
    return (
      <div className={className}>
        <p className="truncate text-xs md:text-sm">--</p>
      </div>
    );
  }

  const formattedDate = formatMonthYear(month, year, locale);

  return (
    <div className={className}>
      <p className="truncate text-xs md:text-sm">{formattedDate}</p>
    </div>
  );
};