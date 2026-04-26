import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../supabaseClient';
import SplitText from '../components/SplitText';
import GlitchText from '../components/GlitchText';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
    const pageRef = useRef(null);
    const bookRef = useRef(null);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');
    const [xpGained, setXpGained] = useState(false);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Book opening animation
            gsap.fromTo('.book-quill-wrapper',
                { rotateY: -90, opacity: 0, transformOrigin: 'left center' },
                { rotateY: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
            );

            gsap.fromTo('.bq-left-page',
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, delay: 0.8, ease: 'power2.out' }
            );

            gsap.fromTo('.bq-right-page',
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, delay: 1, ease: 'power2.out' }
            );

            gsap.fromTo('.bq-quill',
                { y: -20, opacity: 0, rotateZ: -15 },
                { y: 0, opacity: 1, rotateZ: 0, duration: 0.6, delay: 1.3, ease: 'back.out(2)' }
            );
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'message') setCharCount(e.target.value.length);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // Quill writing animation
        gsap.to('.bq-quill', {
            rotateZ: -5, y: -3, duration: 0.15, yoyo: true, repeat: 5, ease: 'power1.inOut'
        });

        try {
            const { error } = await supabase.from('messages').insert([formData]);
            if (error) throw error;

            setStatus('success');
            setXpGained(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setCharCount(0);

            // Success: page glow
            gsap.fromTo('.book-quill-wrapper',
                { boxShadow: '0 0 0 rgba(23, 221, 98, 0)' },
                { boxShadow: '0 0 40px rgba(23, 221, 98, 0.3)', duration: 0.5, yoyo: true, repeat: 1 }
            );

            // XP popup float
            gsap.fromTo('.bq-xp-popup',
                { y: 0, opacity: 1, scale: 1 },
                { y: -80, opacity: 0, scale: 1.5, duration: 2, ease: 'power2.out', delay: 0.2 }
            );

            setTimeout(() => { setXpGained(false); setStatus(''); }, 3500);
        } catch (error) {
            console.error('Error:', error);
            setStatus('error');
            gsap.to('.book-quill-wrapper', {
                x: -5, duration: 0.05, yoyo: true, repeat: 5, ease: 'power1.inOut'
            });
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="mc-contact-page" ref={pageRef}>
            {/* Book & Quill Container */}
            <div className="book-quill-wrapper" ref={bookRef} style={{ perspective: '1200px' }}>
                {/* Book Spine */}
                <div className="bq-spine" />

                {/* Left Page — Info */}
                <div className="bq-left-page">
                    <div className="bq-page-header">
                        <span className="bq-page-title">📖 <GlitchText speed={45}>Ender Mail</GlitchText></span>
                        <span className="bq-page-num">Page 1</span>
                    </div>
                    <div className="bq-page-content">
                        <div className="bq-info-section">
                            <h2><SplitText delay={1.2} stagger={0.04}>Send a Message</SplitText></h2>
                            <p className="bq-desc">
                                Write your message in this enchanted book. 
                                It will be delivered through the Ender Mail system directly to my inbox.
                            </p>
                        </div>

                        <div className="bq-info-blocks">
                            <div className="bq-info-block">
                                <span className="bq-info-icon">🌐</span>
                                <div>
                                    <h4>Server</h4>
                                    <p>India 🇮🇳</p>
                                </div>
                            </div>
                            <div className="bq-info-block">
                                <span className="bq-info-icon">⚡</span>
                                <div>
                                    <h4>Response</h4>
                                    <p>&lt; 24 hours</p>
                                </div>
                            </div>
                            <div className="bq-info-block">
                                <span className="bq-info-icon">🎮</span>
                                <div>
                                    <h4>Status</h4>
                                    <p>Online ●</p>
                                </div>
                            </div>
                        </div>

                        <div className="bq-quests">
                            <h4>✦ Preferred Quests</h4>
                            <ul>
                                <li>⚔️ Game Development</li>
                                <li>🌐 Web Applications</li>
                                <li>🎨 Creative Projects</li>
                                <li>🤝 Open Source</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bq-page-footer">
                        <span>— Harish V</span>
                    </div>
                </div>

                {/* Right Page — Form */}
                <div className="bq-right-page">
                    <div className="bq-page-header">
                        <span className="bq-page-title">✍️ <GlitchText speed={45}>Compose</GlitchText></span>
                        <span className="bq-page-num">Page 2</span>
                    </div>

                    <form className="bq-form" onSubmit={handleSubmit}>
                        <div className="bq-form-row">
                            <div className="bq-field">
                                <label>Player Name</label>
                                <input type="text" name="name" required placeholder="Steve..." value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="bq-field">
                                <label>Ender Mail</label>
                                <input type="email" name="email" required placeholder="steve@end.net" value={formData.email} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="bq-field">
                            <label>Subject</label>
                            <input type="text" name="subject" required placeholder="Quest title..." value={formData.subject} onChange={handleChange} />
                        </div>

                        <div className="bq-field bq-field-message">
                            <label>Message</label>
                            <textarea name="message" rows="8" required placeholder="Dear adventurer..." value={formData.message} onChange={handleChange} />
                            <span className="bq-char-count">{charCount}/500</span>
                        </div>

                        <div className="bq-form-actions">
                            <button type="submit" className={`bq-submit ${status}`} disabled={status === 'sending'}>
                                {status === 'sending' ? '⏳ Enchanting...' :
                                 status === 'success' ? '✅ Sent!' :
                                 status === 'error' ? '❌ Try Again' :
                                 '📨 Sign & Send'}
                            </button>
                        </div>
                    </form>

                    {xpGained && (
                        <div className="bq-xp-popup">+50 XP ✨</div>
                    )}

                    {/* Quill decoration */}
                    <div className="bq-quill">🪶</div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
