import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { animate } from 'animejs';
import { supabase } from '../supabaseClient';
import Magnet from '../components/Magnet';
import SplitText from '../components/SplitText';
import './Contact.css';

const Contact = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState(''); // 'sending', 'success', 'error'

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(containerRef.current.querySelector('h1'),
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        )
            .fromTo(formRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                '-=0.4'
            );

        // Floating shapes animation
        const shapes = document.querySelectorAll('.contact-shape');
        animate(shapes, {
            translateY: () => -20 + Math.random() * 40,
            translateX: () => -20 + Math.random() * 40,
            rotate: () => -15 + Math.random() * 30,
            duration: 3000,
            direction: 'alternate',
            loop: true,
            ease: 'inOutSine' // V4 property is 'ease', not 'easing' usually? Step 755 shows 'easings' folder.
        });

    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const { error } = await supabase
                .from('messages')
                .insert([formData]);

            if (error) throw error;

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Success Animation
            animate('.submit-btn', {
                scale: [1, 1.1, 1],
                duration: 300,
                ease: 'inOutQuad'
            });

        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('error');
        }
    };

    return (
        <div className="contact-page" ref={containerRef}>
            <div className="contact-background-shapes">
                <div className="contact-shape shape-1"></div>
                <div className="contact-shape shape-2"></div>
            </div>

            <div className="contact-container">
                <h1>
                    <SplitText delay={0.2} stagger={0.05}>Let's Level Up</SplitText> <br /> 
                    <span className="highlight"><SplitText delay={0.8} stagger={0.05}>Your Project</SplitText></span>
                </h1>
                <p className="contact-subtitle">
                    Have a game idea, a website request, or just want to chat technology? Drop a line.
                </p>

                <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Subject</label>
                        <input
                            type="text"
                            name="subject"
                            required
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea
                            name="message"
                            rows="5"
                            required
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <Magnet padding={50} magnetStrength={0.4}>
                        <button type="submit" className="submit-btn" style={{ width: '100%' }}>
                            {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Error. Try Again.' : 'Send Message'}
                        </button>
                    </Magnet>
                </form>
            </div>
        </div>
    );
};

export default Contact;
