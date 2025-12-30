import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Briefcase, GraduationCap, Code, User, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const headerRef = useRef(null);
    const sectionsRef = useRef([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profile')
                .select('*')
                .single();

            if (data) setProfile(data);
            setLoading(false);
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!loading && profile) {
            gsap.fromTo(headerRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
            );

            sectionsRef.current.forEach((el, index) => {
                if (el) {
                    gsap.fromTo(el,
                        { y: 50, opacity: 0 },
                        {
                            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                            scrollTrigger: {
                                trigger: el,
                                start: 'top 85%',
                            }
                        }
                    );
                }
            });
        }
    }, [loading, profile]);

    const addToRefs = (el) => {
        if (el && !sectionsRef.current.includes(el)) {
            sectionsRef.current.push(el);
        }
    };

    if (loading) {
        return (
            <div className="about-page" style={{ alignItems: 'center' }}>
                <Loader className="animate-spin" size={40} color="var(--accent-color)" />
            </div>
        );
    }

    if (!profile) return <div className="about-page">Profile not found.</div>;

    return (
        <div className="about-page">
            <div className="resume-container">
                {/* Header Section */}
                <header ref={headerRef} className="resume-header">
                    <div className="profile-photo-container">
                        <div className="profile-photo-placeholder"
                            style={profile.avatar_url ? { backgroundImage: `url(${profile.avatar_url})`, backgroundSize: 'cover' } : {}}>
                            {!profile.avatar_url && <User size={60} />}
                        </div>
                    </div>
                    <div className="header-content">
                        <h1>{profile.full_name}</h1>
                        <p className="subtitle">{profile.title}</p>
                        <p className="bio">{profile.bio}</p>
                        <a href={profile.resume_url || '#'} className="download-btn" target="_blank" rel="noopener noreferrer">
                            <Download size={18} />
                            Download Resume
                        </a>
                    </div>
                </header>

                {/* Experience Section */}
                <section ref={addToRefs} className="resume-section">
                    <h2><Briefcase size={24} /> Experience</h2>
                    <div className="timeline">
                        {profile.experience && profile.experience.map((job, idx) => (
                            <div className="timeline-item" key={idx}>
                                <div className="timeline-date">{job.period}</div>
                                <div className="timeline-content">
                                    <h3>{job.title}</h3>
                                    <h4 className="company">{job.company}</h4>
                                    <p>{job.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills Section */}
                <section ref={addToRefs} className="resume-section">
                    <h2><Code size={24} /> Skills</h2>
                    <div className="skills-grid">
                        {profile.skills && Object.entries(profile.skills).map(([category, items], idx) => (
                            <div className="skill-category" key={idx}>
                                <h3 style={{ textTransform: 'capitalize' }}>{category}</h3>
                                <div className="tags">
                                    {items.map((skill, sIdx) => (
                                        <span key={sIdx}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education Section */}
                <section ref={addToRefs} className="resume-section">
                    <h2><GraduationCap size={24} /> Education</h2>
                    <div className="education-item">
                        <h3>BS in Computer Science</h3>
                        <p>University of Technology • 2021</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
