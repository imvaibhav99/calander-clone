import { addDays, addWeeks, addMonths, isAfter, isBefore, startOfDay } from 'date-fns';
import { IEvent, IRecurrence } from '../models/Event';

export interface ExpandedEvent {
  _id: string;
  title: string;
  description?: string;
  color: string;
  location?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  isRecurring: boolean;
  parentEventId?: string;
  createdBy: string;
}

/**
 * Expands recurring events within a given date range
 */
export function expandRecurringEvents(
  events: IEvent[],
  rangeStart: Date,
  rangeEnd: Date
): ExpandedEvent[] {
  const expanded: ExpandedEvent[] = [];

  events.forEach((event) => {
    if (!event.recurrence || !event.recurrence.freq) {
      // Non-recurring event
      expanded.push({
        _id: event._id.toString(),
        title: event.title,
        description: event.description,
        color: event.color,
        location: event.location,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        isRecurring: false,
        createdBy: event.createdBy.toString(),
      });
      return;
    }

    // Expand recurring event
    const occurrences = generateOccurrences(
      event,
      event.recurrence,
      rangeStart,
      rangeEnd
    );

    occurrences.forEach((occurrence) => {
      expanded.push({
        _id: `${event._id.toString()}_${occurrence.start.getTime()}`,
        title: event.title,
        description: event.description,
        color: event.color,
        location: event.location,
        start: occurrence.start,
        end: occurrence.end,
        allDay: event.allDay,
        isRecurring: true,
        parentEventId: event._id.toString(),
        createdBy: event.createdBy.toString(),
      });
    });
  });

  return expanded;
}

/**
 * Generates occurrences for a recurring event
 */
function generateOccurrences(
  event: IEvent,
  recurrence: IRecurrence,
  rangeStart: Date,
  rangeEnd: Date
): { start: Date; end: Date }[] {
  const occurrences: { start: Date; end: Date }[] = [];
  const duration = event.end.getTime() - event.start.getTime();
  
  let currentStart = new Date(event.start);
  let count = 0;
  const maxCount = recurrence.count || 365; // Prevent infinite loops
  const until = recurrence.until || rangeEnd;

  while (
    (isBefore(currentStart, rangeEnd) || currentStart.getTime() === rangeEnd.getTime()) &&
    count < maxCount &&
    (isBefore(currentStart, until) || currentStart.getTime() === until.getTime())
  ) {
    // Check if this occurrence is within range and not in exceptions
    if (
      (isAfter(currentStart, rangeStart) || currentStart.getTime() === rangeStart.getTime()) &&
      !isException(currentStart, event.exceptions)
    ) {
      const currentEnd = new Date(currentStart.getTime() + duration);
      
      // Filter by weekday if specified
      if (recurrence.byWeekday && recurrence.byWeekday.length > 0) {
        const dayOfWeek = currentStart.getDay();
        if (recurrence.byWeekday.includes(dayOfWeek)) {
          occurrences.push({
            start: new Date(currentStart),
            end: currentEnd,
          });
        }
      } else {
        occurrences.push({
          start: new Date(currentStart),
          end: currentEnd,
        });
      }
    }

    // Move to next occurrence
    switch (recurrence.freq) {
      case 'DAILY':
        currentStart = addDays(currentStart, recurrence.interval || 1);
        break;
      case 'WEEKLY':
        currentStart = addWeeks(currentStart, recurrence.interval || 1);
        break;
      case 'MONTHLY':
        currentStart = addMonths(currentStart, recurrence.interval || 1);
        break;
    }

    count++;
  }

  return occurrences;
}

/**
 * Checks if a date is in the exceptions list
 */
function isException(date: Date, exceptions: Date[]): boolean {
  const dateStr = startOfDay(date).getTime();
  return exceptions.some((ex) => startOfDay(new Date(ex)).getTime() === dateStr);
}

/**
 * Adds an exception to a recurring event
 */
export function addException(event: IEvent, exceptionDate: Date): Date[] {
  const exceptions = [...event.exceptions];
  const dateToAdd = startOfDay(exceptionDate);
  
  if (!exceptions.some((ex) => startOfDay(new Date(ex)).getTime() === dateToAdd.getTime())) {
    exceptions.push(dateToAdd);
  }
  
  return exceptions;
}
