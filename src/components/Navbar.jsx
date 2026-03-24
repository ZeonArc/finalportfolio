import React, { useEffect, useRef, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ThemeContext } from '../context/ThemeContext';
import { Palette, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const navRef = useRef(null);
    const { toggleTheme, currentTheme, themes } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);

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

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Close menu when clicking a link
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <nav ref={navRef} className="navbar glass">
            <div className="logo">
                Harish V <span className="logo-dot">.</span>
            </div>

            {/* Desktop Nav */}
            <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
                <li><Link to="/projects" onClick={handleLinkClick}>Work</Link></li>
                <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
                <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
            </ul>

            <div className="nav-actions">
                <button className="theme-toggle" onClick={handleNextTheme} title="Switch Theme">
                    <Palette size={20} />
                </button>
                
                {/* Mobile Menu Toggle */}
                <button className="mobile-toggle" onClick={toggleMenu}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
