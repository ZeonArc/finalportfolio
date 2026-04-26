import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { generateTexture } from '../../utils/TextureGenerator';

// A single block that rotates and floats
const FloatingBlock = ({ position, textures, speed, offset }) => {
    const meshRef = useRef();
    
    // Load textures
    const [textureMap, topTextureMap] = useMemo(() => {
        const loader = new THREE.TextureLoader();
        const main = loader.load(textures.main);
        main.magFilter = THREE.NearestFilter; // Pixelated look
        main.minFilter = THREE.NearestFilter;
        
        let top = main;
        if (textures.top) {
            top = loader.load(textures.top);
            top.magFilter = THREE.NearestFilter;
            top.minFilter = THREE.NearestFilter;
        }
        return [main, top];
    }, [textures]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime() + offset;
        // Fluid continuous rotation
        meshRef.current.rotation.x = t * speed * 0.2;
        meshRef.current.rotation.y = t * speed * 0.3;
        // Fluid drifting in 3D space
        meshRef.current.position.y = position[1] + Math.sin(t * speed) * 2;
        meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.8) * 1.5;
    });

    return (
        <mesh ref={meshRef} position={position} scale={[1.5, 1.5, 1.5]}>
            <boxGeometry args={[1, 1, 1]} />
            {/* Array of materials for a cube: right, left, top, bottom, front, back */}
            <meshStandardMaterial attach="material-0" map={textureMap} />
            <meshStandardMaterial attach="material-1" map={textureMap} />
            <meshStandardMaterial attach="material-2" map={topTextureMap} />
            <meshStandardMaterial attach="material-3" map={textureMap} />
            <meshStandardMaterial attach="material-4" map={textureMap} />
            <meshStandardMaterial attach="material-5" map={textureMap} />
        </mesh>
    );
};

// Scene holding multiple blocks
const VoxelScene = ({ theme }) => {
    const groupRef = useRef();
    
    // Interactive mouse tracking
    useFrame((state) => {
        if (groupRef.current) {
            // Lerp the scene rotation towards the mouse position
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.mouse.y * 0.1, 0.05);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.1, 0.05);
        }
    });

    // Define blocks per theme
    const config = useMemo(() => {
        switch (theme) {
            case 'overworld':
                return {
                    blocks: [
                        { main: generateTexture('grass_side'), top: generateTexture('grass_top') },
                        { main: generateTexture('dirt') }
                    ],
                    ambientLight: 0.8,
                    dirLightColor: '#ffffff'
                };
            case 'nether':
                return {
                    blocks: [
                        { main: generateTexture('netherrack') },
                        { main: generateTexture('magma') }
                    ],
                    ambientLight: 0.3,
                    dirLightColor: '#ff4500'
                };
            case 'end':
                return {
                    blocks: [
                        { main: generateTexture('end_stone') },
                        { main: generateTexture('obsidian') }
                    ],
                    ambientLight: 0.2,
                    dirLightColor: '#c77dff'
                };
            case 'ocean':
                return {
                    blocks: [
                        { main: generateTexture('prismarine') },
                        { main: generateTexture('sea_lantern') }
                    ],
                    ambientLight: 0.5,
                    dirLightColor: '#00bcd4'
                };
            default:
                return { blocks: [{ main: generateTexture('dirt') }], ambientLight: 1, dirLightColor: '#fff' };
        }
    }, [theme]);

    // Generate random positions for more blocks, spread wider
    const instances = useMemo(() => {
        return Array.from({ length: 25 }).map(() => ({
            position: [
                (Math.random() - 0.5) * 40, // Wider x spread
                (Math.random() - 0.5) * 30, // Wider y spread
                -10 - Math.random() * 20     // Deeper z spread
            ],
            speed: 0.2 + Math.random() * 0.5,
            offset: Math.random() * 100,
            textureObj: config.blocks[Math.floor(Math.random() * config.blocks.length)]
        }));
    }, [config]);

    return (
        <>
            <ambientLight intensity={config.ambientLight} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color={config.dirLightColor} />
            
            {/* Optional subtle fog for depth */}
            <fog attach="fog" args={['#000', 10, 40]} />

            <group ref={groupRef}>
                {instances.map((props, i) => (
                    <FloatingBlock 
                        key={i} 
                        position={props.position} 
                        textures={props.textureObj} 
                        speed={props.speed}
                        offset={props.offset}
                    />
                ))}
            </group>
        </>
    );
};

const VoxelBackground = ({ theme }) => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 0], fov: 60 }}>
                <VoxelScene theme={theme} />
            </Canvas>
        </div>
    );
};

export default VoxelBackground;
