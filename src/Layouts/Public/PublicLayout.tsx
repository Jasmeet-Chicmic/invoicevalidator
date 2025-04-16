import { ReactNode } from 'react';
import { AppLayoutProps } from '../AppLayout.types';
import Navbar from './Navbar';
import './PublicLayout.scss';

function PublicLayout({ children }: AppLayoutProps): ReactNode {
  return (
    <>
      <div className="wrapper">
        <div className="header">
          <Navbar />
        </div>
      </div>

      <div className="content">
        <div className="upload-page">
          <div className="upload-box">{children}</div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}

export default PublicLayout;
