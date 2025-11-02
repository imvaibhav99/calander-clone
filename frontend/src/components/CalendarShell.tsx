import { useEffect } from 'react';
import { useUIStore } from '@/lib/store';
import { useCalendar } from '@/hooks/useCalendar';
import Toolbar from './Toolbar';
import MonthView from './MonthView/MonthView';
import WeekView from './WeekView/WeekView';
import DayView from './DayView/DayView';
import EventModal from './EventModal';
import EventSidePanel from './EventSidePanel';
import ConfirmDialog from './ConfirmDialog';

export default function CalendarShell() {
  const { currentView } = useUIStore();
  const { isLoading } = useCalendar();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextArea) {
        return;
      }

      const { setView, openEventModal, setDate } = useUIStore.getState();

      switch (e.key.toLowerCase()) {
        case 'n':
          openEventModal();
          break;
        case 'm':
          setView('month');
          break;
        case 'w':
          setView('week');
          break;
        case 'd':
          setView('day');
          break;
        case 't':
          setDate(new Date());
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Toolbar />
      
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading calendar...</div>
          </div>
        ) : (
          <>
            {currentView === 'month' && <MonthView />}
            {currentView === 'week' && <WeekView />}
            {currentView === 'day' && <DayView />}
          </>
        )}
      </div>

      <EventModal />
      <EventSidePanel />
      <ConfirmDialog />
    </div>
  );
}