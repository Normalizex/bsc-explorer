import React, { useState, useEffect, useRef } from "react";

import { useTypedDispatch } from "../../hooks/typed";
import { setMode, setColor } from "../../store/themes/themes.slice";
import { ThemesMode, ThemesColors, ThemeMode, ThemeColor } from "../../store/themes/themesProps";

import './themes-menu.scss'; 

const ThemesMenu: React.FC = () => {
    const dispath = useTypedDispatch();

    const menu_ref = useRef<HTMLDivElement>(null);
    const menu_toggle_ref = useRef<HTMLButtonElement>(null);

    const [currentMode, setCurrentMode] = useState('ligth');
    const [currentColor, setCurrentColor] = useState('blue');

    const openMenu = () => {
        if (!menu_ref.current) return;
        menu_ref.current.classList.add('active');
    };

    const closeMenu = () => {
        if (!menu_ref.current) return;
        menu_ref.current.classList.remove('active');
    };

    const updateMode = (mode: ThemeMode) => {
        setCurrentMode(mode.id);
        localStorage.setItem('themeMode', mode.class);
        dispath(setMode(mode.class));
    };

    const updateColor = (color: ThemeColor) => {
        setCurrentColor(color.id);
        localStorage.setItem('colorMode', color.class);
        dispath(setColor(color.class));
    }

    useEffect(() => {
        function assertIsNode(e: EventTarget | null): asserts e is Node {
            if (!e || !("nodeType" in e)) {
                throw new Error(`Node expected`);
            }
        } 
        document.addEventListener('mousedown', (e) => {
            assertIsNode(e.target);
            // user click toggle
            if (menu_ref.current && menu_toggle_ref.current && menu_toggle_ref.current.contains(e.target)) {
                menu_ref.current.classList.toggle('active')
            } else {
                // user click outside toggle and content
                if (menu_ref.current && !menu_ref.current.contains(e.target)) {
                    menu_ref.current.classList.remove('active')
                }
            }
        })
    }, []);

    useEffect(() => {
        const themeClass = ThemesMode.find(theme => theme.class === localStorage.getItem('themeMode'));
        const colorClass = ThemesColors.find(color => color.class === localStorage.getItem('colorMode'));

        if (themeClass !== undefined) setCurrentMode(themeClass.id)
        if (colorClass !== undefined) setCurrentColor(colorClass.id)
    }, []);

    return (
        <div>
            <button ref={menu_toggle_ref} className="theme_menu__toggle" onClick={openMenu}>
                <i className='bx bx-palette' />
            </button>
            <div ref={menu_ref} className="theme-menu">
                <h4>Theme settings</h4>
                <button className="theme-menu__close" onClick={closeMenu}>
                    <i className='bx bx-x' />
                </button>
                <div className="theme-menu__select">
                    <span>Choose mode</span>
                    <ul className="mode-list">
                        {
                            ThemesMode.map((mode, index) => (
                                <li key={index} onClick={() => updateMode(mode)}>
                                    <div className={`mode-list__color ${mode.background} ${mode.id === currentMode ? 'active' : ''}`}>
                                        <i className='bx bx-check'></i>
                                    </div>
                                    <span>{mode.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                    <div className="theme-menu__select">
                        <span>Choose color</span>
                        <ul className="mode-list">
                            {
                                ThemesColors.map((color, index) => (
                                    <li key={index} onClick={() => {
                                        console.log(color);
                                        updateColor(color);
                                    }}>
                                        <div className={`mode-list__color ${color.background} ${color.id === currentColor ? 'active' : ''}`}>
                                            <i className='bx bx-check'></i>
                                        </div>
                                        <span>{color.name}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ThemesMenu;