import React, { useEffect, useRef } from 'react';

const Hyperspeed = ({
    color1 = '#FF4500',
    color2 = '#C77DFF',
    speed = 1.0,
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        const stars = [];
        const numStars = 250; // Reduced from 500
        let w, h;

        const resize = () => {
            // No DPR scaling — canvas at native resolution for performance
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
        };

        window.addEventListener('resize', resize);
        resize();

        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * w - w / 2,
                y: Math.random() * h - h / 2,
                z: Math.random() * 2000,
                color: Math.random() > 0.5 ? color1 : color2,
                opacity: 0
            });
        }

        let animationFrameId;

        const animate = () => {
            // Semi-transparent trail — no shadowBlur
            ctx.fillStyle = 'rgba(8, 4, 12, 0.25)';
            ctx.fillRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;

            for (let i = 0; i < numStars; i++) {
                const star = stars[i];
                star.z -= 10 * speed;

                if (star.z <= 0) {
                    star.x = Math.random() * w - w / 2;
                    star.y = Math.random() * h - h / 2;
                    star.z = 2000;
                    star.opacity = 0;
                }

                star.opacity = Math.min(star.opacity + 0.03, 1);

                const k = 128.0 / star.z;
                const px = star.x * k + cx;
                const py = star.y * k + cy;
                const size = (1 - star.z / 2000) * 2.5;
                const alpha = star.opacity * (1 - star.z / 2000);

                const lastK = 128.0 / (star.z + 10 * speed);
                const lastPx = star.x * lastK + cx;
                const lastPy = star.y * lastK + cy;

                ctx.beginPath();
                ctx.moveTo(lastPx, lastPy);
                ctx.lineTo(px, py);
                ctx.lineWidth = size;
                ctx.strokeStyle = star.color;
                ctx.globalAlpha = alpha;
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [color1, color2, speed]);

    return <canvas ref={canvasRef} />;
};

export default Hyperspeed;
