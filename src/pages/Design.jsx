import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CategoryPage.css';

const Design = () => {
    const listRef = useRef(null);
    gsap.registerPlugin(ScrollTrigger);

    const designs = [
        { id: 1, title: 'App UI Kit', desc: 'Mobile first design system', img: 'https://placehold.co/600x400/222/a044ff' },
        { id: 2, title: 'Brand Identity', desc: 'Logo and stationary pack', img: 'https://placehold.co/600x400/222/00f2fe' },
        { id: 3, title: '3D Mockups', desc: 'Blender rendered assets', img: 'https://placehold.co/600x400/222/ff9966' },
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
            <h1 className="category-title">Design Gallery</h1>
            <div className="category-grid" ref={listRef}>
                {designs.map(d => (
                    <div key={d.id} className="category-card">
                        <div className="cat-img-wrap"><img src={d.img} alt={d.title} /></div>
                        <h2>{d.title}</h2>
                        <p>{d.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Design;
