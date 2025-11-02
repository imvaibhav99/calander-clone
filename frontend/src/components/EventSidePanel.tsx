import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, Copy, Clock, MapPin, FileText } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useCalendar } from '@/hooks/useCalendar';
import { formatDate } from '@/lib/dateUtils';
import { format } from 'date-fns';

export default function EventSidePanel() {
  const { sidePanelOpen, closeSidePanel, selectedEvent, openEventModal, openConfirmDialog } =
    useUIStore();
  const { createEvent, isCreating } = useCalendar();

  if (!selectedEvent) return null;

  const handleEdit = () => {
    closeSidePanel();
    openEventModal(selectedEvent);
  };

  const handleDelete = () => {
    openConfirmDialog();
  };

  const handleDuplicate = () => {
    const duplicateData = {
      ...selectedEvent,
      title: `${selectedEvent.title} (Copy)`,
    };
    delete (duplicateData as any)._id;
    createEvent({
      title: duplicateData.title,
      description: duplicateData.description,
      start: new Date(duplicateData.start).toISOString(),
      end: new Date(duplicateData.end).toISOString(),
      allDay: duplicateData.allDay,
      color: duplicateData.color,
      location: duplicateData.location,
    });
    closeSidePanel();
  };

  const startDate = new Date(selectedEvent.start);
  const endDate = new Date(selectedEvent.end);

  const formatEventTime = () => {
    if (selectedEvent.allDay) {
      return format(startDate, 'EEEE, MMMM d, yyyy');
    }
    
    if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
      return `${format(startDate, 'EEEE, MMMM d, yyyy')} · ${format(
        startDate,
        'h:mm a'
      )} - ${format(endDate, 'h:mm a')}`;
    }
    
    return `${format(startDate, 'MMM d, h:mm a')} - ${format(endDate, 'MMM d, h:mm a')}`;
  };

  return (
    <AnimatePresence>
      {sidePanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidePanel}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-lg-soft z-50 overflow-y-auto"
          >
            {/* Header */}
            <div
              className="h-2 w-full"
              style={{ backgroundColor: selectedEvent.color }}
            />

            <div className="p-6">
              {/* Close button */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-normal text-gray-900 mb-2">
                    {selectedEvent.title}
                  </h2>
                  {selectedEvent.isRecurring && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Recurring Event
                    </span>
                  )}
                </div>
                <button
                  onClick={closeSidePanel}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Time */}
              <div className="flex items-start gap-4 mb-6">
                <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-900">{formatEventTime()}</p>
                </div>
              </div>

              {/* Location */}
              {selectedEvent.location && (
                <div className="flex items-start gap-4 mb-6">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedEvent.description && (
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5 text-gray-500" />
                  <span>Edit</span>
                </button>
                
                <button
                  onClick={handleDuplicate}
                  disabled={isCreating}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Copy className="w-5 h-5 text-gray-500" />
                  <span>Duplicate</span>
                </button>
                
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-gcred hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete</span>
                </button>
              </div>

              {/* Event metadata */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Event ID: {selectedEvent._id}</p>
                  {selectedEvent.parentEventId && (
                    <p>Part of recurring series: {selectedEvent.parentEventId}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}