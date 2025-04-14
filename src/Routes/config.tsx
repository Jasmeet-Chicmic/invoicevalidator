import { RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import { PRIVATE_ROUTES } from './PrivateRoutes';
import { PUBLIC_ROUTES } from './PublicRoutes';

export const guestRoutes: Array<RouteObject> = [
  ...(PUBLIC_ROUTES?.map((routes) => {
    return {
      ...routes,
      element: <Suspense fallback="Loading...">{routes.element}</Suspense>,
    };
  }) || []),
];

export const authenticatedRoutes: Array<RouteObject> = [
  ...(PRIVATE_ROUTES?.map((routes) => {
    return {
      ...routes,
      element: <Suspense fallback="Loading...">{routes.element}</Suspense>,
    };
  }) || []),
];
