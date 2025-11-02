import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isSameMonth,
  isSameDay,
  isToday,
  startOfDay,
  endOfDay,
  parseISO,
  setHours,
  setMinutes,
} from 'date-fns';

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Get calendar grid for month view (6 weeks x 7 days)
 */
export function getMonthCalendarDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

/**
 * Get week days for week view
 */
export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);

  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

/**
 * Navigation helpers
 */
export const navigate = {
  nextMonth: (date: Date) => addMonths(date, 1),
  prevMonth: (date: Date) => subMonths(date, 1),
  nextWeek: (date: Date) => addWeeks(date, 1),
  prevWeek: (date: Date) => subWeeks(date, 1),
  nextDay: (date: Date) => addDays(date, 1),
  prevDay: (date: Date) => subDays(date, 1),
  today: () => new Date(),
};

/**
 * Format helpers
 */
export const formatDate = {
  monthYear: (date: Date) => format(date, 'MMMM yyyy'),
  weekRange: (date: Date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  },
  dayFull: (date: Date) => format(date, 'EEEE, MMMM d, yyyy'),
  time: (date: Date) => format(date, 'h:mm a'),
  timeShort: (date: Date) => format(date, 'h a'),
  iso: (date: Date) => date.toISOString(),
};

/**
 * Check helpers
 */
export const checkDate = {
  isSameMonth,
  isSameDay,
  isToday,
};

/**
 * Create date at specific time
 */
export function createDateAtTime(date: Date, hour: number, minute: number = 0): Date {
  return setMinutes(setHours(date, hour), minute);
}

/**
 * Get hours array for day/week view
 */
export function getHoursArray(): number[] {
  return Array.from({ length: 24 }, (_, i) => i);
}

/**
 * Calculate event position and height in day/week view
 */
export function calculateEventPosition(
  start: Date,
  end: Date
): { top: number; height: number } {
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  const duration = endHour - startHour;

  const HOUR_HEIGHT = 60; // pixels per hour

  return {
    top: startHour * HOUR_HEIGHT,
    height: Math.max(duration * HOUR_HEIGHT, 30), // minimum height of 30px
  };
}

/**
 * Round time to nearest 15 minutes
 */
export function roundToNearest15(date: Date): Date {
  const minutes = date.getMinutes();
  const rounded = Math.round(minutes / 15) * 15;
  return setMinutes(date, rounded);
}

/**
 * Get date range for API queries
 */
export function getDateRange(
  date: Date,
  view: 'month' | 'week' | 'day'
): { start: Date; end: Date } {
  switch (view) {
    case 'month':
      return {
        start: startOfWeek(startOfMonth(date)),
        end: endOfWeek(endOfMonth(date)),
      };
    case 'week':
      return {
        start: startOfWeek(date),
        end: endOfWeek(date),
      };
    case 'day':
      return {
        start: startOfDay(date),
        end: endOfDay(date),
      };
  }
}
