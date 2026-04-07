import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Briefcase, GraduationCap, Code, Loader, Award, Heart, Shield, Sword } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SplitText from '../components/SplitText';
import GlitchText from '../components/GlitchText';
import SpotlightCard from '../components/SpotlightCard';
import ImageModal from '../components/ImageModal';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import mainAvatar from '../assets/Untitled (2).png';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const pageRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);
    const [hoveredSkill, setHoveredSkill] = useState(null);

    const defaultCerts = [
        { title: "Unity Associate Game Developer", issuer: "Unity", date: "April 2026", imageUrl: "" },
        { title: "Epic Games Game Design", issuer: "Epic Games", date: "Jan 2026", imageUrl: "" },
        { title: "Product Management Job Simulation", issuer: "Electronic Arts", date: "Jan 2026", imageUrl: "" },
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await supabase.from('profile').select('*').single();
            if (data) setProfile(data);
            setLoading(false);
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!loading && profile && pageRef.current) {
            const ctx = gsap.context(() => {
                // Inventory opening animation
                gsap.fromTo('.inv-container',
                    { scale: 0.8, opacity: 0, y: 30 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)', delay: 0.3 }
                );

                // Player model entrance
                gsap.fromTo('.inv-player-section',
                    { x: -40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.7, delay: 0.6, ease: 'power2.out' }
                );

                // Equipment slots
                gsap.fromTo('.inv-equip-slot',
                    { scale: 0, rotateZ: -10 },
                    { scale: 1, rotateZ: 0, duration: 0.4, stagger: 0.08, delay: 0.8, ease: 'back.out(2.5)' }
                );

                // Skill items
                gsap.fromTo('.inv-skill-item',
                    { y: 15, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.3, stagger: 0.03, ease: 'power2.out',
                        scrollTrigger: { trigger: '.inv-skills-grid', start: 'top 85%' }
                    }
                );

                // Timeline items
                gsap.fromTo('.inv-quest-item',
                    { x: -20, opacity: 0 },
                    {
                        x: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out',
                        scrollTrigger: { trigger: '.inv-quest-log', start: 'top 85%' }
                    }
                );

                // Achievement unlock
                gsap.fromTo('.inv-achievement',
                    { scale: 0.5, opacity: 0 },
                    {
                        scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(2)',
                        scrollTrigger: { trigger: '.inv-achievements', start: 'top 85%' }
                    }
                );
            }, pageRef);
            return () => ctx.revert();
        }
    }, [loading, profile]);

    if (loading) {
        return (
            <div className="mc-about-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="mc-loading" />
            </div>
        );
    }
    if (!profile) return <div className="mc-about-page"><p>Profile not found.</p></div>;

    const certsToRender = profile.certifications || defaultCerts;
    const skillCategories = profile.skills ? Object.entries(profile.skills) : [];

    return (
        <div className="mc-about-page" ref={pageRef}>
            {/* === INVENTORY WINDOW === */}
            <div className="inv-container">
                {/* Title Bar */}
                <div className="inv-title-bar">
                    <span className="inv-title">⚔️ <GlitchText speed={50}>Player Inventory</GlitchText></span>
                    <span className="inv-title-sub">{profile.full_name}</span>
                </div>

                {/* Main Inventory Grid */}
                <div className="inv-main">
                    {/* Left: Player Model + Equipment */}
                    {/* Left: Profile Card Wrapper */}
                    <div className="inv-player-section">
                        <div className="inv-player-model">
                            <ProfileCard 
                                image={mainAvatar}
                                name={profile.full_name || "Harish V"}
                                role={profile.title || "Game Developer"}
                                bio="" 
                                socialLinks={
                                    <>
                                        {profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" className="mc-slot-action cursor-target"><Code size={14}/></a>}
                                        {profile.resume_url && <a href={profile.resume_url} target="_blank" rel="noreferrer" className="mc-slot-action cursor-target"><Download size={14}/></a>}
                                    </>
                                }
                            />
                        </div>

                        {/* Player Stats */}
                        <div className="inv-player-stats">
                            <div className="inv-stat-row">
                                <Heart size={14} className="inv-stat-icon heart" />
                                <span className="inv-stat-name">HP</span>
                                <div className="inv-stat-bar">
                                    <div className="inv-stat-fill hp" style={{ width: '100%' }} />
                                </div>
                                <span className="inv-stat-val">20/20</span>
                            </div>
                            <div className="inv-stat-row">
                                <Shield size={14} className="inv-stat-icon armor" />
                                <span className="inv-stat-name">DEF</span>
                                <div className="inv-stat-bar">
                                    <div className="inv-stat-fill armor" style={{ width: '80%' }} />
                                </div>
                                <span className="inv-stat-val">16</span>
                            </div>
                            <div className="inv-stat-row">
                                <Sword size={14} className="inv-stat-icon attack" />
                                <span className="inv-stat-name">ATK</span>
                                <div className="inv-stat-bar">
                                    <div className="inv-stat-fill attack" style={{ width: '90%' }} />
                                </div>
                                <span className="inv-stat-val">18</span>
                            </div>
                            <div className="inv-xp-section">
                                <span className="inv-xp-label">XP Level 99</span>
                                <div className="xp-bar"><div className="xp-bar-fill" style={{ width: '85%' }} /></div>
                            </div>
                        </div>

                        {/* Resume button */}
                        {profile.resume_url && (
                            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="inv-resume-btn cursor-target">
                                <Download size={14} /> Download Resume
                            </a>
                        )}
                    </div>

                    {/* Right: Inventory Slots (Skills) */}
                    <div className="inv-right-section">
                        <div className="inv-description-box mc-slot">
                            <h4 className="inv-desc-title">📖 Quest Log: About Me</h4>
                            <p className="inv-desc-text">
                                {profile.bio || "Crafting immersive worlds and pixel perfect interactions."}
                            </p>
                        </div>

                        <div className="inv-section-tab">
                            <Code size={14} /> Enchantments (Skills)
                        </div>
                        <div className="inv-skills-grid">
                            {skillCategories.map(([category, items], catIdx) => (
                                <div className="inv-skill-category" key={catIdx}>
                                    <h4 className="inv-cat-label">{category}</h4>
                                    <div className="inv-skill-slots">
                                        {items.map((skill, sIdx) => (
                                            <div
                                                className="inv-skill-item mc-slot enchanted cursor-target"
                                                key={sIdx}
                                                onMouseEnter={() => setHoveredSkill(`${catIdx}-${sIdx}`)}
                                                onMouseLeave={() => setHoveredSkill(null)}
                                            >
                                                <span className="inv-skill-name">{skill}</span>
                                                {hoveredSkill === `${catIdx}-${sIdx}` && (
                                                    <div className="inv-skill-tooltip mc-tooltip">
                                                        <span style={{ color: '#C77DFF' }}>{skill}</span><br />
                                                        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Enchantment Level V</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* === QUEST LOG (Experience) === */}
                <div className="inv-quest-log">
                    <div className="inv-section-tab">
                        <Briefcase size={14} /> Quest Log (Experience)
                    </div>
                    <div className="inv-quest-items">
                        {profile.experience && profile.experience.map((job, idx) => (
                            <div className="inv-quest-item mc-slot" key={idx}>
                                <div className="inv-quest-status">
                                    <span className="inv-quest-check">✅</span>
                                </div>
                                <div className="inv-quest-info">
                                    <span className="inv-quest-period">{job.period}</span>
                                    <h4 className="inv-quest-title">{job.title}</h4>
                                    <span className="inv-quest-company">{job.company}</span>
                                    <p className="inv-quest-desc">{job.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* === EDUCATION === */}
                <div className="inv-education">
                    <div className="inv-section-tab">
                        <GraduationCap size={14} /> Knowledge
                    </div>
                    <div className="inv-edu-item mc-slot">
                        <span className="inv-edu-icon">📚</span>
                        <div>
                            <h4>B.Tech in Computer Science and Engineering</h4>
                            <p>SRM Institute of Science and Technology, Trichy • 2027</p>
                        </div>
                    </div>
                </div>

                {/* === ACHIEVEMENTS === */}
                <div className="inv-achievements">
                    <div className="inv-section-tab">
                        <Award size={14} /> Achievements Unlocked
                    </div>
                    <div className="inv-achievements-grid">
                        {certsToRender.map((cert, idx) => (
                            <div
                                className="inv-achievement mc-slot cursor-target"
                                key={idx}
                                onClick={() => cert.imageUrl && setSelectedCert(cert)}
                            >
                                <div className="inv-ach-icon">🏆</div>
                                <div className="inv-ach-info">
                                    <h4>{cert.title}</h4>
                                    <span className="inv-ach-issuer">{cert.issuer}</span>
                                    <span className="inv-ach-date">{cert.date}</span>
                                </div>
                                <div className="inv-ach-unlocked">UNLOCKED</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ImageModal isOpen={!!selectedCert} imageUrl={selectedCert?.imageUrl} altText={selectedCert?.title} onClose={() => setSelectedCert(null)} />
        </div>
    );
};

export default About;
