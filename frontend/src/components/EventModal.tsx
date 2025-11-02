import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Repeat, Palette } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useCalendar } from '@/hooks/useCalendar';

const COLORS = [
  { name: 'Blue', value: '#1a73e8' },
  { name: 'Red', value: '#ea4335' },
  { name: 'Green', value: '#34a853' },
  { name: 'Yellow', value: '#fbbc04' },
  { name: 'Purple', value: '#9334e8' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Teal', value: '#14b8a6' },
];

const RECURRENCE_OPTIONS = [
  { label: 'Does not repeat', value: null },
  { label: 'Daily', value: 'DAILY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' },
];

interface FormData {
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  color: string;
  location: string;
  recurrence: {
    freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null;
    interval: number;
  } | null;
}

export default function EventModal() {
  const { eventModalOpen, closeEventModal, eventFormData, selectedEvent } = useUIStore();
  const { createEvent, updateEvent, isCreating, isUpdating } = useCalendar();

  const isEditMode = !!selectedEvent;

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    color: '#1a73e8',
    location: '',
    recurrence: null,
  });

  useEffect(() => {
    if (eventFormData) {
      const start = eventFormData.start || new Date();
      const end = eventFormData.end || new Date(start.getTime() + 60 * 60 * 1000);
      
      setFormData({
        title: eventFormData.title || '',
        description: eventFormData.description || '',
        start: new Date(start).toISOString().slice(0, 16),
        end: new Date(end).toISOString().slice(0, 16),
        allDay: eventFormData.allDay || false,
        color: eventFormData.color || '#1a73e8',
        location: eventFormData.location || '',
        recurrence: null,
      });
    } else if (selectedEvent) {
      setFormData({
        title: selectedEvent.title,
        description: selectedEvent.description || '',
        start: new Date(selectedEvent.start).toISOString().slice(0, 16),
        end: new Date(selectedEvent.end).toISOString().slice(0, 16),
        allDay: selectedEvent.allDay,
        color: selectedEvent.color,
        location: selectedEvent.location || '',
        recurrence: null,
      });
    }
  }, [eventFormData, selectedEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eventData: any = {
      title: formData.title,
      description: formData.description,
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString(),
      allDay: formData.allDay,
      color: formData.color,
      location: formData.location,
      recurrence: formData.recurrence,
    };

    if (isEditMode && selectedEvent) {
      updateEvent({ id: selectedEvent._id, data: eventData });
    } else {
      createEvent(eventData);
    }

    closeEventModal();
  };

  const handleClose = () => {
    closeEventModal();
    setFormData({
      title: '',
      description: '',
      start: '',
      end: '',
      allDay: false,
      color: '#1a73e8',
      location: '',
      recurrence: null,
    });
  };

  return (
    <AnimatePresence>
      {eventModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-lg shadow-lg-soft w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-normal text-gray-900">
                  {isEditMode ? 'Edit Event' : 'New Event'}
                </h2>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Add title"
                    className="w-full text-2xl font-normal border-b-2 border-gray-300 focus:border-gcblue outline-none pb-2 transition-colors"
                    required
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allDay}
                      onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-gcblue focus:ring-gcblue"
                    />
                    <span className="text-sm text-gray-700">All day</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                    <input
                      type={formData.allDay ? 'date' : 'datetime-local'}
                      value={formData.allDay ? formData.start.slice(0, 10) : formData.start}
                      onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                    <input
                      type={formData.allDay ? 'date' : 'datetime-local'}
                      value={formData.allDay ? formData.end.slice(0, 10) : formData.end}
                      onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Repeat className="w-5 h-5 text-gray-500 mt-2" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
                    <select
                      value={formData.recurrence?.freq || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recurrence: e.target.value ? { freq: e.target.value as any, interval: 1 } : null,
                        })
                      }
                      className="input"
                    >
                      {RECURRENCE_OPTIONS.map((option) => (
                        <option key={option.label} value={option.value || ''}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-2" />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Add location"
                      className="input"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Palette className="w-5 h-5 text-gray-500 mt-2" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: color.value })}
                          className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                            formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add description"
                    rows={4}
                    className="input resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="px-6 py-2 bg-gcblue text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating || isUpdating ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}