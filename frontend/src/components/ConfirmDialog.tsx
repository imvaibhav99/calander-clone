import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useCalendar } from '@/hooks/useCalendar';

export default function ConfirmDialog() {
  const { confirmDialogOpen, closeConfirmDialog, selectedEvent, closeSidePanel } = useUIStore();
  const { deleteEvent, isDeleting } = useCalendar();

  if (!selectedEvent) return null;

  const handleDelete = () => {
    deleteEvent(selectedEvent._id);
    closeConfirmDialog();
    closeSidePanel();
  };

  const handleCancel = () => {
    closeConfirmDialog();
  };

  return (
    <AnimatePresence>
      {confirmDialogOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-black/50 z-[60]"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-lg shadow-lg-soft w-full max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-gcred" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                  Delete Event
                </h3>

                {/* Message */}
                <p className="text-sm text-center text-gray-600 mb-6">
                  {selectedEvent.isRecurring ? (
                    <>
                      This is a recurring event. Would you like to delete just this occurrence
                      or the entire series?
                      <br />
                      <br />
                      <span className="font-medium">
                        Note: Currently only single event deletion is supported.
                      </span>
                    </>
                  ) : (
                    <>
                      Are you sure you want to delete "<strong>{selectedEvent.title}</strong>"?
                      This action cannot be undone.
                    </>
                  )}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 text-white bg-gcred hover:bg-red-600 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>

                {/* Recurring event options (placeholder for future enhancement) */}
                {selectedEvent.isRecurring && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      Future enhancement: Options to delete this event, this and following events,
                      or all events in the series will be available soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}