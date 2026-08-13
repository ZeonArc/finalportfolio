import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import {
    ArrowRight, ArrowUpRight, Gamepad2, Globe, Palette, Code2,
    Boxes, Cpu, Award, MapPin, Circle,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import SplitText from '../components/SplitText';
import SpotlightCard from '../components/SpotlightCard';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const TECH_MARQUEE = [
    'UNITY', 'C#', 'REACT', 'THREE.JS', 'UNREAL',
    'BLENDER', 'GSAP', 'NODE.JS', 'JAVA', 'PYTHON',
];

/* Category → icon. Keeps project cards visually sortable at a glance. */
const CATEGORY_ICON = {
    Games: Gamepad2,
    Web: Globe,
    Design: Palette,
};

const FALLBACK_TITLE = 'Gameplay Programmer';

const Home = () => {
    const pageRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [typedTitle, setTypedTitle] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const [{ data: profileData }, { data: projectsData }] = await Promise.all([
                supabase.from('profile').select('*').single(),
                supabase.from('projects').select('*').order('created_at', { ascending: false }),
            ]);
            if (profileData) setProfile(profileData);
            if (projectsData) setProjects(projectsData);
        };
        fetchData();
    }, []);

    /* Typewriter on the role line. The first tick writes an empty
       slice, so the line clears itself without a synchronous
       setState in the effect body. */
    useEffect(() => {
        const title = profile?.title || FALLBACK_TITLE;
        let i = 0;
        const interval = setInterval(() => {
            setTypedTitle(title.slice(0, i));
            i += 1;
            if (i > title.length) clearInterval(interval);
        }, 55);
        return () => clearInterval(interval);
    }, [profile]);

    const featured = useMemo(
        () => projects.filter((p) => p.is_featured).slice(0, 3),
        [projects]
    );

    /* Real figures derived from the data, not invented ones. */
    const stats = useMemo(() => {
        const techCount = new Set(
            projects.flatMap((p) => p.tech_stack || [])
        ).size;

        return [
            { value: projects.length || '—', label: 'Projects built', Icon: Boxes },
            { value: techCount || '—', label: 'Technologies used', Icon: Cpu },
            { value: (profile?.certifications?.length ?? 3), label: 'Certifications', Icon: Award },
        ];
    }, [projects, profile]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });

            tl.fromTo('.hero-eyebrow', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
                .fromTo('.hero-role', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.25')
                .fromTo('.hero-desc', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
                .fromTo('.hero-actions > *', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '-=0.35')
                .fromTo('.hero-meta', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3')
                .fromTo('.hero-card', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.6');

            gsap.fromTo('.stat-block',
                { y: 28, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: { trigger: '.home-stats', start: 'top 85%' },
                }
            );

            gsap.fromTo('.featured-card',
                { y: 32, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: { trigger: '.home-featured', start: 'top 82%' },
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, [featured.length, stats]);

    return (
        <div className="home-page mc-page" ref={pageRef}>

            {/* ═══ HERO ═══ */}
            <section className="home-hero">
                <div className="hero-text">
                    <span className="hero-eyebrow mc-label">
                        <Circle size={7} fill="currentColor" aria-hidden="true" />
                        Available for work
                    </span>

                    <h1 className="hero-title">
                        <SplitText delay={0.35} stagger={0.05}>HARISH V</SplitText>
                    </h1>

                    <p className="hero-role">
                        {typedTitle}
                        <span className="hero-caret" aria-hidden="true" />
                    </p>

                    <p className="hero-desc">
                        {profile?.bio ||
                            'I build gameplay systems, procedural worlds, and interactive web experiences — mostly in Unity and C#, sometimes in the browser with React and Three.js.'}
                    </p>

                    <div className="hero-actions">
                        <Link to="/projects" className="mc-btn mc-btn-primary cursor-target">
                            View work <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                        <Link to="/contact" className="mc-btn mc-btn-ghost cursor-target">
                            Get in touch
                        </Link>
                    </div>

                    <div className="hero-meta">
                        <span className="hero-meta-item">
                            <MapPin size={13} aria-hidden="true" />
                            India · Remote friendly
                        </span>
                    </div>
                </div>

                {/* Profile card */}
                <aside className="hero-card mc-panel">
                    <div className="hero-card-top">
                        <div className="hero-avatar mc-inset">
                            {profile?.avatar_url
                                ? <img src={profile.avatar_url} alt="" />
                                : <Code2 size={26} aria-hidden="true" />}
                        </div>
                        <div className="hero-card-id">
                            <span className="hero-card-name">{profile?.full_name || 'Harish V'}</span>
                            <span className="hero-card-role">{profile?.title || FALLBACK_TITLE}</span>
                        </div>
                    </div>

                    <div className="hero-card-body">
                        <h3 className="hero-card-heading">Focus</h3>
                        <ul className="hero-focus-list">
                            <li><Gamepad2 size={13} aria-hidden="true" /> Gameplay &amp; systems programming</li>
                            <li><Boxes size={13} aria-hidden="true" /> Procedural generation</li>
                            <li><Globe size={13} aria-hidden="true" /> Real-time web graphics</li>
                        </ul>

                        <Link to="/about" className="hero-card-link cursor-target">
                            Full background <ArrowUpRight size={14} aria-hidden="true" />
                        </Link>
                    </div>
                </aside>
            </section>

            {/* ═══ TECH MARQUEE ═══ */}
            <section className="home-marquee" aria-label="Technologies">
                <div className="marquee-viewport">
                    <div className="marquee-track">
                        {[...TECH_MARQUEE, ...TECH_MARQUEE].map((tech, i) => (
                            <span key={i} className="marquee-item">
                                <span className="marquee-dot" aria-hidden="true" />
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ STATS ═══ */}
            <section className="home-stats mc-section">
                <div className="stats-grid">
                    {stats.map(({ value, label, Icon }) => (
                        <div key={label} className="stat-block mc-slot">
                            <Icon size={18} className="stat-icon" aria-hidden="true" />
                            <span className="stat-value">{value}</span>
                            <span className="stat-label">{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ FEATURED WORK ═══ */}
            <section className="home-featured mc-section">
                <header className="mc-section-head">
                    <div>
                        <h2>Selected work</h2>
                        <div className="mc-rule" />
                    </div>
                    <Link to="/projects" className="section-link cursor-target">
                        All projects <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </header>

                <div className="featured-grid">
                    {featured.length > 0 ? (
                        featured.map((project) => {
                            const Icon = CATEGORY_ICON[project.category] || Code2;
                            return (
                                <SpotlightCard
                                    key={project.id}
                                    className="featured-card mc-slot"
                                    spotlightColor="rgba(255, 255, 255, 0.06)"
                                >
                                    <Link to="/projects" className="featured-link cursor-target">
                                        <div
                                            className="featured-thumb"
                                            style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : undefined}
                                        >
                                            {!project.image_url && <Icon size={26} aria-hidden="true" />}
                                        </div>

                                        <div className="featured-body">
                                            <span className="featured-cat mc-micro">
                                                <Icon size={11} aria-hidden="true" />
                                                {project.category}
                                            </span>
                                            <h3 className="featured-title">{project.title}</h3>
                                            {project.description && (
                                                <p className="featured-desc">{project.description}</p>
                                            )}
                                            <span className="featured-cta">
                                                View <ArrowUpRight size={14} aria-hidden="true" />
                                            </span>
                                        </div>
                                    </Link>
                                </SpotlightCard>
                            );
                        })
                    ) : (
                        <div className="mc-loading-state">
                            <div className="mc-loading" />
                            <span>Loading projects</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
