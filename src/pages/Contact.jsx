import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import anime from 'animejs';
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
        anime({
            targets: shapes,
            translateY: () => anime.random(-20, 20),
            translateX: () => anime.random(-20, 20),
            rotate: () => anime.random(-15, 15),
            duration: 3000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
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
            anime({
                targets: '.submit-btn',
                scale: [1, 1.1, 1],
                duration: 300,
                easing: 'easeInOutQuad'
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
                <h1>Let's Level Up <br /> <span className="highlight">Your Project</span></h1>
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
                    <button type="submit" className="submit-btn">
                        {status || 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
