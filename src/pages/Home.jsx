import React, { useEffect, useRef, useState } from 'react';
import FloatingElements from '../components/FloatingElements';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Layers, Zap, User } from 'lucide-react';
import { animate, createDrawable } from 'animejs';
import { supabase } from '../supabaseClient';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const heroTextRef = useRef(null);
    const featuredRef = useRef(null);
    const aboutRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [featuredProjects, setFeaturedProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profile')
                .select('*')
                .single();
            if (profileData) setProfile(profileData);

            // Fetch Featured Projects
            const { data: projectsData } = await supabase
                .from('projects')
                .select('*')
                .eq('is_featured', true)
                .limit(3);
            if (projectsData) setFeaturedProjects(projectsData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Hero Static Animations (Run ONCE)
        const tl = gsap.timeline();

        // Anime.js V4 Signature Animation
        const signatureText = document.querySelector('.signature-text');
        if (signatureText) {
            animate(createDrawable('.signature-text'), {
                draw: ['0 0', '0 1'],
                duration: 3000,
                ease: 'inOutSine',
                delay: 500,
                loop: false
            });

            const textEl = document.querySelector('.signature-text');
            if (textEl) textEl.style.opacity = '1';
        }

        // Animate Hero Content (Title, Subtitle, Buttons)
        if (heroTextRef.current) {
            tl.fromTo(heroTextRef.current.children,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'power2.out',
                    delay: 0.2
                }
            );
        }

        // Animate Profile Card (About Me) - Static/One-time entry
        if (aboutRef.current) {
            // Animate the card itself or its children
            gsap.fromTo(aboutRef.current,
                { x: 50, opacity: 0 }, // Slide in from right slightly
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                    delay: 0.5 // Wait a bit for hero text
                }
            );
        }
    }, []); // Empty dependency array = Runs once on mount

    useEffect(() => {
        // Scroll Animations (Wait for data content)
        if (featuredRef.current && featuredRef.current.children.length > 0) {
            gsap.fromTo(featuredRef.current.children,
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: featuredRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }
    }, [featuredProjects]); // Re-run only when content that affects layout changes

    const handleMouseMove = (e) => {
        if (!aboutRef.current) return;
        const card = aboutRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.5,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = () => {
        if (!aboutRef.current) return;
        gsap.to(aboutRef.current, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    };

    return (
        <div className="home-page">
            <section className="hero-section">
                <FloatingElements />
                <div className="hero-container">
                    {/* Left: Text Content */}
                    <div className="hero-content" ref={heroTextRef}>
                        <div className="signature-wrapper">
                            <svg className="signature-svg" viewBox="0 0 400 100">
                                <text
                                    x="0" y="50%"
                                    dominantBaseline="middle"
                                    textAnchor="start"
                                    className="signature-text"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    Harish V
                                </text>
                            </svg>
                        </div>
                        <h1 className="hero-title">
                            CREATIVE <span className="highlight">DEVELOPER</span>
                        </h1>
                        <p className="hero-subtitle hero-anim-elem">
                            {profile ? profile.title : 'Loading...'}
                        </p>
                        <div className="hero-cta hero-anim-elem">
                            <Link to="/games" className="cta-button primary">
                                View Work <ArrowRight size={18} />
                            </Link>
                            <Link to="/contact" className="cta-button secondary">
                                Let's Talk
                            </Link>
                        </div>
                    </div>

                    {/* Right: Interactive Profile Card */}
                    <div className="hero-profile"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}>
                        <div className="profile-card glass" ref={aboutRef}>
                            <div className="card-inner">
                                <div className="profile-icon">
                                    {profile && profile.avatar_url ?
                                        <img src={profile.avatar_url} alt="Profile" /> :
                                        <User size={40} />
                                    }
                                </div>
                                <div className="profile-info">
                                    <h3>About Me</h3>
                                    <p>{profile ? profile.bio : 'Loading bio...'}</p>
                                    <Link to="/about" className="text-link">Full Bio <ArrowRight size={14} /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack Marquee */}
            <section className="tech-stack-section">
                <div className="marquee-container">
                    <div className="marquee-content">
                        <span>REACT</span><span>THREE.JS</span><span>UNITY</span>
                        <span>BLENDER</span><span>GSAP</span><span>NODE.JS</span>
                        <span>TYPESCRIPT</span><span>SUPABASE</span>
                        {/* Duplicate loop */}
                        <span>REACT</span><span>THREE.JS</span><span>UNITY</span>
                        <span>BLENDER</span><span>GSAP</span><span>NODE.JS</span>
                        <span>TYPESCRIPT</span><span>SUPABASE</span>
                    </div>
                </div>
            </section>

            {/* Featured Work */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Featured Projects</h2>
                    <Link to="/games" className="view-all">View All <ArrowRight size={16} /></Link>
                </div>
                <div className="featured-gallery" ref={featuredRef}>
                    {featuredProjects.length > 0 ? (
                        featuredProjects.map(project => (
                            <Link to="/projects" key={project.id} className="gallery-item glass">
                                {/* Background Image (Hidden by default, visible on hover/expand) */}
                                <div
                                    className="gallery-bg"
                                    style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : {}}
                                ></div>

                                <div className="gallery-content">
                                    <div className="gallery-icon">
                                        {project.category === 'Games' && <Zap size={24} />}
                                        {project.category === 'Web' && <Layers size={24} />}
                                        {project.category === 'Design' && <Code size={24} />}
                                    </div>
                                    <div className="gallery-text">
                                        <h3>{project.title}</h3>
                                        <span className="gallery-cat">{project.category}</span>
                                    </div>
                                    <div className="gallery-arrow">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="loading-state">Loading Projects...</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
