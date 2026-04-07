import React from 'react';
import { useLocation } from 'react-router-dom';
import Aurora from './Backgrounds/Aurora';
import Hyperspeed from './Backgrounds/Hyperspeed';
import ParticlesBg from './Backgrounds/ParticlesBg';
import StarBorderBg from './Backgrounds/StarBorderBg';
import './MinecraftBackground.css';

const MinecraftBackground = () => {
    const location = useLocation();

    // Mapping routes to specific React Bits backgrounds themed like biomes
    switch (location.pathname) {
        case '/':
            return <Aurora color1="#4AEDD9" color2="#5D8C3E" color3="#1a3a1a" speed={0.8} />;
        case '/projects':
            return <ParticlesBg particleColor="#4AEDD9" count={120} />;
        case '/about':
            return <Hyperspeed color1="#FF4500" color2="#FF6B35" speed={1.5} />;
        case '/contact':
            return <StarBorderBg color="#C77DFF" />;
        default:
            return <Aurora color1="#4AEDD9" color2="#5D8C3E" color3="#1a3a1a" speed={0.8} />;
    }
};

export default MinecraftBackground;
