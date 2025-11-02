import { Response } from 'express';
import { Event } from '../models/Event';
import { AuthRequest } from '../middleware/auth';
import { expandRecurringEvents } from '../services/recurrenceService';
import { checkConflicts } from '../services/conflictService';
import { startOfMonth, endOfMonth, parseISO } from 'date-fns';

/**
 * Get events within a date range
 */
export async function getEvents(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      res.status(400).json({ error: 'Start and end dates are required' });
      return;
    }

    const startDate = parseISO(start as string);
    const endDate = parseISO(end as string);

    // Fetch events that overlap with the range or are recurring
    const events = await Event.find({
      createdBy: req.userId,
      $or: [
        { start: { $lte: endDate }, end: { $gte: startDate } },
        { 'recurrence.freq': { $ne: null } },
      ],
    }).sort({ start: 1 });

    // Expand recurring events
    const expandedEvents = expandRecurringEvents(events, startDate, endDate);

    res.json({ events: expandedEvents });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch events' });
  }
}

/**
 * Get a single event by ID
 */
export async function getEventById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json({ event });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch event' });
  }
}

/**
 * Create a new event
 */
export async function createEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.userId,
    };

    const event = await Event.create(eventData);

    res.status(201).json({ event });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create event' });
  }
}

/**
 * Update an event
 */
export async function updateEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json({ event });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update event' });
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete event' });
  }
}

/**
 * Check for conflicts
 */
export async function checkEventConflicts(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { start, end, excludeEventId } = req.body;

    if (!start || !end) {
      res.status(400).json({ error: 'Start and end dates are required' });
      return;
    }

    const result = await checkConflicts(
      req.userId!,
      new Date(start),
      new Date(end),
      excludeEventId
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to check conflicts' });
  }
}
