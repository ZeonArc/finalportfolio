import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './LoadingScreen.css';

/* 5x5 chunk grid — blocks resolve as progress climbs, echoing
   Minecraft's terrain streaming in. */
const GRID = 5;
const CELLS = GRID * GRID;

/* Fixed pseudo-random fill order so chunks resolve organically
   rather than left-to-right. Deterministic — no layout shift. */
const FILL_ORDER = [12, 7, 13, 17, 11, 6, 8, 16, 18, 2, 10, 14, 22, 1, 3, 5, 9, 15, 19, 21, 23, 0, 4, 20, 24];

const LoadingScreen = ({ onComplete }) => {
    const containerRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        let current = 0;
        const interval = setInterval(() => {
            // Ease toward 100 so the tail slows down naturally
            const remaining = 100 - current;
            current = Math.min(100, current + Math.max(1.5, remaining * 0.14 + Math.random() * 4));
            setProgress(current);

            if (current >= 100) {
                clearInterval(interval);
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.7,
                    delay: 0.35,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        document.body.style.overflow = '';
                        onComplete();
                    },
                });
            }
        }, 110);

        return () => {
            clearInterval(interval);
            document.body.style.overflow = '';
        };
    }, [onComplete]);

    const cellsLit = Math.round((progress / 100) * CELLS);
    const litSet = new Set(FILL_ORDER.slice(0, cellsLit));

    return (
        <div className="mc-loading-screen" ref={containerRef} role="status" aria-live="polite">
            <div className="mc-loader-content">
                <div className="mc-loader-chunk" aria-hidden="true">
                    {Array.from({ length: CELLS }, (_, i) => (
                        <span key={i} className={`mc-chunk-cell ${litSet.has(i) ? 'is-lit' : ''}`} />
                    ))}
                </div>

                <h1 className="mc-loader-logo">HARISH V</h1>
                <p className="mc-loader-subtitle">Generating world</p>

                <div className="mc-loader-bar mc-meter">
                    <div className="mc-meter-fill" style={{ width: `${progress}%` }} />
                </div>

                <span className="mc-loader-percent">{Math.round(progress)}%</span>
                <span className="sr-only">Loading portfolio, {Math.round(progress)} percent complete</span>
            </div>
        </div>
    );
};

export default LoadingScreen;
