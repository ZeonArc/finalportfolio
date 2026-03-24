import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SplitText({ children, className = '', delay = 0, stagger = 0.05 }) {
    const textRef = useRef(null);

    useEffect(() => {
        if (!textRef.current) return;
        
        // Split text into letters
        const chars = textRef.current.querySelectorAll('.split-char');
        
        gsap.fromTo(chars, 
            { y: 50, opacity: 0, rotateX: -90 },
            { 
                y: 0, 
                opacity: 1, 
                rotateX: 0, 
                duration: 0.8, 
                stagger: stagger, 
                delay: delay, 
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 85%',
                }
            }
        );
    }, [children, delay, stagger]);

    if (typeof children !== 'string') return <span className={className}>{children}</span>;

    const words = children.split(' ');

    return (
        <span ref={textRef} className={`split-text ${className}`} style={{ display: 'inline-block', perspective: '1000px' }}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="split-word" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                    {word.split('').map((char, charIndex) => (
                        <span 
                            key={charIndex} 
                            className="split-char" 
                            style={{ display: 'inline-block', transformOrigin: '50% 50% -20px', willChange: 'transform' }}
                        >
                            {char}
                        </span>
                    ))}
                    {wordIndex !== words.length - 1 && ' '}
                </span>
            ))}
        </span>
    );
}
