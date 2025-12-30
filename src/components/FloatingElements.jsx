import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Gamepad2, Ghost, Sword, Trophy, Joystick, Dice5, Crosshair, Sparkles } from 'lucide-react';
import './FloatingElements.css';

gsap.registerPlugin(Draggable);

const FloatingElements = () => {
    const containerRef = useRef(null);
    // Store tweens to kill them on drag
    const tweensRef = useRef([]);

    useEffect(() => {
        const icons = containerRef.current.querySelectorAll('.float-icon');
        tweensRef.current = []; // Reset tweens

        icons.forEach((icon, i) => {
            // Randomize orbit parameters
            const radius = 350 + Math.random() * 300;
            const duration = 15 + Math.random() * 10;
            const startAngle = Math.random() * 360;

            // GSAP Orbit Animation
            // We use a proxy object to animate the angle, then update x/y in onUpdate
            const proxy = { angle: startAngle };

            const orbitTween = gsap.to(proxy, {
                angle: startAngle + 360,
                duration: duration,
                repeat: -1,
                ease: 'none',
                onUpdate: () => {
                    const rad = proxy.angle * Math.PI / 180;
                    // Only update if not dragging (handled by killing tween, but double safety)
                    if (!Draggable.get(icon)?.isDragging) {
                        gsap.set(icon, {
                            x: Math.cos(rad) * radius,
                            y: Math.sin(rad) * radius,
                            rotation: proxy.angle // Rotate icon too if desired, or keep upright
                        });
                    }
                }
            });
            tweensRef.current.push(orbitTween);

            // Floating pulsing effect (Opacity/Scale)
            gsap.to(icon, {
                scale: 1.2,
                opacity: 0.8,
                duration: 2 + Math.random() * 2,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });

            // Make Draggable
            Draggable.create(icon, {
                type: 'x,y',
                inertia: true, // Bonus if available, else ignored
                onPress: function () {
                    // Kill the orbit tween for this icon so it doesn't fight
                    orbitTween.kill();
                    // Optional: Animate scale up to show interaction
                    gsap.to(this.target, { scale: 1.1, duration: 0.2 });
                },
                onRelease: function () {
                    gsap.to(this.target, { scale: 1, duration: 0.2 });
                    // Not resuming orbit - let it stay where placed
                }
            });
        });

        return () => {
            // Cleanup tweens and draggables
            tweensRef.current.forEach(t => t.kill());
            // Draggable cleanup is usually global or auto-handled but good to be safe if unmounting
        };
    }, []);

    return (
        <div className="floating-container" ref={containerRef}>
            <div className="float-icon icon-1"><Gamepad2 size={40} /></div>
            <div className="float-icon icon-2"><Ghost size={35} /></div>
            <div className="float-icon icon-3"><Sword size={30} /></div>
            <div className="float-icon icon-4"><Trophy size={25} /></div>
            <div className="float-icon icon-5"><Joystick size={38} /></div>
            <div className="float-icon icon-6"><Dice5 size={32} /></div>
            <div className="float-icon icon-7"><Crosshair size={28} /></div>
            <div className="float-icon icon-8"><Sparkles size={24} /></div>
        </div>
    );
};

export default FloatingElements;
