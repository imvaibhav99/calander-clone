import { useUIStore } from '@/lib/store';
import { useCalendar } from '@/hooks/useCalendar';
import { getMonthCalendarDays, WEEKDAYS, checkDate } from '@/lib/dateUtils';
import DayCell from './DayCell';

export default function MonthView() {
  const { selectedDate } = useUIStore();
  const { events } = useCalendar();
  
  const calendarDays = getMonthCalendarDays(selectedDate);

  // Group events by day
  const eventsByDay = events.reduce((acc: Record<string, any[]>, event: any) => {
    const eventDate = new Date(event.start);
    const dateKey = eventDate.toDateString();
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr border-l border-t border-gray-200 overflow-auto">
        {calendarDays.map((day) => {
          const dayEvents = eventsByDay[day.toDateString()] || [];
          const isCurrentMonth = checkDate.isSameMonth(day, selectedDate);
          const isToday = checkDate.isToday(day);

          return (
            <DayCell
              key={day.toISOString()}
              date={day}
              events={dayEvents}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
            />
          );
        })}
      </div>
    </div>
  );
}
