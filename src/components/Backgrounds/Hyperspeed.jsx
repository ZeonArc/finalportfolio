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
        const ctx = canvas.getContext('2d');
        const stars = [];
        const numStars = 400;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '-1';
        };

        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width - canvas.width / 2,
                y: Math.random() * canvas.height - canvas.height / 2,
                z: Math.random() * 2000,
                color: Math.random() > 0.5 ? color1 : color2,
                opacity: 0
            });
        }

        let animationFrameId;

        const animate = () => {
            ctx.fillStyle = 'rgba(10, 5, 20, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            for (let i = 0; i < numStars; i++) {
                const star = stars[i];

                star.z -= 15 * speed;

                if (star.z <= 0) {
                    star.x = Math.random() * canvas.width - canvas.width / 2;
                    star.y = Math.random() * canvas.height - canvas.height / 2;
                    star.z = 2000;
                    star.opacity = 0;
                }

                star.opacity = Math.min(star.opacity + 0.05, 1);

                const k = 128.0 / star.z;
                const px = star.x * k + centerX;
                const py = star.y * k + centerY;

                const size = (1 - star.z / 2000) * 3;

                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.opacity * (1 - star.z / 2000);
                
                // Draw 2D line (trail)
                const lastK = 128.0 / (star.z + 15 * speed);
                const lastPx = star.x * lastK + centerX;
                const lastPy = star.y * lastK + centerY;

                ctx.beginPath();
                ctx.moveTo(lastPx, lastPy);
                ctx.lineTo(px, py);
                ctx.lineWidth = size * 1.5;
                ctx.strokeStyle = star.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = star.color;
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
