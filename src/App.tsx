// Third-party libraries
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { store, persistor } from './Store';
import RootRouter from './Routes/RootRouter';
import ErrorFallback from './Components/CustomComponents/ErrorFallback';

// Constants
import './I18n/config';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Assets/SCSS/main.scss';

// Styles
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

const baseName = import.meta.env.VITE_BASE_NAME;

function App() {
  // const [count, setCount] = useState<number>(0);
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback="...Loading">
        <ToastContainer />
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <HelmetProvider>
              <BrowserRouter basename={baseName}>
                <RootRouter />
              </BrowserRouter>
            </HelmetProvider>
          </PersistGate>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
