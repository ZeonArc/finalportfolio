import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Github, Youtube, Linkedin, Mail, Gamepad2 } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import './Footer.css';

const socials = [
    { href: 'https://github.com/harishv2002', label: 'GitHub', icon: Github },
    { href: 'https://www.linkedin.com/in/harishvdev', label: 'LinkedIn', icon: Linkedin },
    { href: 'https://zeonarc.itch.io/', label: 'itch.io', icon: Gamepad2 },
    { href: 'https://www.youtube.com/@ZeonArcYT', label: 'YouTube', icon: Youtube },
    { href: 'mailto:harishvofficialwork@gmail.com', label: 'Email', icon: Mail },
];

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Work' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
];

const Footer = () => {
    const { currentTheme, themes } = useContext(ThemeContext);

    return (
        <footer className="mc-footer">
            <div className="mc-footer-inner">
                <div className="mc-footer-grid">
                    {/* Brand */}
                    <div className="mc-footer-brand">
                        <span className="mc-footer-logo">
                            <span className="mc-logo-mark" aria-hidden="true" />
                            Harish V
                        </span>
                        <p className="mc-footer-tagline">
                            Gameplay programmer building systems for games and the web.
                            Currently open to Unity and gameplay engineering roles.
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="mc-footer-col" aria-label="Footer">
                        <h3 className="mc-footer-heading">Navigate</h3>
                        <ul className="mc-footer-list">
                            {navLinks.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="mc-footer-link cursor-target">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Contact / socials */}
                    <div className="mc-footer-col">
                        <h3 className="mc-footer-heading">Elsewhere</h3>
                        <ul className="mc-footer-list">
                            {socials.map(({ href, label, icon: Icon }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        className="mc-footer-link mc-footer-social cursor-target"
                                        target={href.startsWith('mailto:') ? undefined : '_blank'}
                                        rel="noopener noreferrer"
                                    >
                                        <Icon size={14} aria-hidden="true" />
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mc-footer-bottom">
                    <span className="mc-footer-copy">
                        © {new Date().getFullYear()} Harish V
                    </span>
                    <span className="mc-footer-meta">
                        <span
                            className="mc-biome-swatch"
                            style={{ background: themes[currentTheme]?.swatch }}
                            aria-hidden="true"
                        />
                        {themes[currentTheme]?.label} biome
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);
