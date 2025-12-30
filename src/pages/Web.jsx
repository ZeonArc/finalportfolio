import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CategoryPage.css';

const Web = () => {
    const listRef = useRef(null);
    gsap.registerPlugin(ScrollTrigger);

    const webs = [
        { id: 1, title: 'Corporate One', desc: 'Modern business portfolio', img: 'https://placehold.co/600x400/222/00f2fe' },
        { id: 2, title: 'E-Shop Pro', desc: 'Full stack classic commerce', img: 'https://placehold.co/600x400/222/4facfe' },
        { id: 3, title: 'Blog Starlight', desc: 'CMS based blog platform', img: 'https://placehold.co/600x400/222/ff5e62' },
    ];

    useEffect(() => {
        gsap.fromTo('.category-card',
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, stagger: 0.1, duration: 0.8,
                scrollTrigger: { trigger: listRef.current, start: 'top 80%' }
            }
        );
    }, []);

    return (
        <div className="category-page">
            <h1 className="category-title">Web Projects</h1>
            <div className="category-grid" ref={listRef}>
                {webs.map(w => (
                    <div key={w.id} className="category-card">
                        <div className="cat-img-wrap"><img src={w.img} alt={w.title} /></div>
                        <h2>{w.title}</h2>
                        <p>{w.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Web;
