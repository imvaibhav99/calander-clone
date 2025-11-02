import { useUIStore } from '@/lib/store';
import { useCalendar } from '@/hooks/useCalendar';
import { getHoursArray, checkDate, formatDate } from '@/lib/dateUtils';
import EventBlock from '../WeekView/EventBlock';

export default function DayView() {
  const { selectedDate } = useUIStore();
  const { events } = useCalendar();
  
  const hours = getHoursArray();
  const dayEvents = events.filter((event: any) =>
    checkDate.isSameDay(new Date(event.start), selectedDate)
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day header */}
      <div className="border-b border-gray-200 bg-white p-6">
        <div className="text-3xl font-light text-gray-900">
          {formatDate.dayFull(selectedDate)}
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="flex">
          {/* Hour labels */}
          <div className="w-24 flex-shrink-0">
            {hours.map((hour) => (
              <div key={hour} className="h-[60px] border-b border-gray-200 pr-2 text-right">
                {hour > 0 && (
                  <span className="text-sm text-gray-500">
                    {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day column */}
          <div className="flex-1 relative border-l border-gray-200">
            {/* Hour lines */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              ></div>
            ))}

            {/* Events */}
            <div className="absolute inset-0 pointer-events-none px-2">
              {dayEvents.map((event: any) => (
                <EventBlock key={event._id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
