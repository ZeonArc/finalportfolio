import React, { useContext, useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { ThemeContext } from '../context/ThemeContext';
import VoxelBackground from './Backgrounds/VoxelBackground';

/* =====================================================
   TSPARTICLES BACKGROUND — Advanced Biome Simulations
   ===================================================== */

const THEME_CONFIGS = {
    // 🌲 OVERWORLD: Blocky falling leaves and glowing fireflies
    overworld: {
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: ["#4AEDD9", "#5D8C3E", "#E8FFE8"] },
            shape: { type: ["square", "circle"] },
            opacity: {
                value: { min: 0.1, max: 0.6 },
                animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false }
            },
            size: {
                value: { min: 1, max: 6 },
                animation: { enable: true, speed: 2, minimumValue: 1, sync: false }
            },
            move: {
                enable: true,
                speed: 1,
                direction: "bottom", // Falling like leaves
                random: true, // Fireflies random jitter
                straight: false,
                outModes: { default: "out" },
                warp: true
            }
        },
        detectRetina: true,
    },

    // 🔥 NETHER: Intense upward embers and ash
    nether: {
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
            number: { value: 120, density: { enable: true, area: 800 } },
            color: { value: ["#FF4500", "#FF6B35", "#FF0000", "#FFD700"] },
            shape: { type: ["square", "triangle", "circle"] },
            opacity: {
                value: { min: 0.4, max: 0.9 },
                animation: { enable: true, speed: 3, minimumValue: 0.1, sync: false }
            },
            size: {
                value: { min: 1, max: 5 },
                animation: { enable: true, speed: 5, minimumValue: 1, sync: false }
            },
            move: {
                enable: true,
                speed: { min: 3, max: 8 }, // Fast aggressive movement
                direction: "top",
                random: true,
                straight: false,
                outModes: { default: "out" }
            }
        },
        detectRetina: true,
    },

    // 🌌 THE END: Minecraft End Dimension Static Sky & Enderman Dust
    end: {
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
            number: { value: 150, density: { enable: true, area: 800 } },
            color: { value: ["#1a0a2a", "#2b0a3a", "#C77DFF", "#9D4EDD", "#e0b0ff"] },
            shape: { type: ["square", "circle"] },
            opacity: {
                value: { min: 0.1, max: 0.7 },
                animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false }
            },
            size: {
                value: { min: 1, max: 3 }
            },
            links: {
                enable: false // Removed sci-fi connecting lines to match MC End starkness
            },
            move: {
                enable: true,
                speed: 0.2, // Extremely slow drifting to mimic static noise
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "out" }
            }
        },
        detectRetina: true,
    },

    // 🌊 OCEAN: Deep sea wobbling bubbles
    ocean: {
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: ["#00BCD4", "#48CAE4", "#90E0EF", "#FFFFFF"] },
            shape: { type: "circle" }, // Bubbles
            opacity: {
                value: { min: 0.2, max: 0.8 },
                animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
            },
            size: {
                value: { min: 2, max: 12 }, // Large varying bubbles
                animation: { enable: true, speed: 2, minimumValue: 2, sync: false }
            },
            move: {
                enable: true,
                speed: { min: 1, max: 3 },
                direction: "top", // Floating up
                random: false,
                straight: false,
                outModes: { default: "out" },
                // Add a wobble effect by using attract or path (simplifying with random direction jitter)
                trail: { enable: false }
            }
        },
        detectRetina: true,
    }
};

const MinecraftBackground = () => {
    const { currentTheme } = useContext(ThemeContext);
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const config = useMemo(() => {
        return THEME_CONFIGS[currentTheme] || THEME_CONFIGS.overworld;
    }, [currentTheme]);

    if (!init) return null;

    return (
        <>
            {/* Layer 1: 3D Floating Voxel Blocks (z-index: -2) */}
            <VoxelBackground theme={currentTheme} />

            {/* Layer 2: 2D Atmospheric Particles (z-index: -1) */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
                <Particles
                    id="tsparticles"
                    options={config}
                    key={currentTheme} // Force re-render of particles component to strictly apply complex config changes
                />
            </div>
        </>
    );
};

export default React.memo(MinecraftBackground);
