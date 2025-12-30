import React, { useEffect, useRef } from 'react';

const Background = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const animate = () => {
            time += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create a dynamic gradient using CSS variables (resolved to current values)
            const g1 = getComputedStyle(document.documentElement).getPropertyValue('--gradient-1').trim() || '#ff00cc';
            const g2 = getComputedStyle(document.documentElement).getPropertyValue('--gradient-2').trim() || '#333399';
            const g3 = getComputedStyle(document.documentElement).getPropertyValue('--gradient-3').trim() || '#00f2fe';

            // Create complex gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

            // Moving color stops
            const stop1 = (Math.sin(time) + 1) / 2;     // 0 to 1
            const stop2 = (Math.cos(time * 0.7) + 1) / 2;

            gradient.addColorStop(0, g1);
            gradient.addColorStop(0.5, g2);
            gradient.addColorStop(1, g3);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add dynamic mesh/overlay
            ctx.globalCompositeOperation = 'overlay';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                const x = Math.sin(time + i) * canvas.width * 0.5 + canvas.width * 0.5;
                const y = Math.cos(time * 0.8 + i) * canvas.height * 0.5 + canvas.height * 0.5;
                const radius = Math.sin(time * 0.5 + i) * 200 + 300;

                const radialG = ctx.createRadialGradient(x, y, 0, x, y, radius);
                radialG.addColorStop(0, 'rgba(255,255,255,0.1)');
                radialG.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.fillStyle = radialG;
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';


            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Re-run if theme changes? The animate loop reads CSS vars live, so it might handle it.

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
            }}
        />
    );
};

export default Background;
