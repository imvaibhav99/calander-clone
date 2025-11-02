import CalendarShell from '@/components/CalendarShell';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <CalendarShell />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;
