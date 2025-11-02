import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  checkEventConflicts,
} from '../controllers/eventsController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Event validation
const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('start').isISO8601().withMessage('Valid start date is required'),
  body('end').isISO8601().withMessage('Valid end date is required'),
  body('color').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
];

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', eventValidation, createEvent);
router.put('/:id', eventValidation, updateEvent);
router.delete('/:id', deleteEvent);
router.post('/conflicts', checkEventConflicts);

export default router;
