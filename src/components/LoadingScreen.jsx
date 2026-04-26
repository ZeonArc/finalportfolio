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
            // Smooth accelerating progress curve
            const remaining = 100 - currentProgress;
            const increment = Math.max(1, remaining * 0.12 + Math.random() * 5);
            currentProgress = Math.min(100, currentProgress + increment);
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
                // Cinematic fade out with scale
                gsap.to(containerRef.current, {
                    opacity: 0,
                    scale: 1.05,
                    filter: 'blur(8px)',
                    duration: 1,
                    delay: 0.4,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        document.body.style.overflow = 'auto';
                        onComplete();
                    }
                });
            }
        }, 120);

        return () => {
            clearInterval(interval);
            document.body.style.overflow = 'auto';
        };
    }, [onComplete]);

    return (
        <div className="mc-loading-screen" ref={containerRef}>
            <div className="mc-loader-content">
                <h1 className="mc-loader-logo">Harish V</h1>
                <p className="mc-loader-subtitle">Loading world...</p>
                <div className="mc-loader-bar-container">
                    <div className="mc-loader-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="mc-loader-percent">{Math.round(progress)}%</span>
            </div>
        </div>
    );
};

export default LoadingScreen;
