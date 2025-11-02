import { motion } from 'framer-motion';
import { useUIStore } from '@/lib/store';
import { format } from 'date-fns';
import { createDateAtTime } from '@/lib/dateUtils';

interface DayCellProps {
  date: Date;
  events: any[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function DayCell({ date, events, isCurrentMonth, isToday }: DayCellProps) {
  const { openEventModal, openSidePanel } = useUIStore();
  
  const maxVisibleEvents = 3;
  const visibleEvents = events.slice(0, maxVisibleEvents);
  const remainingCount = events.length - maxVisibleEvents;

  const handleCellClick = () => {
    // Open event modal with pre-filled date
    openEventModal({
      start: createDateAtTime(date, 9, 0),
      end: createDateAtTime(date, 10, 0),
    } as any);
  };

  const handleEventClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    openSidePanel(event);
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
      onClick={handleCellClick}
      className={`min-h-[120px] border-r border-b border-gray-200 p-2 cursor-pointer transition-colors ${
        !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
      }`}
    >
      <div className="flex justify-end mb-1">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
            isToday
              ? 'bg-gcblue text-white font-semibold'
              : isCurrentMonth
              ? 'text-gray-900'
              : 'text-gray-400'
          }`}
        >
          {format(date, 'd')}
        </div>
      </div>

      <div className="space-y-1">
        {visibleEvents.map((event) => (
          <motion.div
            key={event._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleEventClick(e, event)}
            className="px-2 py-1 text-xs rounded truncate cursor-pointer"
            style={{ backgroundColor: `${event.color}20`, color: event.color }}
          >
            <div className="font-medium truncate">{event.title}</div>
          </motion.div>
        ))}
        
        {remainingCount > 0 && (
          <div className="text-xs text-gray-500 pl-2">
            +{remainingCount} more
          </div>
        )}
      </div>
    </motion.div>
  );
}
