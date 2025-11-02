import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './pages/App';
import { initializeSocket, disconnectSocket } from './lib/socket';
import './styles/tailwind.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AppWrapper() {
  useEffect(() => {
    // Initialize socket connection for real-time updates
    const token = localStorage.getItem('token');
    if (token) {
      try {
        initializeSocket(queryClient);
        console.log('Socket initialized');
      } catch (error) {
        console.error('Failed to initialize socket:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppWrapper />
    </QueryClientProvider>
  </React.StrictMode>
);