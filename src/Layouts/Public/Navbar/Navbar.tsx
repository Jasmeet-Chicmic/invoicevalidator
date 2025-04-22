import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import './navbar.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../Shared/Constants';
import IMAGES from '../../../Shared/Images';

function NavbarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const showUpload = location.pathname === ROUTES.LISTING;
  const showListing = location.pathname === ROUTES.HOMEPAGE;
  return (
    <Navbar expand="lg" className="">
      <Container fluid>
        <div className="headerWrapper">
          <Navbar.Brand
            onClick={() => navigate(ROUTES.LISTING)}
            className="pointer"
          >
            Bookeep<span>AI</span>
          </Navbar.Brand>

          <div className="sidebtns">
            {showListing ? (
              <Button
                className="bookademo "
                variant="primary"
                onClick={() => {
                  navigate(ROUTES.LISTING);
                }}
              >
                Invoice List
              </Button>
            ) : null}
            {showUpload ? (
              <Button
                className="bookademo"
                variant="primary"
                onClick={() => {
                  navigate(ROUTES.HOMEPAGE);
                }}
              >
                <span className="btn-icon me-2">
                  <img src={IMAGES.addIcon} alt="add-icon" />
                </span>
                Upload
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
