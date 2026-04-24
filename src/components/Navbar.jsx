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
    const { cycleTheme, themes, currentTheme } = useContext(ThemeContext);
    const location = useLocation();
    const [hovered, setHovered] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Simple entrance — opacity only, NO transform on the fixed nav
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Fade in only — no scale/translate that would break position:fixed
            gsap.fromTo(navRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 }
            );

            gsap.fromTo(slotsRef.current.filter(Boolean),
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.4, stagger: 0.08,
                    ease: 'power2.out', delay: 0.8
                }
            );

            gsap.fromTo('.mc-top-bar',
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.3 }
            );
        });
        return () => ctx.revert();
    }, []);

    // Active slot visual highlight (CSS classes only, no GSAP transforms)
    useEffect(() => {
        // Just let CSS handle active state via the .active class
    }, [location.pathname]);

    // Hover animations — icon scale only (within slot, doesn't affect fixed parent)
    const handleSlotHover = (index, entering) => {
        const slot = slotsRef.current[index];
        if (!slot) return;
        const isActive = navItems[index] && location.pathname === navItems[index].path;

        if (entering && !isActive) {
            setHovered(index);
            // Show tooltip
            const tooltip = slot.querySelector('.slot-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateX(-50%) translateY(0)';
            }
        } else if (!entering && !isActive) {
            setHovered(null);
            const tooltip = slot.querySelector('.slot-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateX(-50%) translateY(8px)';
            }
        }
    };

    // Theme button
    const handleThemeCycle = () => {
        cycleTheme();
    };

    // Scroll to top
    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
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
