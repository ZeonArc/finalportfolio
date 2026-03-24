import React, { useRef, useState } from 'react';

export default function SpotlightCard({ children, className = '', spotlightColor = "rgba(255, 255, 255, 0.15)" }) {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current || isFocused) return;
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        divRef.current.style.setProperty('--mouse-x', `${x}px`);
        divRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`spotlight-card ${className}`}
            style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'inherit',
                '--spotlight-color': spotlightColor,
                height: '100%',
                width: '100%'
            }}
        >
            <div
                className="spotlight-overlay"
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: 'none',
                    background: `radial-gradient(600px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), var(--spotlight-color), transparent 40%)`,
                    zIndex: 1,
                    opacity: opacity,
                    transition: 'opacity 0.3s ease',
                }}
            />
            {children}
        </div>
    );
}
