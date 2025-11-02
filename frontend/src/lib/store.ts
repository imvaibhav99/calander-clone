import { create } from 'zustand';

export type ViewType = 'month' | 'week' | 'day';

interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color: string;
  allDay: boolean;
  location?: string;
  isRecurring?: boolean;
  parentEventId?: string;
}

interface UIState {
  // View state
  currentView: ViewType;
  selectedDate: Date;
  
  // Modal state
  eventModalOpen: boolean;
  sidePanelOpen: boolean;
  confirmDialogOpen: boolean;
  
  // Selected event
  selectedEvent: CalendarEvent | null;
  
  // Event form data
  eventFormData: Partial<CalendarEvent> | null;
  
  // Actions
  setView: (view: ViewType) => void;
  setDate: (date: Date) => void;
  
  openEventModal: (data?: Partial<CalendarEvent>) => void;
  closeEventModal: () => void;
  
  openSidePanel: (event: CalendarEvent) => void;
  closeSidePanel: () => void;
  
  openConfirmDialog: () => void;
  closeConfirmDialog: () => void;
  
  setSelectedEvent: (event: CalendarEvent | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  currentView: 'month',
  selectedDate: new Date(),
  eventModalOpen: false,
  sidePanelOpen: false,
  confirmDialogOpen: false,
  selectedEvent: null,
  eventFormData: null,
  
  // Actions
  setView: (view) => set({ currentView: view }),
  setDate: (date) => set({ selectedDate: date }),
  
  openEventModal: (data) =>
    set({ eventModalOpen: true, eventFormData: data || null }),
  closeEventModal: () =>
    set({ eventModalOpen: false, eventFormData: null }),
  
  openSidePanel: (event) =>
    set({ sidePanelOpen: true, selectedEvent: event }),
  closeSidePanel: () =>
    set({ sidePanelOpen: false, selectedEvent: null }),
  
  openConfirmDialog: () => set({ confirmDialogOpen: true }),
  closeConfirmDialog: () => set({ confirmDialogOpen: false }),
  
  setSelectedEvent: (event) => set({ selectedEvent: event }),
}));
