import React, { useRef } from 'react';
import gsap from 'gsap';

export default function TiltedCard({ children, className = '', maxRotation = 15 }) {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxRotation;
        const rotateY = ((x - centerX) / centerX) * maxRotation;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.5,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out',
        });
    };

    return (
        <div 
            className={`tilted-card-wrapper ${className}`}
            style={{ perspective: 1000, display: 'flex', width: '100%', height: '100%' }}
        >
            <div
                ref={cardRef} 
                className="tilted-card-inner"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ 
                    transformStyle: 'preserve-3d', 
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%', 
                    height: '100%',
                    willChange: 'transform'
                }}
            >
                {children}
            </div>
        </div>
    );
}
