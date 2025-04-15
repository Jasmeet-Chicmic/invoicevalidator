import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import './navbar.scss';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../Shared/Constants';

function NavbarComponent() {
  const navigate = useNavigate();
  return (
    <Navbar expand="lg" className="">
      <Container fluid>
        <Navbar.Brand href={ROUTES.LISTING}>BookeepAI</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="sidebtns">
            <Button
              className="bookademo ms-3"
              variant="primary"
              onClick={() => {
                navigate(ROUTES.HOMEPAGE);
              }}
            >
              Upload Invoice
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
