import React, { useEffect } from 'react';
import anime from 'animejs';
import { Gamepad2, Ghost, Sword, Trophy } from 'lucide-react';
import './FloatingElements.css';

const FloatingElements = () => {
    useEffect(() => {
        anime({
            targets: '.float-icon',
            translateY: () => anime.random(-50, 50),
            translateX: () => anime.random(-50, 50),
            rotate: () => anime.random(-45, 45),
            scale: [0.8, 1.2],
            opacity: [0.4, 0.8],
            duration: function () { return anime.random(3000, 5000); },
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            delay: function () { return anime.random(0, 1000); }
        });
    }, []);

    return (
        <div className="floating-container">
            <div className="float-icon icon-1"><Gamepad2 size={40} /></div>
            <div className="float-icon icon-2"><Ghost size={35} /></div>
            <div className="float-icon icon-3"><Sword size={30} /></div>
            <div className="float-icon icon-4"><Trophy size={25} /></div>
        </div>
    );
};

export default FloatingElements;
