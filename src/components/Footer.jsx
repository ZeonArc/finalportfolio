import React from 'react';
import { Github, Twitter, Linkedin, Mail, Youtube, Gamepad } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-logo">Harish V <span className="logo-dot">.</span></div>
                <div className="social-links">
                    <a href="https://github.com/harishv2002" className="social-icon"><Github size={20} /></a>
                    <a href="https://www.youtube.com/@ZeonArcYT" className="social-icon"><Youtube size={20} /></a>
                    <a href="https://www.linkedin.com/in/harishvdev" className="social-icon"><Linkedin size={20} /></a>
                    <a href="mailto:harishvofficialwork@gmail.com" className="social-icon"><Mail size={20} /></a>
                    <a href="https://zeonarc.itch.io/" className="social-icon"><Gamepad size={20} /></a>
                </div>
                <p className="copyright">© {new Date().getFullYear()} ZeonArc. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
