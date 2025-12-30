import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const themes = {
    neon: {
        name: 'Neon Cyber',
        '--bg-color': '#050505',
        '--text-color': '#ffffff',
        '--accent-color': '#00f2fe',
        '--accent-secondary': '#4facfe',
        '--surface-color': 'rgba(255, 255, 255, 0.05)',
        '--gradient-1': '#990099', // Deeper purple/magenta
        '--gradient-2': '#1a1a5c', // Darker blue
        '--gradient-3': '#008b8b', // Teal
        '--glass-border': 'rgba(255, 255, 255, 0.08)',
        '--glass-bg': 'rgba(0, 0, 0, 0.2)',
        '--text-muted': 'rgba(255, 255, 255, 0.6)',
    },
    sunset: {
        name: 'Sunset Drive',
        '--bg-color': '#0f0205',
        '--text-color': '#fff0f5',
        '--accent-color': '#ff9966',
        '--accent-secondary': '#ff5e62',
        '--surface-color': 'rgba(180, 60, 60, 0.1)',
        '--gradient-1': '#bd4f19', // Burnt orange
        '--gradient-2': '#9e2b2b', // Deep red
        '--gradient-3': '#6a2c91', // Deeper violet
        '--glass-border': 'rgba(255, 100, 100, 0.15)',
        '--glass-bg': 'rgba(50, 10, 10, 0.3)',
        '--text-muted': 'rgba(255, 255, 255, 0.6)',
    },
    ocean: {
        name: 'Deep Ocean',
        '--bg-color': '#000428',
        '--text-color': '#e0f7fa',
        '--accent-color': '#004e92',
        '--accent-secondary': '#00c6fb',
        '--surface-color': 'rgba(0, 50, 100, 0.2)',
        '--gradient-1': '#003366', // Deep navy
        '--gradient-2': '#005b7f', // Muted steel blue
        '--gradient-3': '#004080', // Royal blue
        '--glass-border': 'rgba(0, 100, 200, 0.15)',
        '--glass-bg': 'rgba(0, 20, 60, 0.3)',
        '--text-muted': 'rgba(255, 255, 255, 0.6)',
    },
    nature: {
        name: 'Forest Zen',
        '--bg-color': '#051405',
        '--text-color': '#e0ffe0',
        '--accent-color': '#4caf50',
        '--accent-secondary': '#81c784',
        '--surface-color': 'rgba(50, 100, 50, 0.1)',
        '--gradient-1': '#1e5221', // Dark forest
        '--gradient-2': '#4c8c50', // Muted green
        '--gradient-3': '#6b8f6d', // Sage
        '--glass-border': 'rgba(76, 175, 80, 0.15)',
        '--glass-bg': 'rgba(10, 40, 10, 0.3)',
        '--text-muted': 'rgba(255, 255, 255, 0.6)',
    }
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState('neon');

    useEffect(() => {
        const theme = themes[currentTheme];
        for (const key in theme) {
            document.documentElement.style.setProperty(key, theme[key]);
        }
    }, [currentTheme]);

    const toggleTheme = (themeKey) => {
        if (themes[themeKey]) {
            setCurrentTheme(themeKey);
        }
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};
