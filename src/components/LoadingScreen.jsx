import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
    const containerRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress > 100) currentProgress = 100;
            setProgress(currentProgress);

            if (currentProgress === 100) {
                clearInterval(interval);
                // Mojang style fade out
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.5,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        document.body.style.overflow = 'auto';
                        onComplete();
                    }
                });
            }
        }, 150);

        return () => {
            clearInterval(interval);
            document.body.style.overflow = 'auto';
        };
    }, [onComplete]);

    return (
        <div className="mc-loading-screen" ref={containerRef}>
            <div className="mc-loader-content">
                <h1 className="mc-loader-logo">Harish V</h1>
                <div className="mc-loader-bar-container">
                    <div className="mc-loader-bar-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
