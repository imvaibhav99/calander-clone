import { IEvent } from '../models/Event';
import { Event } from '../models/Event';
import { expandRecurringEvents, ExpandedEvent } from './recurrenceService';
import { Types } from 'mongoose';

export interface ConflictResult {
  hasConflict: boolean;
  conflicts: ExpandedEvent[];
}

/**
 * Checks if a new event conflicts with existing events
 */
export async function checkConflicts(
  userId: Types.ObjectId,
  start: Date,
  end: Date,
  excludeEventId?: string
): Promise<ConflictResult> {
  // Fetch all events for the user in the time range
  const query: any = {
    createdBy: userId,
    $or: [
      { start: { $lt: end }, end: { $gt: start } }, // Overlapping events
      {
        'recurrence.freq': { $ne: null },
        start: { $lte: end },
      }, // Recurring events that might overlap
    ],
  };

  if (excludeEventId) {
    query._id = { $ne: new Types.ObjectId(excludeEventId) };
  }

  const events = await Event.find(query);

  // Expand recurring events
  const expandedEvents = expandRecurringEvents(events, start, end);

  // Filter for actual conflicts
  const conflicts = expandedEvents.filter((event) => {
    if (excludeEventId && event.parentEventId === excludeEventId) {
      return false;
    }
    return eventsOverlap(start, end, event.start, event.end);
  });

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
}

/**
 * Checks if two time ranges overlap
 */
export function eventsOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && end1 > start2;
}

/**
 * Finds all conflicts for a specific event
 */
export async function findEventConflicts(event: IEvent): Promise<ExpandedEvent[]> {
  const result = await checkConflicts(
    event.createdBy,
    event.start,
    event.end,
    event._id.toString()
  );
  return result.conflicts;
}

/**
 * Validates that an event doesn't create conflicts (if validation is required)
 */
export async function validateNoConflicts(
  userId: Types.ObjectId,
  start: Date,
  end: Date,
  excludeEventId?: string
): Promise<void> {
  const result = await checkConflicts(userId, start, end, excludeEventId);
  
  if (result.hasConflict) {
    throw new Error(
      `Event conflicts with ${result.conflicts.length} existing event(s)`
    );
  }
}
