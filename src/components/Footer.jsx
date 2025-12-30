import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-logo">PORTFOLIO <span className="logo-dot">.</span></div>
                <div className="social-links">
                    <a href="#" className="social-icon"><Github size={20} /></a>
                    <a href="#" className="social-icon"><Twitter size={20} /></a>
                    <a href="#" className="social-icon"><Linkedin size={20} /></a>
                    <a href="#" className="social-icon"><Mail size={20} /></a>
                </div>
                <p className="copyright">© {new Date().getFullYear()} Creative Developer. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
