import React from "react";
import { Link } from "react-router-dom";

import Search from "./components/Search";
import ThemesMenu from "../themes-menu/ThemesMenu";

import logo from '../../images/logo.png';

import './header.scss';

const Header: React.FC = () => {
    return (
        <div className='header'>
            <Search />
            <div className="header__center">
                <Link to={'/'}>
                    <div className="header__logo">
                        <img src={logo} alt="company logo" />
                        <h1 className="header__logo-text">BSC-Explorer</h1>
                    </div>
                </Link>
            </div>
            <div className="header__right">
                <div className="header__right-item">
                    <ThemesMenu /> 
                </div>
            </div>
        </div>
    )
};

export default Header;