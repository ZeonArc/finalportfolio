import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Youtube, Linkedin, Mail, Gamepad } from 'lucide-react';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const footerRef = useRef(null);

    useEffect(() => {
        if (!footerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.mc-footer-brand',
                { y: 20, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.6,
                    scrollTrigger: { trigger: footerRef.current, start: 'top 95%' }
                }
            );

            gsap.fromTo('.mc-social-link',
                { y: 15, opacity: 0, scale: 0.7 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 0.4, stagger: 0.07,
                    ease: 'back.out(2)',
                    scrollTrigger: { trigger: footerRef.current, start: 'top 95%' }
                }
            );
        }, footerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer className="mc-footer" ref={footerRef}>
            <div className="mc-footer-content">
                <div className="mc-footer-brand">
                    <span className="mc-footer-logo">Harish V</span>
                    <span className="mc-footer-dot">⬥</span>
                </div>

                <div className="mc-footer-links">
                    <a href="https://github.com/harishv2002" className="mc-social-link cursor-target" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github size={16} />
                    </a>
                    <a href="https://www.youtube.com/@ZeonArcYT" className="mc-social-link cursor-target" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <Youtube size={16} />
                    </a>
                    <a href="https://www.linkedin.com/in/harishvdev" className="mc-social-link cursor-target" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin size={16} />
                    </a>
                    <a href="mailto:harishvofficialwork@gmail.com" className="mc-social-link cursor-target" aria-label="Email">
                        <Mail size={16} />
                    </a>
                    <a href="https://zeonarc.itch.io/" className="mc-social-link cursor-target" target="_blank" rel="noopener noreferrer" aria-label="Itch.io">
                        <Gamepad size={16} />
                    </a>
                </div>

                <p className="mc-footer-copy">
                    © {new Date().getFullYear()} ZeonArc — Crafted with ⛏️ in the Overworld
                </p>
            </div>
        </footer>
    );
};

export default Footer;
