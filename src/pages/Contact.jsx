import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
    Mail, MapPin, Clock, Send, Check, AlertCircle,
    Github, Linkedin, Gamepad2,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import GlitchText from '../components/GlitchText';
import './Contact.css';

const MESSAGE_LIMIT = 500;

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };

const DETAILS = [
    { Icon: MapPin, label: 'Location', value: 'India · Remote friendly' },
    { Icon: Clock, label: 'Response time', value: 'Within 24 hours' },
    { Icon: Mail, label: 'Email', value: 'harishvofficialwork@gmail.com', href: 'mailto:harishvofficialwork@gmail.com' },
];

const SOCIALS = [
    { Icon: Github, label: 'GitHub', href: 'https://github.com/harishv2002' },
    { Icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/harishvdev' },
    { Icon: Gamepad2, label: 'itch.io', href: 'https://zeonarc.itch.io/' },
];

const INTERESTS = [
    'Gameplay programming roles',
    'Unity development contracts',
    'Game jams and collaborations',
    'Open-source contributions',
];

const Contact = () => {
    const pageRef = useRef(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.contact-header > *',
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
            );
            gsap.fromTo('.contact-page-left',
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.3 }
            );
            gsap.fromTo('.contact-page-right',
                { x: 20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.4 }
            );
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === 'sending') return;

        setStatus('sending');
        setErrorMsg('');

        try {
            const { error } = await supabase.from('messages').insert([formData]);
            if (error) throw error;

            setStatus('success');
            setFormData(EMPTY_FORM);

            gsap.fromTo('.contact-page-right',
                { boxShadow: '0 0 0 rgba(0,0,0,0)' },
                {
                    boxShadow: '0 0 40px -8px var(--accent-color)',
                    duration: 0.45, yoyo: true, repeat: 1, ease: 'power2.inOut',
                }
            );

            setTimeout(() => setStatus('idle'), 4000);
        } catch (err) {
            console.error('Message send failed:', err);
            setErrorMsg(err?.message || 'Something went wrong. Please try again or email me directly.');
            setStatus('error');
            gsap.fromTo('.contact-page-right',
                { x: 0 },
                { x: -6, duration: 0.06, yoyo: true, repeat: 5, ease: 'power1.inOut', clearProps: 'x' }
            );
        }
    };

    const charCount = formData.message.length;
    const sending = status === 'sending';

    return (
        <div className="contact-page mc-page" ref={pageRef}>

            {/* ═══ HEADER ═══ */}
            <header className="contact-header">
                <span className="mc-label">
                    <Mail size={12} aria-hidden="true" /> Contact
                </span>
                <h1 className="contact-title">
                    <GlitchText speed={38}>Get in touch</GlitchText>
                </h1>
                <p className="contact-sub">
                    Open to gameplay programming roles, freelance work, and collaborations.
                </p>
            </header>

            {/* ═══ BOOK SPREAD ═══ */}
            <div className="contact-book mc-panel">
                <span className="contact-spine" aria-hidden="true" />

                {/* Left page — details */}
                <section className="contact-page-left">
                    <h2 className="panel-heading">Details</h2>

                    <ul className="contact-details">
                        {DETAILS.map(({ Icon, label, value, href }) => (
                            <li key={label} className="detail-row">
                                <span className="detail-icon mc-inset">
                                    <Icon size={15} aria-hidden="true" />
                                </span>
                                <span className="detail-text">
                                    <span className="detail-label mc-micro">{label}</span>
                                    {href
                                        ? <a href={href} className="detail-value cursor-target">{value}</a>
                                        : <span className="detail-value">{value}</span>}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="contact-block">
                        <h3 className="contact-block-title">Open to</h3>
                        <ul className="interest-list">
                            {INTERESTS.map((item) => (
                                <li key={item}>
                                    <span className="interest-marker" aria-hidden="true" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="contact-block">
                        <h3 className="contact-block-title">Elsewhere</h3>
                        <div className="contact-socials">
                            {SOCIALS.map(({ Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-btn cursor-target"
                                    aria-label={label}
                                >
                                    <Icon size={16} aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Right page — form */}
                <section className="contact-page-right">
                    <h2 className="panel-heading">Send a message</h2>

                    <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="cf-name">Name</label>
                                <input
                                    id="cf-name" name="name" type="text" required
                                    placeholder="Your name"
                                    value={formData.name} onChange={handleChange}
                                    disabled={sending} autoComplete="name"
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="cf-email">Email</label>
                                <input
                                    id="cf-email" name="email" type="email" required
                                    placeholder="you@example.com"
                                    value={formData.email} onChange={handleChange}
                                    disabled={sending} autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="cf-subject">Subject</label>
                            <input
                                id="cf-subject" name="subject" type="text" required
                                placeholder="What is this about?"
                                value={formData.subject} onChange={handleChange}
                                disabled={sending}
                            />
                        </div>

                        <div className="form-field">
                            <div className="field-head">
                                <label htmlFor="cf-message">Message</label>
                                <span className={`char-count ${charCount > MESSAGE_LIMIT * 0.9 ? 'is-near-limit' : ''}`}>
                                    {charCount}/{MESSAGE_LIMIT}
                                </span>
                            </div>
                            <textarea
                                id="cf-message" name="message" rows="7" required
                                maxLength={MESSAGE_LIMIT}
                                placeholder="Tell me about the role, project, or idea…"
                                value={formData.message} onChange={handleChange}
                                disabled={sending}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`mc-btn mc-btn-primary form-submit cursor-target is-${status}`}
                            disabled={sending}
                        >
                            {status === 'sending' && <><span className="btn-spinner" aria-hidden="true" /> Sending</>}
                            {status === 'success' && <><Check size={14} aria-hidden="true" /> Message sent</>}
                            {status === 'error' && <><AlertCircle size={14} aria-hidden="true" /> Try again</>}
                            {status === 'idle' && <><Send size={14} aria-hidden="true" /> Send message</>}
                        </button>

                        <p className="form-status" role="status" aria-live="polite">
                            {status === 'success' && 'Thanks — I will get back to you within 24 hours.'}
                            {status === 'error' && errorMsg}
                        </p>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Contact;
