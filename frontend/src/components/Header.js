import React from "react";
import { Link } from 'react-router-dom';
import logo from '../images/Header_logo.svg';
// import sidebar from '../images/Sidebar.png'
// import { useMediaQuery } from "./MediaQuerry";

function Header({email, location, onSignOut}) {
  // const isMobile = useMediaQuery('(max-width: 900px)');

  return (
      <header className="header">
        <img className="header__logo" src={logo} alt="Лого Место"/>
        <nav className="header__navigation">
          {location.pathname === "/sign-in" && <Link className="header__link" to="/sign-up">Регистрация</Link>};
          {location.pathname === "/sign-up" && <Link className="header__link" to="/sign-in">Войти</Link>}
          {/* {(location.pathname === "/" && !isMobile) ?
          <><p className="header__user-email">{email}</p><Link className="header__link" to="#" onClick={onSignOut}>Выйти</Link></> :
          <Link className="header__link"><img src={sidebar}/></Link>} */}
          {location.pathname === "/" && <><p className="header__user-email">{email}</p><Link className="header__link" to="#" onClick={onSignOut}>Выйти</Link></>}
        </nav>
      </header>
    );
  }

  export default Header;
