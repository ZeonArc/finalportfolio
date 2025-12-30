import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CategoryPage.css';

const Games = () => {
    const listRef = useRef(null);
    gsap.registerPlugin(ScrollTrigger);

    const games = [
        { id: 1, title: 'Neon Racer', desc: 'High speed cyberpunk racing', img: 'https://placehold.co/600x400/222/00f2fe' },
        { id: 2, title: 'Void Walker', desc: 'Atmospheric puzzle platformer', img: 'https://placehold.co/600x400/222/a044ff' },
        { id: 3, title: 'Pixel Quest', desc: 'Old school RPG adventure', img: 'https://placehold.co/600x400/222/ff9966' },
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
            <h1 className="category-title">Game Development</h1>
            <div className="category-grid" ref={listRef}>
                {games.map(g => (
                    <div key={g.id} className="category-card">
                        <div className="cat-img-wrap"><img src={g.img} alt={g.title} /></div>
                        <h2>{g.title}</h2>
                        <p>{g.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Games;
