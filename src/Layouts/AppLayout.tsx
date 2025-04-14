import { memo } from 'react';
import PrivateLayout from './Private/PrivateLayout';
import PublicLayout from './Public/PublicLayout';
import { AppLayoutProps } from './AppLayout.types';

function AppLayout({ isAuthenticated, children }: AppLayoutProps) {
  const Layout = isAuthenticated ? PrivateLayout : PublicLayout;
  return <Layout>{children}</Layout>;
}

export default memo(AppLayout);
