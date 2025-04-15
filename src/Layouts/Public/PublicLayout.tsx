import { ReactNode } from 'react';
import { AppLayoutProps } from '../AppLayout.types';
import Navbar from './Navbar';
import './PublicLayout.scss';

function PublicLayout({ children }: AppLayoutProps): ReactNode {
  return (
    <main className="PublicLayout">
        <div className="header">
          <Navbar />
        </div>

      <div className="content">
        <div className="upload-page">
         {children}
        </div>
      </div>

      {/* <Footer /> */}
    </main>
  );
}

export default PublicLayout;
