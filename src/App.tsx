import { Toaster } from 'react-hot-toast';
import ContextProvider from 'context';
import Routers from 'routes';

function App() {
  return (
    <ContextProvider>
      <div className="min-h-screen bg-gray-50">
        <Routers />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </div>
    </ContextProvider>
  );
}

export default App;
