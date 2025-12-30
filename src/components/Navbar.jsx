import React, { useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ThemeContext } from '../context/ThemeContext';
import { Palette } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const navRef = useRef(null);
    const { toggleTheme, currentTheme, themes } = useContext(ThemeContext);

    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
        );
    }, []);

    const handleNextTheme = () => {
        const keys = Object.keys(themes);
        const currentIndex = keys.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % keys.length;
        toggleTheme(keys[nextIndex]);
    };

    return (
        <nav ref={navRef} className="navbar glass">
            <div className="logo">
                Harish V <span className="logo-dot">.</span>
            </div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/projects">Work</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
            <div className="nav-actions">
                <button className="theme-toggle" onClick={handleNextTheme} title="Switch Theme">
                    <Palette size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
