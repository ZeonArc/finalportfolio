import React, { useContext } from 'react';
import { Github, Youtube, Linkedin, Mail, Gamepad } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import './Footer.css';

const Footer = () => {
    const { currentTheme, themes } = useContext(ThemeContext);
    const themeName = themes[currentTheme]?.name?.replace(/[^\w\s]/g, '').trim() || 'Overworld';

    return (
        <footer className="mc-footer">
            <div className="mc-footer-content">
                <div className="mc-footer-brand">
                    <span className="mc-footer-logo">Harish V</span>
                    <span className="mc-footer-dot">⬥</span>
                </div>

                <div className="mc-footer-links">
                    <a href="https://github.com/harishv2002" className="mc-social-link cursor-target" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github size={15} />
                    </a>
                    <a href="https://www.youtube.com/@ZeonArcYT" className="mc-social-link cursor-target" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <Youtube size={15} />
                    </a>
                    <a href="https://www.linkedin.com/in/harishvdev" className="mc-social-link cursor-target" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin size={15} />
                    </a>
                    <a href="mailto:harishvofficialwork@gmail.com" className="mc-social-link cursor-target" aria-label="Email">
                        <Mail size={15} />
                    </a>
                    <a href="https://zeonarc.itch.io/" className="mc-social-link cursor-target" target="_blank" rel="noopener noreferrer" aria-label="Itch.io">
                        <Gamepad size={15} />
                    </a>
                </div>

                <hr className="mc-footer-divider" />

                <p className="mc-footer-copy">
                    © {new Date().getFullYear()} ZeonArc — Crafted with ⛏️ in the {themeName}
                </p>
            </div>
        </footer>
    );
};

export default React.memo(Footer);
