import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { formatDate, navigate } from '@/lib/dateUtils';

export default function Toolbar() {
  const { currentView, selectedDate, setView, setDate, openEventModal } = useUIStore();

  const handlePrev = () => {
    switch (currentView) {
      case 'month':
        setDate(navigate.prevMonth(selectedDate));
        break;
      case 'week':
        setDate(navigate.prevWeek(selectedDate));
        break;
      case 'day':
        setDate(navigate.prevDay(selectedDate));
        break;
    }
  };

  const handleNext = () => {
    switch (currentView) {
      case 'month':
        setDate(navigate.nextMonth(selectedDate));
        break;
      case 'week':
        setDate(navigate.nextWeek(selectedDate));
        break;
      case 'day':
        setDate(navigate.nextDay(selectedDate));
        break;
    }
  };

  const handleToday = () => {
    setDate(navigate.today());
  };

  const getDateLabel = () => {
    switch (currentView) {
      case 'month':
        return formatDate.monthYear(selectedDate);
      case 'week':
        return formatDate.weekRange(selectedDate);
      case 'day':
        return formatDate.dayFull(selectedDate);
    }
  };

  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-normal text-gray-700">Calendar</h1>
          
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Today
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <h2 className="text-xl font-normal text-gray-900 min-w-[300px]">
            {getDateLabel()}
          </h2>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-md p-1">
            {(['month', 'week', 'day'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setView(view)}
                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors capitalize ${
                  currentView === view
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <button
            onClick={() => openEventModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gcblue text-white rounded-full hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create</span>
          </button>
        </div>
      </div>
    </div>
  );
}
