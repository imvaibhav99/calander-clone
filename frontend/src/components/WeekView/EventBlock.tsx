import { motion } from 'framer-motion';
import { useUIStore } from '@/lib/store';
import { calculateEventPosition, formatDate } from '@/lib/dateUtils';

interface EventBlockProps {
  event: any;
}

export default function EventBlock({ event }: EventBlockProps) {
  const { openSidePanel } = useUIStore();
  
  const start = new Date(event.start);
  const end = new Date(event.end);
  const { top, height } = calculateEventPosition(start, end);

  const handleClick = () => {
    openSidePanel(event);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="absolute left-1 right-1 rounded-md cursor-pointer shadow-sm pointer-events-auto overflow-hidden"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: event.color,
        minHeight: '30px',
      }}
    >
      <div className="p-1.5 h-full overflow-hidden">
        <div className="text-xs font-semibold text-white truncate">
          {event.title}
        </div>
        <div className="text-xs text-white opacity-90">
          {formatDate.time(start)}
        </div>
      </div>
    </motion.div>
  );
}
