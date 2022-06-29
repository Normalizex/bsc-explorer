import React, { useEffect } from "react";
import { HashRouter as Router } from 'react-router-dom';
import { useTypedSelector, useTypedDispatch } from "../../hooks/typed";

import { selectThemes, setMode, setColor } from "../../store/themes/themes.slice";

import Header from "../header/Header";
import Pages from "../Pages";

import './layout.scss';

const Layout: React.FC = () => {

    const themesReducer = useTypedSelector(selectThemes);
    const dispath = useTypedDispatch();

    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode') || 'theme-mode-dark';
        const colorClass = localStorage.getItem('colorMode') || 'theme-color-orange';

        dispath(setMode(themeClass));
        dispath(setColor(colorClass));
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Router>
            <div className={`layout ${themesReducer.mode} ${themesReducer.color}`}>
                <div className="layout__content">
                    <Header />
                    <div className="layout__content-main">
                        <Pages />
                    </div>
                </div>
                {/* <div className="layout__footer">
                    <h3>Powered by BscScan APIs</h3>
                </div> */}
            </div>
        </Router>
    )
};

export default Layout;