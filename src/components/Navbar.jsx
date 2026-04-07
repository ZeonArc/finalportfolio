import React, { useEffect, useRef, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ThemeContext } from '../context/ThemeContext';
import { Home, Pickaxe, User, Mail, Palette, ChevronUp } from 'lucide-react';
import './Navbar.css';

const navItems = [
    { path: '/', label: 'Home', icon: Home, slot: 1, emoji: '🏠' },
    { path: '/projects', label: 'Work', icon: Pickaxe, slot: 2, emoji: '⛏️' },
    { path: '/about', label: 'About', icon: User, slot: 3, emoji: '👤' },
    { path: '/contact', label: 'Contact', icon: Mail, slot: 4, emoji: '📖' },
];

const Navbar = () => {
    const navRef = useRef(null);
    const slotsRef = useRef([]);
    const indicatorRef = useRef(null);
    const { cycleTheme, themes, currentTheme } = useContext(ThemeContext);
    const location = useLocation();
    const [hovered, setHovered] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Grand entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(navRef.current,
                { y: 100, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 0.5 }
            );

            gsap.fromTo(slotsRef.current.filter(Boolean),
                { y: 30, opacity: 0, rotateY: -45 },
                {
                    y: 0, opacity: 1, rotateY: 0,
                    duration: 0.6, stagger: 0.08,
                    ease: 'back.out(2.5)', delay: 0.8
                }
            );

            gsap.fromTo('.mc-top-bar',
                { y: -50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
            );
        });
        return () => ctx.revert();
    }, []);

    // Active slot animations with GSAP
    useEffect(() => {
        slotsRef.current.forEach((slot, i) => {
            if (!slot) return;
            const isActive = navItems[i] && location.pathname === navItems[i].path;
            if (isActive) {
                gsap.to(slot, {
                    scale: 1.12,
                    y: -6,
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.4)',
                });
                // Pulse the glow
                gsap.fromTo(slot.querySelector('.slot-active-glow'),
                    { opacity: 0, scale: 0.5 },
                    { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
                );
            } else {
                gsap.to(slot, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            }
        });
    }, [location.pathname]);

    // Hover animations
    const handleSlotHover = (index, entering) => {
        const slot = slotsRef.current[index];
        if (!slot) return;
        const isActive = navItems[index] && location.pathname === navItems[index].path;

        if (entering && !isActive) {
            setHovered(index);
            gsap.to(slot, { y: -4, duration: 0.2, ease: 'power2.out' });
            gsap.to(slot.querySelector('.slot-icon'), {
                rotateZ: 10, scale: 1.2, duration: 0.3, ease: 'back.out(3)'
            });
            // Show tooltip
            gsap.fromTo(slot.querySelector('.slot-tooltip'),
                { y: 8, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }
            );
        } else if (!entering && !isActive) {
            setHovered(null);
            gsap.to(slot, { y: 0, duration: 0.2, ease: 'power2.out' });
            gsap.to(slot.querySelector('.slot-icon'), {
                rotateZ: 0, scale: 1, duration: 0.2
            });
            gsap.to(slot.querySelector('.slot-tooltip'), {
                y: 8, opacity: 0, scale: 0.8, duration: 0.15
            });
        }
    };

    // Theme button animation
    const handleThemeCycle = () => {
        cycleTheme();
        gsap.fromTo('.mc-theme-btn',
            { rotateZ: 0 },
            { rotateZ: 360, duration: 0.6, ease: 'back.out(1.5)' }
        );
        gsap.fromTo('.mc-biome-label',
            { opacity: 0, x: 10 },
            { opacity: 1, x: 0, duration: 0.4, delay: 0.2 }
        );
    };

    // Scroll to top
    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        gsap.to(window, { scrollTo: 0, duration: 0.8, ease: 'power2.inOut' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Top Bar */}
            <div className="mc-top-bar">
                <Link to="/" className="mc-logo cursor-target">
                    <span className="mc-logo-icon">⬥</span>
                    <span className="mc-logo-text">Harish V</span>
                </Link>
                <div className="mc-top-actions">
                    <span className="mc-biome-label">{themes[currentTheme]?.name}</span>
                    <button className="mc-theme-btn cursor-target" onClick={handleThemeCycle} title="Switch Biome">
                        <Palette size={15} />
                    </button>
                </div>
            </div>

            {/* Bottom Hotbar */}
            <nav ref={navRef} className="mc-hotbar" role="navigation" aria-label="Main Navigation">
                <div className="hotbar-frame">
                    <div className="hotbar-container">
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    ref={el => slotsRef.current[index] = el}
                                    className={`hotbar-slot ${isActive ? 'active' : ''}`}
                                    onMouseEnter={() => handleSlotHover(index, true)}
                                    onMouseLeave={() => handleSlotHover(index, false)}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <div className="slot-inner">
                                        <Icon size={18} className="slot-icon" />
                                        <span className="slot-number">{item.slot}</span>
                                    </div>
                                    {isActive && <div className="slot-active-glow" />}
                                    {isActive && <span className="slot-active-label">{item.label}</span>}
                                    {/* Minecraft tooltip */}
                                    <div className="slot-tooltip">
                                        <span>{item.emoji} {item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Scroll to top button */}
                {showScrollTop && (
                    <button className="mc-scroll-top cursor-target" onClick={scrollToTop} title="Scroll to top">
                        <ChevronUp size={16} />
                    </button>
                )}
            </nav>
        </>
    );
};

export default Navbar;
