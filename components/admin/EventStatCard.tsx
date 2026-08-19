'use client';

import { EVENT_COLORS, EVENT_SLOT_MAP, type EventName, type EventSlot, SLOT_COLORS } from '@/lib/constants/admin';

interface EventStatCardProps {
  event: EventName;
  count: number;
}

export function EventStatCard({ event, count }: EventStatCardProps) {
  const colorClass = EVENT_COLORS[event] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
  const slot = EVENT_SLOT_MAP[event] || 'Slot 1';
  const slotColor = SLOT_COLORS[slot as EventSlot] || SLOT_COLORS['Slot 1'];

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold font-rajdhani">{event}</p>
          <p className="text-xs opacity-70">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${slotColor}`}>
              {slot}
            </span>
          </p>
        </div>
        <span className="text-2xl font-bold font-orbitron">{count}</span>
      </div>
    </div>
  );
}