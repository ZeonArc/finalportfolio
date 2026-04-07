import React, { useEffect, useRef } from 'react';

const StarBorderBg = ({ color = '#C77DFF' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const stars = [];
        const numStars = 150;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '-1';
            canvas.style.background = '#050410'; 
        };

        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                twinkleSpeed: Math.random() * 0.05 + 0.01,
                alpha: Math.random(),
            });
        }

        let animationId;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw nebula background
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width
            );
            gradient.addColorStop(0, '#1a0530');
            gradient.addColorStop(1, '#050410');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.alpha += star.twinkleSpeed;
                const currentAlpha = Math.abs(Math.sin(star.alpha));

                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.globalAlpha = currentAlpha;
                ctx.shadowColor = color;
                ctx.shadowBlur = star.size * 5;

                // Create cross-shaped stars
                ctx.moveTo(star.x, star.y - star.size * 2);
                ctx.lineTo(star.x + star.size * 0.5, star.y);
                ctx.lineTo(star.x, star.y + star.size * 2);
                ctx.lineTo(star.x - star.size * 0.5, star.y);
                ctx.fill();

                // Center dot
                ctx.fillRect(star.x - star.size/2, star.y - star.size/2, star.size, star.size);
            });

            ctx.globalAlpha = 1;
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [color]);

    return <canvas ref={canvasRef} />;
};

export default StarBorderBg;
