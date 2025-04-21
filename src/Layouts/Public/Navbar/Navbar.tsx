// Library
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
// Styles
import './navbar.scss';
// Library
import { useNavigate } from 'react-router-dom';
// Constants
import { BUTTON_TEXT, ROUTES } from '../../../Shared/Constants';

function NavbarComponent() {
  const navigate = useNavigate();
  const onClickHome = () => {
    navigate(ROUTES.HOMEPAGE);
  };
  return (
    <Navbar expand="lg" className="">
      <Container fluid>
        <div className="headerWrapper">
          <Navbar.Brand href={ROUTES.LISTING}>BookeepAI</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="sidebtns">
              <Button
                className="bookademo ms-3"
                variant="primary"
                onClick={onClickHome}
              >
                {BUTTON_TEXT.UPLOAD_INVOICE}
              </Button>
            </div>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
