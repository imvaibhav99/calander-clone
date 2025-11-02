import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi, CreateEventData } from '@/lib/api';
import { formatDate, getDateRange } from '@/lib/dateUtils';
import { useUIStore } from '@/lib/store';
import toast from 'react-hot-toast';

export function useCalendar() {
  const queryClient = useQueryClient();
  const { selectedDate, currentView } = useUIStore();

  // Get date range for current view
  const { start, end } = getDateRange(selectedDate, currentView);

  // Fetch events
  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['events', formatDate.iso(start), formatDate.iso(end)],
    queryFn: () => eventsApi.getEvents(formatDate.iso(start), formatDate.iso(end)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create event
  const createMutation = useMutation({
    mutationFn: (data: CreateEventData) => eventsApi.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create event');
    },
  });

  // Update event
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventData> }) =>
      eventsApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update event');
    },
  });

  // Delete event
  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete event');
    },
  });

  const events = eventsData?.events || [];

  return {
    events,
    isLoading,
    error,
    createEvent: createMutation.mutate,
    updateEvent: updateMutation.mutate,
    deleteEvent: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
