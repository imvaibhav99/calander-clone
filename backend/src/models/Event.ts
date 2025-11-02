import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRecurrence {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null;
  interval: number;
  byWeekday?: number[];
  count?: number;
  until?: Date;
}

export interface IEvent extends Document {
  title: string;
  description?: string;
  color: string;
  location?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  recurrence?: IRecurrence;
  exceptions: Date[];
  createdBy: Types.ObjectId;
  calendarId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const recurrenceSchema = new Schema<IRecurrence>(
  {
    freq: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'MONTHLY', null],
      default: null,
    },
    interval: {
      type: Number,
      default: 1,
      min: 1,
    },
    byWeekday: [Number],
    count: Number,
    until: Date,
  },
  { _id: false }
);

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: '#1a73e8',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'],
    },
    location: {
      type: String,
      trim: true,
    },
    start: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    end: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (this: IEvent, value: Date) {
          return value > this.start;
        },
        message: 'End date must be after start date',
      },
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    recurrence: recurrenceSchema,
    exceptions: {
      type: [Date],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    calendarId: {
      type: Schema.Types.ObjectId,
      ref: 'Calendar',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
eventSchema.index({ start: 1, end: 1 });
eventSchema.index({ createdBy: 1 });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
