import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Download, Briefcase, GraduationCap, Award, Code2,
    Github, ExternalLink, Wrench, Sparkles,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import GlitchText from '../components/GlitchText';
import ImageModal from '../components/ImageModal';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import mainAvatar from '../assets/Untitled (2).png';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

/* Proficiency for headline skills. Read from `profile.skill_levels`
   when that column exists so it stays editable in Supabase; this is
   the fallback. Values are self-assessed, not invented stats. */
const DEFAULT_SKILL_LEVELS = [
    { name: 'Unity', level: 85 },
    { name: 'C#', level: 80 },
    { name: 'React', level: 75 },
    { name: 'Python', level: 70 },
    { name: 'Three.js', level: 65 },
    { name: 'Blender', level: 55 },
];

const DEFAULT_CERTS = [
    { title: 'Unity Associate Game Developer', issuer: 'Unity', date: 'April 2026', imageUrl: '' },
    { title: 'Game Design Fundamentals', issuer: 'Epic Games', date: 'January 2026', imageUrl: '' },
    { title: 'Product Management Simulation', issuer: 'Electronic Arts', date: 'January 2026', imageUrl: '' },
];

const About = () => {
    const pageRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await supabase.from('profile').select('*').single();
            if (data) setProfile(data);
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const skillLevels = useMemo(
        () => (profile?.skill_levels?.length ? profile.skill_levels : DEFAULT_SKILL_LEVELS),
        [profile]
    );

    const certs = useMemo(
        () => (profile?.certifications?.length ? profile.certifications : DEFAULT_CERTS),
        [profile]
    );

    const skillCategories = useMemo(
        () => (profile?.skills ? Object.entries(profile.skills) : []),
        [profile]
    );

    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.about-header > *',
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
            );

            gsap.fromTo('.about-aside',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.3 }
            );

            gsap.fromTo('.about-main > *',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.4 }
            );

            /* Meters fill from zero when scrolled into view */
            gsap.utils.toArray('.skill-meter-fill').forEach((el) => {
                const target = el.dataset.level;
                gsap.fromTo(el,
                    { width: '0%' },
                    {
                        width: `${target}%`,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 92%' },
                    }
                );
            });

            gsap.fromTo('.timeline-item',
                { x: -16, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: '.about-timeline', start: 'top 85%' },
                }
            );

            gsap.fromTo('.cert-card',
                { y: 20, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power3.out',
                    scrollTrigger: { trigger: '.about-certs', start: 'top 85%' },
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, [loading, skillLevels, certs]);

    if (loading) {
        return (
            <div className="about-page mc-page about-loading">
                <div className="mc-loading" />
            </div>
        );
    }

    const name = profile?.full_name || 'Harish V';
    const role = profile?.title || 'Gameplay Programmer';

    return (
        <div className="about-page mc-page" ref={pageRef}>

            {/* ═══ HEADER ═══ */}
            <header className="about-header">
                <span className="mc-label">
                    <Sparkles size={12} aria-hidden="true" /> About
                </span>
                <h1 className="about-title">
                    <GlitchText speed={38}>{name}</GlitchText>
                </h1>
                <p className="about-role">{role}</p>
            </header>

            <div className="about-layout">

                {/* ═══ ASIDE ═══ */}
                <aside className="about-aside">
                    <ProfileCard
                        image={mainAvatar}
                        name={name}
                        role={role}
                        bio=""
                        socialLinks={
                            <>
                                {profile?.github_url && (
                                    <a href={profile.github_url} target="_blank" rel="noreferrer" className="cursor-target" aria-label="GitHub">
                                        <Github size={15} aria-hidden="true" />
                                    </a>
                                )}
                                {profile?.resume_url && (
                                    <a href={profile.resume_url} target="_blank" rel="noreferrer" className="cursor-target" aria-label="Resume">
                                        <ExternalLink size={15} aria-hidden="true" />
                                    </a>
                                )}
                            </>
                        }
                    />

                    {/* Core competencies — real skills, real levels */}
                    <section className="skill-panel mc-panel">
                        <h2 className="panel-heading">
                            <Wrench size={13} aria-hidden="true" /> Core competencies
                        </h2>

                        <ul className="skill-list">
                            {skillLevels.map((skill) => (
                                <li key={skill.name} className="skill-row">
                                    <div className="skill-row-head">
                                        <span className="skill-name">{skill.name}</span>
                                        <span className="skill-pct">{skill.level}%</span>
                                    </div>
                                    <div className="mc-meter">
                                        <div
                                            className="mc-meter-fill skill-meter-fill"
                                            data-level={skill.level}
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {profile?.resume_url && (
                        <a
                            href={profile.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mc-btn mc-btn-primary about-resume cursor-target"
                        >
                            <Download size={14} aria-hidden="true" /> Download résumé
                        </a>
                    )}
                </aside>

                {/* ═══ MAIN ═══ */}
                <div className="about-main">

                    {/* Bio */}
                    <section className="about-bio mc-panel">
                        <h2 className="panel-heading">
                            <Code2 size={13} aria-hidden="true" /> Background
                        </h2>
                        <div className="bio-text">
                            <p>
                                I am a game developer with hands-on experience in Unity, C#, and
                                AI-driven systems, focused on building immersive gameplay,
                                procedural systems, and intelligent interactions.
                            </p>
                            <p>
                                My work spans strategy games, procedural world generation, and
                                AI-powered platforms — combining game development with real-time
                                rendering and full-stack engineering.
                            </p>
                            <p>
                                I am currently looking for Unity developer, gameplay programmer,
                                or game development internship roles where I can help ship
                                engaging, scalable interactive experiences.
                            </p>
                        </div>
                    </section>

                    {/* Toolkit */}
                    {skillCategories.length > 0 && (
                        <section className="about-toolkit mc-panel">
                            <h2 className="panel-heading">
                                <Sparkles size={13} aria-hidden="true" /> Toolkit
                            </h2>
                            <div className="toolkit-groups">
                                {skillCategories.map(([category, items]) => (
                                    <div key={category} className="toolkit-group">
                                        <h3 className="toolkit-label">{category}</h3>
                                        <ul className="toolkit-tags">
                                            {items.map((skill, i) => (
                                                <li key={i} className="toolkit-tag">{skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Experience */}
                    {profile?.experience?.length > 0 && (
                        <section className="about-timeline mc-panel">
                            <h2 className="panel-heading">
                                <Briefcase size={13} aria-hidden="true" /> Experience
                            </h2>
                            <ol className="timeline">
                                {profile.experience.map((job, i) => (
                                    <li key={i} className="timeline-item">
                                        <span className="timeline-marker" aria-hidden="true" />
                                        <div className="timeline-body">
                                            <span className="timeline-period mc-micro">{job.period}</span>
                                            <h3 className="timeline-title">{job.title}</h3>
                                            <span className="timeline-company">{job.company}</span>
                                            {job.description && <p className="timeline-desc">{job.description}</p>}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}

                    {/* Education */}
                    <section className="about-education mc-panel">
                        <h2 className="panel-heading">
                            <GraduationCap size={13} aria-hidden="true" /> Education
                        </h2>
                        <div className="edu-item">
                            <div className="edu-icon mc-inset">
                                <GraduationCap size={18} aria-hidden="true" />
                            </div>
                            <div>
                                <h3 className="edu-degree">B.Tech, Computer Science and Engineering</h3>
                                <p className="edu-meta">
                                    SRM Institute of Science and Technology, Trichy · Class of 2027
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Certifications */}
                    <section className="about-certs mc-panel">
                        <h2 className="panel-heading">
                            <Award size={13} aria-hidden="true" /> Certifications
                        </h2>
                        <ul className="cert-grid">
                            {certs.map((cert, i) => {
                                const clickable = Boolean(cert.imageUrl);
                                return (
                                    <li
                                        key={i}
                                        className={`cert-card mc-slot ${clickable ? 'is-clickable cursor-target' : ''}`}
                                        onClick={() => clickable && setSelectedCert(cert)}
                                        role={clickable ? 'button' : undefined}
                                        tabIndex={clickable ? 0 : undefined}
                                        onKeyDown={(e) => {
                                            if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                                                e.preventDefault();
                                                setSelectedCert(cert);
                                            }
                                        }}
                                    >
                                        <Award size={16} className="cert-icon" aria-hidden="true" />
                                        <div className="cert-info">
                                            <h3 className="cert-title">{cert.title}</h3>
                                            <span className="cert-issuer">{cert.issuer}</span>
                                        </div>
                                        <span className="cert-date mc-micro">{cert.date}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                </div>
            </div>

            <ImageModal
                isOpen={Boolean(selectedCert)}
                imageUrl={selectedCert?.imageUrl}
                altText={selectedCert?.title}
                onClose={() => setSelectedCert(null)}
            />
        </div>
    );
};

export default About;
