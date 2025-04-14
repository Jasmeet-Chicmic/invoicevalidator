import { ReactNode } from 'react';

export interface AppLayoutProps {
  isAuthenticated?: boolean;
  children: string | ReactNode | ReactNode[] | null;
}
