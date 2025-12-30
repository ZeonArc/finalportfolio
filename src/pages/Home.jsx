import React, { useEffect, useRef, useState } from 'react';
import FloatingElements from '../components/FloatingElements';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Layers, Zap, User } from 'lucide-react';
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
        // Hero Animation
        if (heroTextRef.current) {
            gsap.fromTo(heroTextRef.current.children,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
            );
        }

        // Featured & About Scroll Animations
        [featuredRef, aboutRef].forEach(ref => {
            if (ref.current) {
                gsap.fromTo(ref.current.children,
                    { y: 50, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: ref.current,
                            start: 'top 80%',
                        }
                    }
                );
            }
        });
    }, [profile, featuredProjects]); // Re-run anims when data loads

    return (
        <div className="home-page">
            <section className="hero-section">
                <FloatingElements />
                <div className="hero-content" ref={heroTextRef}>
                    <h1 className="hero-title">
                        CREATIVE <span className="highlight">DEVELOPER</span>
                    </h1>
                    <p className="hero-subtitle">
                        {profile ? profile.title : 'Loading...'}
                    </p>
                    <div className="hero-cta">
                        <Link to="/games" className="cta-button primary">
                            View Work <ArrowRight size={18} />
                        </Link>
                        <Link to="/contact" className="cta-button secondary">
                            Let's Talk
                        </Link>
                    </div>
                </div>
            </section>

            {/* About Me Preview */}
            <section className="about-preview-section">
                <div className="about-container glass" ref={aboutRef}>
                    <div className="about-icon"><User size={40} /></div>
                    <div className="about-content">
                        <h2>About Me</h2>
                        <p>{profile ? profile.bio : 'Loading bio...'}</p>
                        <Link to="/about" className="text-link">Read Full Bio &rarr;</Link>
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
                <div className="featured-grid" ref={featuredRef}>
                    {featuredProjects.length > 0 ? (
                        featuredProjects.map(project => (
                            <Link to={`/${project.category.toLowerCase()}`} key={project.id} className="featured-card glass">
                                {project.image_url ? (
                                    <div className="card-image" style={{ backgroundImage: `url(${project.image_url})` }}></div>
                                ) : (
                                    <div className="icon-box">
                                        {project.category === 'Games' && <Zap size={32} />}
                                        {project.category === 'Web' && <Layers size={32} />}
                                        {project.category === 'Design' && <Code size={32} />}
                                    </div>
                                )}
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
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
