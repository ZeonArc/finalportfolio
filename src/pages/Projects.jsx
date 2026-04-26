import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Zap, Code, Search, ExternalLink, Github, Code2, Image as ImageIcon, X } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import GlitchText from '../components/GlitchText';
import DecryptedText from '../components/DecryptedText';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
    // Mode: 'development' or 'artworks'
    const [activeMode, setActiveMode] = useState('development');
    
    // Development State
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    // Artworks State
    const [artworks, setArtworks] = useState([]);
    const [artworksLoading, setArtworksLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const resolveImageUrl = (url) => {
        if (!url) return '';
        // If it's a full URL, return it
        if (url.startsWith('http')) return url;
        // If it starts with /src/assets/, rewrite it to /
        if (url.startsWith('/src/assets/')) {
            return url.replace('/src/assets/', '/');
        }
        // If it starts with src/assets/, rewrite it
        if (url.startsWith('src/assets/')) {
            return url.replace('src/assets/', '/');
        }
        return url;
    };

    const gridRef = useRef(null);
    const artworksGridRef = useRef(null);
    const pageRef = useRef(null);

    const categories = ['All', 'Games', 'Web', 'Design'];
    const categoryIcons = { All: '📦', Games: '⚔️', Web: '🌐', Design: '🎨' };

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Projects
            const { data: projData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            if (projData) setProjects(projData);
            setLoading(false);

            // Fetch Artworks
            const { data: artData } = await supabase.from('artworks').select('*').order('created_at', { ascending: false });
            if (artData) setArtworks(artData);
            setArtworksLoading(false);
        };
        fetchData();
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

                gsap.fromTo('.mc-mode-toggle',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, delay: 0.5, ease: 'power2.out' }
                );

                gsap.fromTo('.mc-inventory-container, .mc-artworks-container',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, delay: 0.6, ease: 'power2.out' }
                );
            }, pageRef);
            return () => ctx.revert();
        }
    }, []);

    // Animate items on filter change (Development mode)
    useEffect(() => {
        if (activeMode === 'development' && !loading && gridRef.current) {
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
    }, [filter, loading, filteredProjects.length, activeMode]);

    // Animate items on mode change (Artworks mode)
    useEffect(() => {
        if (activeMode === 'artworks' && artworksGridRef.current) {
            const items = artworksGridRef.current.querySelectorAll('.mc-artwork-card');
            gsap.fromTo(items,
                { y: 30, opacity: 0, scale: 0.9 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 0.6, stagger: 0.08,
                    ease: 'back.out(1.5)'
                }
            );
        }
    }, [activeMode]);

    // Filter click animation
    const handleFilterClick = (cat) => {
        setFilter(cat);
        gsap.fromTo('.mc-inventory-container',
            { scaleY: 0.98 },
            { scaleY: 1, duration: 0.3, ease: 'power2.out' }
        );
    };

    // Mode switch animation
    const handleModeSwitch = (mode) => {
        if (mode === activeMode) return;
        setActiveMode(mode);
    };

    // Modal controls
    const openModal = (art) => {
        setSelectedImage(art);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="mc-projects-page" ref={pageRef}>
            <div className="mc-chest-header">
                <div className="mc-chest-title-bar">
                    <span className="mc-chest-icon">{activeMode === 'development' ? '📦' : '🖼️'}</span>
                    <h1>
                        <GlitchText speed={40} enableShadows={true}>
                            {activeMode === 'development' ? 'Inventory' : 'Gallery'}
                        </GlitchText>
                    </h1>
                </div>
                <p className="mc-chest-subtitle">
                    <DecryptedText
                        text={activeMode === 'development' 
                            ? "Browse through my collected works — each one crafted with care." 
                            : "A collection of digital paintings, concept art, and 3D renders."}
                        speed={30}
                        animateOn="view"
                        key={activeMode} // Re-trigger animation on switch
                    />
                </p>

                {/* Mode Toggle Slider */}
                <div className="mc-mode-toggle">
                    <div className="mc-toggle-track">
                        <div className={`mc-toggle-indicator ${activeMode}`} />
                        <button 
                            className={`mc-toggle-btn cursor-target ${activeMode === 'development' ? 'active' : ''}`}
                            onClick={() => handleModeSwitch('development')}
                        >
                            <Code2 size={16} />
                            <span>Development</span>
                        </button>
                        <button 
                            className={`mc-toggle-btn cursor-target ${activeMode === 'artworks' ? 'active' : ''}`}
                            onClick={() => handleModeSwitch('artworks')}
                        >
                            <ImageIcon size={16} />
                            <span>Artworks</span>
                        </button>
                    </div>
                </div>

                {activeMode === 'development' && (
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
                )}
            </div>

            {/* DEVELOPMENT MODE CONTENT */}
            {activeMode === 'development' && (
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
            )}

            {/* ARTWORKS MODE CONTENT */}
            {activeMode === 'artworks' && (
                <div className="mc-artworks-container">
                    {artworksLoading ? (
                        <div className="mc-loading-state">
                            <div className="mc-loading" />
                            <span>Loading gallery...</span>
                        </div>
                    ) : artworks.length > 0 ? (
                        <div className="mc-masonry-grid" ref={artworksGridRef}>
                            {artworks.map((art) => (
                                <div 
                                    key={art.id} 
                                    className="mc-artwork-card cursor-target"
                                    onClick={() => openModal(art)}
                                >
                                    <div className="mc-artwork-image-container">
                                        <img 
                                            src={resolveImageUrl(art.image_url)} 
                                            alt={art.title} 
                                            className="mc-artwork-image" 
                                            loading="lazy" 
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found' }}
                                        />
                                        <div className="mc-artwork-overlay">
                                            <h3 className="mc-artwork-title">{art.title}</h3>
                                            <span className="mc-artwork-category">{art.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mc-empty-slot">
                            <span className="mc-empty-icon">🚫</span>
                            <p>No artworks found.</p>
                        </div>
                    )}

                    {/* Lightbox Modal */}
                    {selectedImage && (
                        <div className="mc-lightbox" onClick={closeModal}>
                            <div className="mc-lightbox-content" onClick={(e) => e.stopPropagation()}>
                                <button className="mc-lightbox-close cursor-target" onClick={closeModal} aria-label="Close">
                                    <X size={24} />
                                </button>
                                <img 
                                    src={resolveImageUrl(selectedImage.image_url)} 
                                    alt={selectedImage.title} 
                                    className="mc-lightbox-image" 
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found' }}
                                />
                                <div className="mc-lightbox-info">
                                    <h2>{selectedImage.title}</h2>
                                    <p>{selectedImage.description}</p>
                                    <span className="mc-lightbox-tag">{selectedImage.category}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Projects;
