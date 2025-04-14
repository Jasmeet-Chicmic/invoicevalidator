import { ReactNode } from 'react';
import { AppLayoutProps } from '../AppLayout.types';
import Navbar from './Navbar';

function PublicLayout({ children }: AppLayoutProps): ReactNode {
  return (
    <>
      <Navbar />
      {children}
      {/* <Footer /> */}
    </>
  );
}

export default PublicLayout;
