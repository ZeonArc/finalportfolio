import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, Sword, Shield, Zap, Code, Layers, Star, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SplitText from '../components/SplitText';
import SpotlightCard from '../components/SpotlightCard';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const heroRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [typedTitle, setTypedTitle] = useState('');
    const fullTitle = 'Game Developer & Creative Coder';

    useEffect(() => {
        const fetchData = async () => {
            const { data: profileData } = await supabase.from('profile').select('*').single();
            if (profileData) setProfile(profileData);
            const { data: projectsData } = await supabase.from('projects').select('*').eq('is_featured', true).limit(3);
            if (projectsData) setFeaturedProjects(projectsData);
        };
        fetchData();
    }, []);

    // Typewriter effect for subtitle
    useEffect(() => {
        const title = profile?.title || fullTitle;
        let i = 0;
        const interval = setInterval(() => {
            setTypedTitle(title.slice(0, i + 1));
            i++;
            if (i >= title.length) clearInterval(interval);
        }, 60);
        return () => clearInterval(interval);
    }, [profile]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // GSAP Timeline for hero — cinematic entrance
            const tl = gsap.timeline({ delay: 0.3 });

            // 1. Splash screen flash
            tl.fromTo('.mc-splash-overlay',
                { opacity: 1 },
                { opacity: 0, duration: 0.8, ease: 'power2.out' }
            )
            // 2. Title drops in with 3D flip
            .fromTo('.mc-big-title',
                { y: -80, opacity: 0, rotateX: -60, scale: 1.3 },
                { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
                '-=0.3'
            )
            // 3. Subtitle typewriter cursor blink starts
            .fromTo('.mc-subtitle-line',
                { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power2.out' },
                '-=0.6'
            )
            // 4. Version tag slides in from left
            .fromTo('.mc-version-tag',
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
                '-=0.4'
            )
            // 5. CTAs pop in
            .fromTo('.hero-cta-mc .mc-btn',
                { y: 20, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(2.5)' },
                '-=0.2'
            )
            // 6. Player card slides in from right
            .fromTo('.mc-player-card',
                { x: 80, opacity: 0, rotateY: 15 },
                { x: 0, opacity: 1, rotateY: 0, duration: 0.8, ease: 'power3.out' },
                '-=0.5'
            )
            // 7. Splash text floating
            .fromTo('.mc-splash-text',
                { opacity: 0, scale: 0.5, rotateZ: -5 },
                { opacity: 1, scale: 1, rotateZ: 3, duration: 0.6, ease: 'back.out(2)' },
                '-=0.3'
            );

            // Floating splash text wobble
            gsap.to('.mc-splash-text', {
                rotateZ: -3, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut'
            });

            // ─── ScrollTrigger sections ───
            // Stats: counter-like stagger with scale bounce
            gsap.fromTo('.stat-block',
                { y: 50, opacity: 0, scale: 0.5, rotateZ: -5 },
                {
                    y: 0, opacity: 1, scale: 1, rotateZ: 0, duration: 0.6, stagger: 0.12,
                    ease: 'back.out(2)',
                    scrollTrigger: { trigger: '.mc-stats-section', start: 'top 82%' }
                }
            );

            // Marquee fade in
            gsap.fromTo('.mc-marquee-section',
                { opacity: 0 },
                {
                    opacity: 1, duration: 1,
                    scrollTrigger: { trigger: '.mc-marquee-section', start: 'top 90%' }
                }
            );

            // Featured projects: staggered slide + scale
            gsap.fromTo('.mc-featured-item',
                { y: 60, opacity: 0, scale: 0.9 },
                {
                    y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: '.mc-featured-section', start: 'top 80%' }
                }
            );

            // Section headers: slide in
            gsap.fromTo('.mc-section-header',
                { x: -30, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 0.6,
                    scrollTrigger: { trigger: '.mc-featured-section', start: 'top 85%' }
                }
            );

        }, heroRef);

        return () => ctx.revert();
    }, [featuredProjects]);

    return (
        <div className="home-page" ref={heroRef}>
            {/* Splash overlay */}
            <div className="mc-splash-overlay" />

            {/* === HERO === */}
            <section className="mc-hero-section">
                <div className="mc-hero-container">
                    <div className="mc-hero-text" style={{ perspective: '1000px' }}>
                        <div className="mc-version-tag">
                            <span className="mc-tag-dot" /> Portfolio v2.0
                        </div>

                        <h1 className="mc-big-title">
                            <SplitText delay={0.6} stagger={0.06}>HARISH V</SplitText>
                        </h1>

                        <div className="mc-subtitle-line">
                            <span className="mc-typed-text">{typedTitle}</span>
                            <span className="mc-cursor-blink">_</span>
                        </div>

                        {/* Minecraft splash text */}
                        <div className="mc-splash-text">
                            <Sparkles size={12} />
                            Also try Terraria!
                        </div>

                        <div className="hero-cta-mc">
                            <Link to="/projects" className="mc-btn mc-btn-primary cursor-target">
                                <Sword size={14} /> View My Work <ArrowRight size={14} />
                            </Link>
                            <Link to="/contact" className="mc-btn mc-btn-secondary cursor-target">
                                <Shield size={14} /> Let's Talk
                            </Link>
                        </div>
                    </div>

                    {/* Player Card */}
                    <div className="mc-player-card">
                        <div className="mc-card-header">
                            <div className="mc-card-avatar mc-slot">
                                {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" /> : <span>⛏️</span>}
                            </div>
                            <div className="mc-card-nameplate">
                                <span className="mc-card-name">{profile?.full_name || 'Harish V'}</span>
                                <span className="mc-card-title">{profile?.title || 'Game Developer'}</span>
                            </div>
                            <Star size={16} className="mc-card-star" />
                        </div>
                        <div className="mc-card-body">
                            <p className="mc-card-bio">
                                {profile?.bio || 'Crafting immersive games and creative web experiences with modern tech.'}
                            </p>
                            <div className="mc-card-stats-row">
                                <div className="mc-mini-stat">
                                    <span className="mc-ms-val">10+</span>
                                    <span className="mc-ms-label">Projects</span>
                                </div>
                                <div className="mc-mini-stat">
                                    <span className="mc-ms-val">5+</span>
                                    <span className="mc-ms-label">Tech</span>
                                </div>
                                <div className="mc-mini-stat">
                                    <span className="mc-ms-val">2+</span>
                                    <span className="mc-ms-label">Years</span>
                                </div>
                            </div>
                            <div className="mc-card-xp">
                                <span className="mc-xp-text">XP Level 99</span>
                                <div className="xp-bar"><div className="xp-bar-fill" style={{ width: '85%' }} /></div>
                            </div>
                            <Link to="/about" className="mc-card-link cursor-target">
                                Open Inventory <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* === MARQUEE === */}
            <section className="mc-marquee-section">
                <div className="mc-marquee">
                    <div className="mc-marquee-track">
                        {['REACT', 'THREE.JS', 'UNITY', 'UNREAL', 'BLENDER', 'GSAP', 'NODE.JS', 'C#', 'JAVA',
                          'REACT', 'THREE.JS', 'UNITY', 'UNREAL', 'BLENDER', 'GSAP', 'NODE.JS', 'C#', 'JAVA'].map((tech, i) => (
                            <span key={i} className="mc-marquee-item"><span className="mc-marquee-diamond">◆</span> {tech}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* === STATS === */}
            <section className="mc-stats-section">
                <div className="mc-stats-grid">
                    {[
                        { value: '10+', label: 'Projects Crafted', icon: '⚔️' },
                        { value: '5+', label: 'Technologies', icon: '⛏️' },
                        { value: '2+', label: 'Years XP', icon: '🏆' },
                        { value: '∞', label: 'Passion', icon: '❤️' },
                    ].map((stat, i) => (
                        <SpotlightCard key={i} className="stat-block mc-slot" spotlightColor="rgba(74, 237, 217, 0.1)">
                            <span className="stat-emoji">{stat.icon}</span>
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </SpotlightCard>
                    ))}
                </div>
            </section>

            {/* === FEATURED === */}
            <section className="mc-featured-section">
                <div className="mc-section-header">
                    <h2><SplitText delay={0.1} stagger={0.04}>Featured Loot</SplitText></h2>
                    <Link to="/projects" className="mc-view-all cursor-target">View All <ArrowRight size={16} /></Link>
                </div>
                <div className="mc-featured-grid">
                    {featuredProjects.length > 0 ? (
                        featuredProjects.map(project => (
                            <SpotlightCard key={project.id} className="mc-featured-item mc-slot" spotlightColor="rgba(74, 237, 217, 0.12)">
                                <Link to="/projects" className="mc-featured-link cursor-target">
                                    <div className="mc-featured-bg" style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : {}} />
                                    <div className="mc-featured-content">
                                        <div className="mc-featured-icon">
                                            {project.category === 'Games' && <Zap size={20} />}
                                            {project.category === 'Web' && <Layers size={20} />}
                                            {!['Games', 'Web'].includes(project.category) && <Code size={20} />}
                                        </div>
                                        <div className="mc-featured-info">
                                            <h3>{project.title}</h3>
                                            <span className="mc-featured-cat">{project.category}</span>
                                        </div>
                                        <ArrowRight size={16} className="mc-featured-arrow" />
                                    </div>
                                </Link>
                            </SpotlightCard>
                        ))
                    ) : (
                        <div className="mc-loading-state"><div className="mc-loading" /><span>Loading loot...</span></div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
