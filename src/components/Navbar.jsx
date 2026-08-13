import React, { useEffect, useRef, useContext, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ThemeContext } from '../context/ThemeContext';
import { Home, Pickaxe, User, Mail, Layers, ChevronUp, Check } from 'lucide-react';
import './Navbar.css';

const navItems = [
    { path: '/', label: 'Home', icon: Home, slot: 1 },
    { path: '/projects', label: 'Work', icon: Pickaxe, slot: 2 },
    { path: '/about', label: 'About', icon: User, slot: 3 },
    { path: '/contact', label: 'Contact', icon: Mail, slot: 4 },
];

const Navbar = () => {
    const navRef = useRef(null);
    const pickerRef = useRef(null);
    const { currentTheme, setTheme, themes, themeKeys } = useContext(ThemeContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [pickerOpen, setPickerOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    /* Entrance — opacity only. A transform on a position:fixed
       element would create a containing block and break it. */
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.mc-topbar', { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.2 });
            gsap.fromTo(navRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.4 });
            gsap.fromTo('.hotbar-slot', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06, ease: 'power2.out', delay: 0.55 });
        });
        return () => ctx.revert();
    }, []);

    /* Hotbar number keys — 1-4 jump between sections, the way
       Minecraft's hotbar works. Ignored while typing. */
    useEffect(() => {
        const onKey = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const tag = e.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

            const item = navItems.find((n) => String(n.slot) === e.key);
            if (item) {
                e.preventDefault();
                navigate(item.path);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate]);

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 500);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Close the biome picker on outside click or Escape */
    useEffect(() => {
        if (!pickerOpen) return;

        const onPointerDown = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false);
        };
        const onKey = (e) => e.key === 'Escape' && setPickerOpen(false);

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [pickerOpen]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            {/* ── Top bar ─────────────────────────────────── */}
            <header className="mc-topbar">
                <Link to="/" className="mc-logo cursor-target" aria-label="Harish V — home">
                    <span className="mc-logo-mark" aria-hidden="true" />
                    <span className="mc-logo-text">Harish V</span>
                </Link>

                <div className="mc-topbar-actions" ref={pickerRef}>
                    <button
                        className="mc-biome-btn cursor-target"
                        onClick={() => setPickerOpen((v) => !v)}
                        aria-expanded={pickerOpen}
                        aria-haspopup="listbox"
                        aria-label={`Biome theme: ${themes[currentTheme]?.label}. Change theme`}
                    >
                        <Layers size={14} aria-hidden="true" />
                        <span className="mc-biome-name">{themes[currentTheme]?.label}</span>
                        <span
                            className="mc-biome-swatch"
                            style={{ background: themes[currentTheme]?.swatch }}
                            aria-hidden="true"
                        />
                    </button>

                    {pickerOpen && (
                        <div className="mc-biome-menu mc-panel" role="listbox" aria-label="Biome themes">
                            <span className="mc-biome-menu-title mc-micro">Select biome</span>
                            {themeKeys.map((key) => {
                                const selected = key === currentTheme;
                                return (
                                    <button
                                        key={key}
                                        role="option"
                                        aria-selected={selected}
                                        className={`mc-biome-option cursor-target ${selected ? 'is-selected' : ''}`}
                                        onClick={() => {
                                            setTheme(key);
                                            setPickerOpen(false);
                                        }}
                                    >
                                        <span
                                            className="mc-biome-swatch"
                                            style={{ background: themes[key].swatch }}
                                            aria-hidden="true"
                                        />
                                        <span className="mc-biome-option-label">{themes[key].label}</span>
                                        {selected && <Check size={13} aria-hidden="true" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </header>

            {/* ── Bottom hotbar ───────────────────────────── */}
            <nav ref={navRef} className="mc-hotbar" aria-label="Main">
                <div className="hotbar-frame mc-panel">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`hotbar-slot cursor-target ${isActive ? 'active' : ''}`}
                                aria-current={isActive ? 'page' : undefined}
                                aria-label={item.label}
                            >
                                <Icon size={19} className="slot-icon" aria-hidden="true" />
                                <span className="slot-number" aria-hidden="true">{item.slot}</span>
                                <span className="slot-tooltip mc-tooltip">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
                <span className="hotbar-hint mc-micro" aria-hidden="true">Press 1–4</span>
            </nav>

            {/* ── Scroll to top ───────────────────────────── */}
            <button
                className={`mc-scroll-top cursor-target ${showScrollTop ? 'is-visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
                tabIndex={showScrollTop ? 0 : -1}
            >
                <ChevronUp size={18} aria-hidden="true" />
            </button>
        </>
    );
};

export default Navbar;
