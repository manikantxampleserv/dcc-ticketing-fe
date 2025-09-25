import { Toaster } from 'react-hot-toast';
import ContextProvider from 'context';
import Routers from 'routes';
import 'react-quill/dist/quill.snow.css';
import 'quill-mention';

function App() {
  return (
    <ContextProvider>
      <div className="min-h-screen bg-gray-50">
        <Routers />
        <Toaster position="top-right" toastOptions={{ duration: 10000 }} />
      </div>
    </ContextProvider>
  );
}

export default App;
