import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Briefcase, GraduationCap, Code, User, Loader, Award } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SplitText from '../components/SplitText';
import SpotlightCard from '../components/SpotlightCard';
import ProfileCard from '../components/ProfileCard';
import ImageModal from '../components/ImageModal';
import profileImg from '../assets/Untitled (2).png';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const headerRef = useRef(null);
    const sectionsRef = useRef([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);

    const defaultCerts = [
        {
            title: "Unity Associate Game Developer",
            issuer: "Unity",
            date: "April 2026",
            imageUrl: "https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Solutions-Architect-Associate_badge.34195159b02fc31dfa3ca561ffdd64ba9622ad19.png"
        },
        {
            title: "Epic Games Game Design",
            issuer: "Epic Games",
            date: "Jan 2026",
            imageUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/JFDL02B4GA3U"
        },
        {
            title: "Product Management Job Simulation",
            issuer: "Electronic Arts",
            date: "Jan 2026",
            imageUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/JFDL02B4GA3U"
        },
        {
            title: "Epic Games Game Design",
            issuer: "Epic Games",
            date: "Jan 2026",
            imageUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/JFDL02B4GA3U"
        },
        {
            title: "Epic Games Game Design",
            issuer: "Epic Games",
            date: "Jan 2026",
            imageUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/JFDL02B4GA3U"
        }
    ];

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

    const certsToRender = profile.certifications || defaultCerts;

    return (
        <div className="about-page">
            <div className="resume-container">
                {/* Professional Hero Section */}
                <SpotlightCard className="bento-item about-hero-container" spotlightColor="rgba(0, 242, 254, 0.08)" style={{ marginBottom: '4rem', padding: '3rem' }}>
                    <div ref={headerRef} className="about-hero" style={{ margin: 0 }}>
                        <div className="about-hero-text">
                            <h1><SplitText delay={0.2} stagger={0.05}>{profile.full_name}</SplitText></h1>
                            <p className="subtitle">{profile.title}</p>
                            <p className="bio"><SplitText delay={0.4} stagger={0.01}>{profile.bio}</SplitText></p>
                        </div>
                        <div className="profile-card-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <ProfileCard
                                name={profile.full_name}
                                title={profile.title}
                                handle={profile.linkedin_url ? "LinkedIn" : "Connect"}
                                status="Available for work"
                                contactText="Download Resume"
                                avatarUrl={profileImg}
                                miniAvatarUrl={profileImg}
                                showUserInfo={true}
                                enableTilt={true}
                                enableMobileTilt={false}
                                onContactClick={() => {
                                    if (profile.resume_url) window.open(profile.resume_url, '_blank')
                                }}
                                behindGlowColor="rgba(0, 242, 254, 0.4)"
                                behindGlowEnabled={true}
                            />
                        </div>
                    </div>
                </SpotlightCard>

                {/* Bento Grid layout for rest of resume */}
                <div className="about-bento">
                    {/* Skills Section (Full Width) */}
                    <SpotlightCard className="bento-item bento-skills" spotlightColor="rgba(0, 242, 254, 0.08)">
                        <section ref={addToRefs}>
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
                    </SpotlightCard>

                    {/* Experience Section */}
                    <SpotlightCard className="bento-item bento-experience" spotlightColor="rgba(0, 242, 254, 0.08)">
                        <section ref={addToRefs}>
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
                    </SpotlightCard>

                    {/* Education Section */}
                    <SpotlightCard className="bento-item bento-education" spotlightColor="rgba(0, 242, 254, 0.08)">
                    <section ref={addToRefs}>
                        <h2><GraduationCap size={24} /> Education</h2>
                        <div className="education-item">
                            <h3>B.Tech in Computer Science and Engineering</h3>
                            <p>SRM Institute of Science and Technology, Trichy • 2027</p>
                        </div>
                    </section>
                    </SpotlightCard>
                    {/* Certifications Section */}
                    <SpotlightCard className="bento-item bento-certifications" spotlightColor="rgba(0, 242, 254, 0.08)">
                        <section ref={addToRefs}>
                            <h2><Award size={24} /> Certifications</h2>
                            <div className="certs-grid">
                                {certsToRender.map((cert, idx) => (
                                    <div className="cert-card" key={idx} onClick={() => setSelectedCert(cert)}>
                                        <h3>{cert.title}</h3>
                                        <span className="issuer">{cert.issuer}</span>
                                        <span className="date">{cert.date}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </SpotlightCard>
                </div>
            </div>

            <ImageModal 
                isOpen={!!selectedCert}
                imageUrl={selectedCert?.imageUrl}
                altText={selectedCert?.title}
                onClose={() => setSelectedCert(null)}
            />
        </div>
    );
};

export default About;
