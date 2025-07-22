'use client';

import MaskedNumberInput from "../input_mask";

interface TimeSelectorProps {
  startHour: string;
  startMinute: string;
  durationHour: string;
  durationMinute: string;
  onTimeChange: (field: string, value: string) => void;
}

export default function TimeSelector({
  startHour,
  startMinute,
  durationHour,
  durationMinute,
  onTimeChange
}: TimeSelectorProps) {
  // Function to add leading zero when needed
  const formatWithLeadingZero = (value: string): string => {
    // If empty, return empty
    if (!value) return value;
    
    // Parse as number and format with leading zero if less than 10
    const numValue = parseInt(value, 10);
    return numValue < 10 ? `0${numValue}` : String(numValue);
  };

  // Format all input values with leading zeros
  const formattedStartHour = formatWithLeadingZero(startHour);
  const formattedStartMinute = formatWithLeadingZero(startMinute);
  const formattedDurationHour = formatWithLeadingZero(durationHour);
  const formattedDurationMinute = formatWithLeadingZero(durationMinute);

  // Handle value change and formatting
  const handleChange = (field: string, value: string) => {
    // Pass the original input value to parent component
    // The formatting is only for display purposes
    onTimeChange(field, value);
  };

  return (
    <div>
      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 gap-6 text-sm mb-4">
          {/* Horário de Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horário de Início
            </label>
            <div className="flex gap-2">
              <MaskedNumberInput
                name="start_hour"
                id="start_hour"
                value={formattedStartHour}
                onChange={(val) => handleChange('start_hour', val)}
                min={0}
                max={23}
                mask="99"
                placeholder="HH"
                className="w-12"
              />
              <MaskedNumberInput
                name="start_minute"
                id="start_minute"
                value={formattedStartMinute}
                onChange={(val) => handleChange('start_minute', val)}
                min={0}
                max={59}
                mask="99"
                placeholder="MM"
                className="w-12"
              />
            </div>
          </div>

          {/* Duração */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração
            </label>
            <div className="flex gap-2">
              <MaskedNumberInput
                name="duration_hour"
                id="duration_hour"
                value={formattedDurationHour}
                onChange={(val) => handleChange('duration_hour', val)}
                min={1}
                max={2}
                mask="99"
                placeholder="DH"
                className="w-12"
              />
              <MaskedNumberInput
                name="duration_minute"
                id="duration_minute"
                value={formattedDurationMinute}
                onChange={(val) => handleChange('duration_minute', val)}
                min={0}
                max={59}
                mask="99"
                placeholder="DM"
                className="w-12"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Horário de Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horário de Início
            </label>
            <div className="flex gap-2">
              <MaskedNumberInput
                name="start_hour_mobile"
                id="start_hour_mobile"
                value={formattedStartHour}
                onChange={(val) => handleChange('start_hour', val)}
                min={0}
                max={23}
                mask="99"
                placeholder="HH"
                className="w-12"
              />
              <MaskedNumberInput
                name="start_minute_mobile"
                id="start_minute_mobile"
                value={formattedStartMinute}
                onChange={(val) => handleChange('start_minute', val)}
                min={0}
                max={59}
                mask="99"
                placeholder="MM"
                className="w-12"
              />
            </div>
          </div>

          {/* Duração */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração
            </label>
            <div className="flex gap-2">
              <MaskedNumberInput
                name="duration_hour_mobile"
                id="duration_hour_mobile"
                value={formattedDurationHour}
                onChange={(val) => handleChange('duration_hour', val)}
                min={1}
                max={2}
                mask="99"
                placeholder="DH"
                className="w-12"
              />
              <MaskedNumberInput
                name="duration_minute_mobile"
                id="duration_minute_mobile"
                value={formattedDurationMinute}
                onChange={(val) => handleChange('duration_minute', val)}
                min={0}
                max={59}
                mask="99"
                placeholder="DM"
                className="w-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}