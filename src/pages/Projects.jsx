import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Gamepad2, Globe, Palette, LayoutGrid, ExternalLink, Github,
    Code2, Image as ImageIcon, X, PackageOpen, Search,
} from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import GlitchText from '../components/GlitchText';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
    { key: 'All', Icon: LayoutGrid },
    { key: 'Games', Icon: Gamepad2 },
    { key: 'Web', Icon: Globe },
    { key: 'Design', Icon: Palette },
];

const CATEGORY_ICON = { Games: Gamepad2, Web: Globe, Design: Palette };

const Projects = () => {
    const [activeMode, setActiveMode] = useState('development');

    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    const [artworks, setArtworks] = useState([]);
    const [artworksLoading, setArtworksLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const pageRef = useRef(null);
    const gridRef = useRef(null);
    const artGridRef = useRef(null);

    /* Legacy rows stored Vite source paths; map them to public/ URLs. */
    const resolveImageUrl = useCallback((url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return url.replace(/^\/?src\/assets\//, '/');
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const [{ data: projData }, { data: artData }] = await Promise.all([
                supabase.from('projects').select('*').order('created_at', { ascending: false }),
                supabase.from('artworks').select('*').order('created_at', { ascending: false }),
            ]);
            if (projData) setProjects(projData);
            setLoading(false);
            if (artData) setArtworks(artData);
            setArtworksLoading(false);
        };
        fetchData();
    }, []);

    const filteredProjects = useMemo(
        () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
        [projects, filter]
    );

    const countFor = useCallback(
        (cat) => (cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length),
        [projects]
    );

    /* Page entrance */
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.projects-header > *',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
            );
        }, pageRef);
        return () => ctx.revert();
    }, []);

    /* Re-stagger cards when the filter or mode changes */
    useEffect(() => {
        if (activeMode !== 'development' || loading || !gridRef.current) return;
        const items = gridRef.current.querySelectorAll('.project-card');
        if (!items.length) return;
        gsap.fromTo(items,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.42, stagger: 0.05, ease: 'power3.out', overwrite: true }
        );
    }, [filter, loading, filteredProjects.length, activeMode]);

    useEffect(() => {
        if (activeMode !== 'artworks' || artworksLoading || !artGridRef.current) return;
        const items = artGridRef.current.querySelectorAll('.artwork-card');
        if (!items.length) return;
        gsap.fromTo(items,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out', overwrite: true }
        );
    }, [activeMode, artworksLoading, artworks.length]);

    /* Lightbox: lock scroll and close on Escape */
    useEffect(() => {
        if (!selectedImage) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKey = (e) => e.key === 'Escape' && setSelectedImage(null);
        document.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener('keydown', onKey);
        };
    }, [selectedImage]);

    const isDev = activeMode === 'development';

    return (
        <div className="projects-page mc-page" ref={pageRef}>

            {/* ═══ HEADER ═══ */}
            <header className="projects-header">
                <span className="mc-label">
                    {isDev ? <Code2 size={12} aria-hidden="true" /> : <ImageIcon size={12} aria-hidden="true" />}
                    {isDev ? 'Development' : 'Gallery'}
                </span>

                <h1 className="projects-title">
                    <GlitchText speed={38}>{isDev ? 'Work' : 'Artworks'}</GlitchText>
                </h1>

                <p className="projects-sub">
                    {isDev
                        ? 'Games, tools, and web systems I have designed and built.'
                        : 'Digital paintings, concept art, and 3D renders.'}
                </p>

                {/* Mode toggle */}
                <div className="mode-toggle mc-inset" role="tablist" aria-label="Content type">
                    <span className={`mode-indicator ${activeMode}`} aria-hidden="true" />
                    <button
                        role="tab"
                        aria-selected={isDev}
                        className={`mode-btn cursor-target ${isDev ? 'active' : ''}`}
                        onClick={() => setActiveMode('development')}
                    >
                        <Code2 size={14} aria-hidden="true" /> Development
                    </button>
                    <button
                        role="tab"
                        aria-selected={!isDev}
                        className={`mode-btn cursor-target ${!isDev ? 'active' : ''}`}
                        onClick={() => setActiveMode('artworks')}
                    >
                        <ImageIcon size={14} aria-hidden="true" /> Artworks
                    </button>
                </div>

                {/* Category filters */}
                {isDev && (
                    <div className="filter-row" role="group" aria-label="Filter by category">
                        {CATEGORIES.map(({ key, Icon }) => {
                            const active = filter === key;
                            const count = countFor(key);
                            return (
                                <button
                                    key={key}
                                    className={`filter-tab cursor-target ${active ? 'active' : ''}`}
                                    onClick={() => setFilter(key)}
                                    aria-pressed={active}
                                >
                                    <Icon size={13} aria-hidden="true" />
                                    <span>{key}</span>
                                    <span className="filter-count">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </header>

            {/* ═══ DEVELOPMENT ═══ */}
            {isDev && (
                <section className="projects-panel mc-panel">
                    <div className="panel-bar">
                        <span className="mc-micro">
                            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                        </span>
                        <span className="mc-micro panel-bar-filter">{filter}</span>
                    </div>

                    <div className="projects-grid" ref={gridRef}>
                        {loading ? (
                            <div className="mc-loading-state">
                                <div className="mc-loading" />
                                <span>Loading projects</span>
                            </div>
                        ) : filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => {
                                const Icon = CATEGORY_ICON[project.category] || Code2;
                                return (
                                    <SpotlightCard
                                        key={project.id}
                                        className="project-card mc-slot"
                                        spotlightColor="rgba(255, 255, 255, 0.06)"
                                    >
                                        <article className="project-inner">
                                            <div
                                                className="project-thumb"
                                                style={project.image_url ? { backgroundImage: `url(${resolveImageUrl(project.image_url)})` } : undefined}
                                            >
                                                {!project.image_url && <Icon size={30} aria-hidden="true" />}

                                                <span className="project-badge mc-micro">
                                                    <Icon size={10} aria-hidden="true" />
                                                    {project.category}
                                                </span>

                                                <div className="project-overlay">
                                                    {project.project_url && (
                                                        <a
                                                            href={project.project_url}
                                                            className="project-action cursor-target"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <ExternalLink size={13} aria-hidden="true" /> Live
                                                        </a>
                                                    )}
                                                    {project.github_url && (
                                                        <a
                                                            href={project.github_url}
                                                            className="project-action cursor-target"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Github size={13} aria-hidden="true" /> Code
                                                        </a>
                                                    )}
                                                    {!project.project_url && !project.github_url && (
                                                        <span className="project-action is-static">
                                                            <Search size={13} aria-hidden="true" /> Case study soon
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="project-body">
                                                <h3 className="project-title">{project.title}</h3>
                                                {project.description && (
                                                    <p className="project-desc">{project.description}</p>
                                                )}

                                                {project.tech_stack?.length > 0 && (
                                                    <ul className="project-tags">
                                                        {project.tech_stack.map((tech, i) => (
                                                            <li key={i} className="project-tag">{tech}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </article>
                                    </SpotlightCard>
                                );
                            })
                        ) : (
                            <div className="mc-empty">
                                <PackageOpen size={38} aria-hidden="true" />
                                <p>No projects in this category yet.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ═══ ARTWORKS ═══ */}
            {!isDev && (
                <section className="artworks-panel">
                    {artworksLoading ? (
                        <div className="mc-loading-state">
                            <div className="mc-loading" />
                            <span>Loading gallery</span>
                        </div>
                    ) : artworks.length > 0 ? (
                        <div className="artworks-grid" ref={artGridRef}>
                            {artworks.map((art) => (
                                <button
                                    key={art.id}
                                    className="artwork-card mc-slot cursor-target"
                                    onClick={() => setSelectedImage(art)}
                                    aria-label={`View ${art.title}`}
                                >
                                    <img
                                        src={resolveImageUrl(art.image_url)}
                                        alt={art.title}
                                        className="artwork-image"
                                        loading="lazy"
                                    />
                                    <span className="artwork-overlay">
                                        <span className="artwork-title">{art.title}</span>
                                        {art.category && (
                                            <span className="artwork-cat mc-micro">{art.category}</span>
                                        )}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="mc-empty">
                            <ImageIcon size={38} aria-hidden="true" />
                            <p>No artworks published yet.</p>
                        </div>
                    )}
                </section>
            )}

            {/* ═══ LIGHTBOX ═══ */}
            {selectedImage && (
                <div
                    className="lightbox"
                    onClick={() => setSelectedImage(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedImage.title}
                >
                    <div className="lightbox-inner mc-panel" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="lightbox-close cursor-target"
                            onClick={() => setSelectedImage(null)}
                            aria-label="Close"
                            autoFocus
                        >
                            <X size={18} aria-hidden="true" />
                        </button>

                        <img
                            src={resolveImageUrl(selectedImage.image_url)}
                            alt={selectedImage.title}
                            className="lightbox-image"
                        />

                        <div className="lightbox-info">
                            <h2 className="lightbox-title">{selectedImage.title}</h2>
                            {selectedImage.description && <p>{selectedImage.description}</p>}
                            {selectedImage.category && (
                                <span className="lightbox-tag mc-micro">{selectedImage.category}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
