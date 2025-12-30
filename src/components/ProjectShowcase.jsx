import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProjectShowcase.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    { id: 1, title: 'Neon Racer', category: 'Game Dev', image: 'https://placehold.co/600x400/111/00f2fe?text=Game+Project' },
    { id: 2, title: 'Ethereal UI', category: 'Design', image: 'https://placehold.co/600x400/111/4facfe?text=Design+Project' },
    { id: 3, title: 'Agency Site', category: 'Web', image: 'https://placehold.co/600x400/111/00f2fe?text=Web+Project' },
    { id: 4, title: 'RPG Core', category: 'Game Dev', image: 'https://placehold.co/600x400/111/4facfe?text=Game+Core' },
];

const ProjectShowcase = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        // Title animation
        gsap.fromTo(titleRef.current,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: 'top 80%',
                }
            }
        );

        // Cards animation
        const cards = gsap.utils.toArray('.project-card');
        cards.forEach((card, i) => {
            gsap.fromTo(card,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: i * 0.2,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                    }
                }
            );
        });
    }, []);

    return (
        <div className="showcase-container" ref={containerRef}>
            <h2 className="section-title" ref={titleRef}>Selected Works</h2>
            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <div className="card-image">
                            <img src={project.image} alt={project.title} />
                            <div className="card-overlay">
                                <h3>{project.title}</h3>
                                <span>{project.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectShowcase;
