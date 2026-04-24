import React, { useContext, useMemo } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Aurora from './Backgrounds/Aurora';
import Hyperspeed from './Backgrounds/Hyperspeed';
import ParticlesBg from './Backgrounds/ParticlesBg';
import StarBorderBg from './Backgrounds/StarBorderBg';

/* =====================================================
   BIOME-AWARE BACKGROUND — Switches based on active theme
   ===================================================== */

const THEME_BACKGROUNDS = {
    overworld: {
        Component: Aurora,
        props: { color1: '#4AEDD9', color2: '#5D8C3E', color3: '#1a3a1a', speed: 0.6 },
    },
    nether: {
        Component: Hyperspeed,
        props: { color1: '#FF4500', color2: '#FF6B35', speed: 1.2 },
    },
    end: {
        Component: StarBorderBg,
        props: { color: '#C77DFF' },
    },
    ocean: {
        Component: ParticlesBg,
        props: { particleColor: '#00BCD4', count: 100 },
    },
};

const MinecraftBackground = () => {
    const { currentTheme } = useContext(ThemeContext);

    const config = useMemo(() => {
        return THEME_BACKGROUNDS[currentTheme] || THEME_BACKGROUNDS.overworld;
    }, [currentTheme]);

    const { Component, props } = config;

    return <Component key={currentTheme} {...props} />;
};

export default React.memo(MinecraftBackground);
