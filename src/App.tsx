import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { store, persistor } from './Store';
import RootRouter from './Routes/RootRouter';
import './App.css';
import ErrorFallback from './Components/CustomComponents/ErrorFallback';
import './I18n/config';
import { SnackbarProvider } from 'notistack';
const baseName = import.meta.env.VITE_BASE_NAME;

function App() {
  // const [count, setCount] = useState<number>(0);
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback="...Loading">
      <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <HelmetProvider>
              <BrowserRouter basename={baseName}>
                <RootRouter />
              </BrowserRouter>
            </HelmetProvider>
          </PersistGate>
        </Provider>
        </SnackbarProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
