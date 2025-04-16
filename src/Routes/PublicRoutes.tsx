import { Navigate } from 'react-router-dom';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';
import Home from '../Pages/Home';
import InvoiceListPage from '../Pages/InvoiceListPage';
import EditPage from '../Pages/EditPage';

// eslint-disable-next-line import/prefer-default-export
export const PUBLIC_ROUTES: Array<CustomRouter> = [
  {
    path: ROUTES_CONFIG.HOMEPAGE.path,
    element: <Home />,
    title: ROUTES_CONFIG.HOMEPAGE.title,
  },
  {
    path: ROUTES_CONFIG.LISTING.path,
    element: <InvoiceListPage />,
    title: ROUTES_CONFIG.LISTING.title,
  },
  {
    path: ROUTES_CONFIG.EDIT.path,
    element: <EditPage />,
    title: ROUTES_CONFIG.EDIT.title,
  },
  {
    path: `${ROUTES_CONFIG.LOGIN.path}`,
    title: ROUTES_CONFIG.LOGIN.title,
    element: '<Login />',
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PUBLIC} />,
    title: 'Rendering wildcard',
  },
];
