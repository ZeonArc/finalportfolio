import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export const ThemeContext = createContext();

const STORAGE_KEY = 'portfolio-biome';

/* Each biome is a full palette swap. `label` and `swatch` drive the
   picker UI; every `--` key is written to :root on change. */
const themes = {
    overworld: {
        label: 'Overworld',
        swatch: '#4AEDD9',
        '--bg-color': '#0a0e0a',
        '--bg-deep': '#050805',
        '--text-color': '#e8ffe8',
        '--text-muted': 'rgba(232, 255, 232, 0.55)',
        '--accent-color': '#4AEDD9',
        '--accent-secondary': '#17DD62',
        '--accent-glow': 'rgba(74, 237, 217, 0.3)',
        '--surface-color': 'rgba(93, 140, 62, 0.08)',
        '--glass-bg': 'rgba(10, 20, 10, 0.65)',
        '--glass-border': 'rgba(93, 140, 62, 0.15)',
        '--gradient-1': '#1a3a1a',
        '--gradient-2': '#0d2b0d',
        '--gradient-3': '#0a1f0a',
    },
    nether: {
        label: 'Nether',
        swatch: '#FF6B35',
        '--bg-color': '#140808',
        '--bg-deep': '#0a0404',
        '--text-color': '#ffe8e0',
        '--text-muted': 'rgba(255, 200, 180, 0.55)',
        '--accent-color': '#FF6B35',
        '--accent-secondary': '#FFB03A',
        '--accent-glow': 'rgba(255, 107, 53, 0.3)',
        '--surface-color': 'rgba(114, 50, 50, 0.12)',
        '--glass-bg': 'rgba(30, 10, 10, 0.7)',
        '--glass-border': 'rgba(255, 107, 53, 0.15)',
        '--gradient-1': '#3a1a1a',
        '--gradient-2': '#2b0d0d',
        '--gradient-3': '#1f0a0a',
    },
    end: {
        label: 'The End',
        swatch: '#C77DFF',
        '--bg-color': '#0a0812',
        '--bg-deep': '#050410',
        '--text-color': '#e8e0ff',
        '--text-muted': 'rgba(200, 180, 255, 0.55)',
        '--accent-color': '#C77DFF',
        '--accent-secondary': '#E0AAFF',
        '--accent-glow': 'rgba(199, 125, 255, 0.3)',
        '--surface-color': 'rgba(90, 50, 140, 0.08)',
        '--glass-bg': 'rgba(15, 10, 30, 0.7)',
        '--glass-border': 'rgba(199, 125, 255, 0.12)',
        '--gradient-1': '#1a0a3a',
        '--gradient-2': '#0d0b2b',
        '--gradient-3': '#0a081f',
    },
    ocean: {
        label: 'Ocean',
        swatch: '#00BCD4',
        '--bg-color': '#060f14',
        '--bg-deep': '#030a0e',
        '--text-color': '#e0f7fa',
        '--text-muted': 'rgba(180, 220, 255, 0.55)',
        '--accent-color': '#00BCD4',
        '--accent-secondary': '#5AD2E5',
        '--accent-glow': 'rgba(0, 188, 212, 0.3)',
        '--surface-color': 'rgba(0, 90, 130, 0.1)',
        '--glass-bg': 'rgba(5, 15, 30, 0.7)',
        '--glass-border': 'rgba(0, 188, 212, 0.12)',
        '--gradient-1': '#0a1a3a',
        '--gradient-2': '#0d1b2b',
        '--gradient-3': '#0a121f',
    },
};

const themeKeys = Object.keys(themes);

const readStoredTheme = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored && themes[stored] ? stored : 'overworld';
    } catch {
        // localStorage can throw in private browsing / sandboxed frames
        return 'overworld';
    }
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(readStoredTheme);

    useEffect(() => {
        const theme = themes[currentTheme];
        if (!theme) return;

        const root = document.documentElement;
        for (const key in theme) {
            if (key.startsWith('--')) root.style.setProperty(key, theme[key]);
        }
        root.dataset.biome = currentTheme;

        try {
            localStorage.setItem(STORAGE_KEY, currentTheme);
        } catch {
            // Non-fatal: the theme still applies for this session.
        }
    }, [currentTheme]);

    const setTheme = useCallback((key) => {
        if (themes[key]) setCurrentTheme(key);
    }, []);

    const cycleTheme = useCallback(() => {
        setCurrentTheme((prev) => {
            const next = (themeKeys.indexOf(prev) + 1) % themeKeys.length;
            return themeKeys[next];
        });
    }, []);

    const value = useMemo(
        () => ({ currentTheme, setTheme, toggleTheme: setTheme, cycleTheme, themes, themeKeys }),
        [currentTheme, setTheme, cycleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
