import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import './navbar.scss';
import { ROUTES } from '../../../Shared/Constants';

function NavbarComponent() {
  return (
    <Navbar expand="lg" className="">
      <Container fluid>
        <Navbar.Brand href={ROUTES.HOMEPAGE}>BookeepAI</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            <Nav.Link href="#home" className="active">
              Home
            </Nav.Link>
            <Nav.Link href="#link">About us</Nav.Link>
            <Nav.Link href="#link">How it Works?</Nav.Link>
          </Nav>
          <div className="sidebtns">
            <Button className="bookademo ms-3" variant="primary">
              Book a Demo
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
