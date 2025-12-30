import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import './HeroGrid.css';

const HeroGrid = () => {
    const gridRef = useRef(null);

    useEffect(() => {
        const grid = gridRef.current;
        const width = grid.offsetWidth;
        const height = grid.offsetHeight;
        const size = 50; // cell size
        const columns = Math.ceil(width / size);
        const rows = Math.ceil(height / size);

        // Clear previous
        grid.innerHTML = '';

        const total = columns * rows;

        for (let i = 0; i < total; i++) {
            const el = document.createElement('div');
            el.classList.add('grid-item');
            grid.appendChild(el);
        }

        const animation = anime({
            targets: '.grid-item',
            scale: [
                { value: .1, easing: 'easeOutSine', duration: 500 },
                { value: 1, easing: 'easeInOutQuad', duration: 1200 }
            ],
            delay: anime.stagger(100, { grid: [columns, rows], from: 'center' }),
            loop: false
        });

        // Mouse Interaction
        const handleMouseMove = (e) => {
            const rect = grid.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const index = Math.floor(x / size) + Math.floor(y / size) * columns;

            if (index >= 0 && index < total) {
                anime({
                    targets: grid.children[index],
                    scale: 1.5,
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
                    duration: 400,
                    easing: 'easeOutElastic(1, .5)',
                    complete: function (anim) {
                        anime({
                            targets: anim.animatables[0].target,
                            scale: 1,
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            duration: 500,
                            easing: 'easeOutExpo'
                        })
                    }
                });
            }
        };

        grid.addEventListener('mousemove', handleMouseMove);

        return () => {
            grid.removeEventListener('mousemove', handleMouseMove);
        };

    }, []);

    return (
        <div className="hero-grid" ref={gridRef}></div>
    );
};

export default HeroGrid;
