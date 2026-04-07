import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Zap, Code, Search, ExternalLink, Github } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import GlitchText from '../components/GlitchText';
import DecryptedText from '../components/DecryptedText';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [hoveredProject, setHoveredProject] = useState(null);
    const gridRef = useRef(null);
    const pageRef = useRef(null);

    const categories = ['All', 'Games', 'Web', 'Design'];
    const categoryIcons = { All: '📦', Games: '⚔️', Web: '🌐', Design: '🎨' };

    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            if (data) setProjects(data);
            setLoading(false);
        };
        fetchProjects();
    }, []);

    const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

    // Page entrance
    useEffect(() => {
        if (pageRef.current) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.mc-chest-header',
                    { y: 50, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', delay: 0.3 }
                );

                gsap.fromTo('.mc-filter-tab',
                    { y: 20, opacity: 0, scale: 0.8 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, delay: 0.6, ease: 'back.out(2)' }
                );

                gsap.fromTo('.mc-inventory-container',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, delay: 0.8, ease: 'power2.out' }
                );
            }, pageRef);
            return () => ctx.revert();
        }
    }, []);

    // Animate items on filter change
    useEffect(() => {
        if (!loading && gridRef.current) {
            const items = gridRef.current.querySelectorAll('.mc-project-slot');
            gsap.fromTo(items,
                { y: 30, opacity: 0, scale: 0.85, rotateX: -10 },
                {
                    y: 0, opacity: 1, scale: 1, rotateX: 0,
                    duration: 0.5, stagger: 0.06,
                    ease: 'back.out(1.8)'
                }
            );
        }
    }, [filter, loading, filteredProjects.length]);

    // Filter click animation
    const handleFilterClick = (cat) => {
        setFilter(cat);
        // Chest opening sound effect feel
        gsap.fromTo('.mc-inventory-container',
            { scaleY: 0.98 },
            { scaleY: 1, duration: 0.3, ease: 'power2.out' }
        );
    };

    return (
        <div className="mc-projects-page" ref={pageRef}>
            <div className="mc-chest-header">
                <div className="mc-chest-title-bar">
                    <span className="mc-chest-icon">📦</span>
                    <h1>
                        <GlitchText speed={40} enableShadows={true}>Inventory</GlitchText>
                    </h1>
                </div>
                <p className="mc-chest-subtitle">
                    <DecryptedText
                        text="Browse through my collected works — each one crafted with care."
                        speed={30}
                        animateOn="view"
                    />
                </p>

                <div className="mc-filter-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`mc-filter-tab cursor-target ${filter === cat ? 'active' : ''}`}
                            onClick={() => handleFilterClick(cat)}
                        >
                            <span className="mc-tab-icon">{categoryIcons[cat]}</span>
                            <span className="mc-tab-label">{cat}</span>
                            {filter === cat && <span className="mc-tab-count">{cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length}</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mc-inventory-container">
                <div className="mc-inv-header-bar">
                    <span>⛏️ {filteredProjects.length} item{filteredProjects.length !== 1 ? 's' : ''}</span>
                    <span className="mc-inv-filter-label">{filter}</span>
                </div>

                <div className="mc-inventory-grid" ref={gridRef}>
                    {loading ? (
                        <div className="mc-loading-state">
                            <div className="mc-loading" />
                            <span>Mining projects...</span>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        filteredProjects.map((project, idx) => (
                            <SpotlightCard
                                key={project.id}
                                className="mc-project-slot cursor-target"
                                spotlightColor="rgba(74, 237, 217, 0.1)"
                            >
                                <div
                                    className="mc-slot-image"
                                    style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : {}}
                                    onMouseEnter={() => setHoveredProject(project.id)}
                                    onMouseLeave={() => setHoveredProject(null)}
                                >
                                    {!project.image_url && (
                                        <div className="mc-slot-placeholder">
                                            {project.category === 'Games' && <Zap size={32} />}
                                            {project.category === 'Web' && <Layers size={32} />}
                                            {!['Games', 'Web'].includes(project.category) && <Code size={32} />}
                                        </div>
                                    )}
                                    <div className="mc-slot-overlay">
                                        {project.project_url && (
                                            <a href={project.project_url} className="mc-slot-action cursor-target" target="_blank" rel="noopener noreferrer">
                                                <ExternalLink size={14} /> Live
                                            </a>
                                        )}
                                        {project.github_url && (
                                            <a href={project.github_url} className="mc-slot-action cursor-target" target="_blank" rel="noopener noreferrer">
                                                <Github size={14} /> Code
                                            </a>
                                        )}
                                        {!project.project_url && !project.github_url && (
                                            <span className="mc-slot-action"><Search size={14} /> Inspect</span>
                                        )}
                                    </div>
                                    <span className="mc-rarity-badge">{project.category}</span>
                                </div>
                                <div className="mc-slot-info">
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                    <div className="mc-slot-enchants">
                                        {project.tech_stack && project.tech_stack.map((tech, i) => (
                                            <span key={i} className="mc-enchant-tag">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </SpotlightCard>
                        ))
                    ) : (
                        <div className="mc-empty-slot">
                            <span className="mc-empty-icon">🚫</span>
                            <p>No items found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Projects;
