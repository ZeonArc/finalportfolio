import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Zap, Code, ExternalLink } from 'lucide-react';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const gridRef = useRef(null);

    const categories = ['All', 'Games', 'Web', 'Design'];

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setProjects(data);
            setLoading(false);
        };
        fetchProjects();
    }, []);

    // Filter Logic
    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.category === filter);

    // Animation on Filter Change
    useEffect(() => {
        if (!loading && gridRef.current) {
            gsap.fromTo(gridRef.current.children,
                { y: 50, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        }
    }, [filter, loading]);

    return (
        <div className="projects-page">
            <div className="projects-header">
                <h1>My <span className="highlight">Work</span></h1>
                <p>Explore my portfolio across different dimensions.</p>

                <div className="filter-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="projects-grid" ref={gridRef}>
                {loading ? (
                    <div className="loading">Loading Projects...</div>
                ) : filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <div key={project.id} className="project-card glass">
                            <div
                                className="project-image"
                                style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : {}}
                            >
                                {!project.image_url && (
                                    <div className="placeholder-icon">
                                        {project.category === 'Games' && <Zap size={40} />}
                                        {project.category === 'Web' && <Layers size={40} />}
                                        {project.category === 'Design' && <Code size={40} />}
                                    </div>
                                )}
                                <div className="overlay">
                                    <a href={project.project_url || '#'} className="view-btn" target="_blank" rel="noopener noreferrer">
                                        View Project <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                            <div className="project-info">
                                <span className="category-tag">{project.category}</span>
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="tech-tags">
                                    {project.tech_stack && project.tech_stack.map((tech, i) => (
                                        <span key={i}>{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-projects">No projects found in this category.</div>
                )}
            </div>
        </div>
    );
};

export default Projects;
