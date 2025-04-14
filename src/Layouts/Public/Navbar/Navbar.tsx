import './navbar.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../Shared/Constants';
import LocaleSwitcher from '../../../Components/CustomComponents/LocalSwitcher';

export function Navbar() {
  return (
    <header className="header d-flex" id="header">
      <Link to={ROUTES.HOMEPAGE}>Home page</Link>
      <Link to={ROUTES.LOGIN}>Login</Link>
      <div>
        {' '}
        <LocaleSwitcher />
      </div>
    </header>
  );
}

export default Navbar;
