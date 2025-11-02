import { useUIStore } from '@/lib/store';
import { useCalendar } from '@/hooks/useCalendar';
import { getWeekDays, getHoursArray, WEEKDAYS, checkDate, formatDate } from '@/lib/dateUtils';
import EventBlock from './EventBlock';

export default function WeekView() {
  const { selectedDate } = useUIStore();
  const { events } = useCalendar();
  
  const weekDays = getWeekDays(selectedDate);
  const hours = getHoursArray();

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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day headers */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="w-20 flex-shrink-0"></div>
        {weekDays.map((day) => {
          const isToday = checkDate.isToday(day);
          return (
            <div key={day.toISOString()} className="flex-1 text-center py-3 border-l border-gray-200">
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                {formatDate.iso(day).slice(0, 3)}
              </div>
              <div
                className={`text-2xl font-light inline-flex items-center justify-center w-10 h-10 rounded-full ${
                  isToday ? 'bg-gcblue text-white' : 'text-gray-900'
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="flex">
          {/* Hour labels */}
          <div className="w-20 flex-shrink-0">
            {hours.map((hour) => (
              <div key={hour} className="h-[60px] border-b border-gray-200 pr-2 text-right">
                {hour > 0 && (
                  <span className="text-xs text-gray-500">
                    {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => {
            const dayEvents = eventsByDay[day.toDateString()] || [];
            
            return (
              <div key={day.toISOString()} className="flex-1 relative border-l border-gray-200">
                {/* Hour lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  ></div>
                ))}

                {/* Events */}
                <div className="absolute inset-0 pointer-events-none">
                  {dayEvents.map((event) => (
                    <EventBlock key={event._id} event={event} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
