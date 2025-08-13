'use client';

interface TimeSelectorProps {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  onTimeChange: (field: string, value: string) => void;
  minuteStep?: number; // optional, default 1
}

export default function TimeSelector({
  startHour,
  startMinute,
  endHour,
  endMinute,
  onTimeChange,
  minuteStep = 1,
}: TimeSelectorProps) {
  const pad2 = (v: string | number) => String(v ?? '').padStart(2, '0');

  const startValue = `${pad2(startHour || '00')}:${pad2(startMinute || '00')}`;
  const endValue   = `${pad2(endHour || '00')}:${pad2(endMinute || '00')}`;

  const handleTime = (prefix: 'start' | 'end') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value || ''; // "HH:MM"
    const [hh = '00', mm = '00'] = raw.split(':');
    // Clamp to valid ranges just in case
    const H = Math.max(0, Math.min(23, parseInt(hh, 10) || 0));
    const M = Math.max(0, Math.min(59, parseInt(mm, 10) || 0));
    onTimeChange(`${prefix}_hour`, pad2(H));
    onTimeChange(`${prefix}_minute`, pad2(M));
  };

  return (
    <div>
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-2 gap-6 text-sm mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Início</label>
          <input
            type="time"
            step={minuteStep * 60}
            value={startValue}
            onChange={handleTime('start')}
            className="block w-36 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horário do término</label>
          <input
            type="time"
            step={minuteStep * 60}
            value={endValue}
            onChange={handleTime('end')}
            className="block w-36 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Início</label>
          <input
            type="time"
            step={minuteStep * 60}
            value={startValue}
            onChange={handleTime('start')}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horário do término</label>
          <input
            type="time"
            step={minuteStep * 60}
            value={endValue}
            onChange={handleTime('end')}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>
    </div>
  );
}
