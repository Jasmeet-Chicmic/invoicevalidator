import { ReactNode } from 'react';
import { AppLayoutProps } from '../AppLayout.types';
import Navbar from '../Public/Navbar';

function PrivateLayout({ children }: AppLayoutProps): ReactNode {
  return (
    <>
      <Navbar />
      {children}
      {/* <Footer /> */}
    </>
  );
}

export default PrivateLayout;
