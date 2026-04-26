import React, { useEffect, useRef } from 'react';

const StarBorderBg = ({ color = '#C77DFF' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        const stars = [];
        const numStars = 120; // Reduced
        let w, h;

        const resize = () => {
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
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 2 + 0.5,
                twinkleSpeed: Math.random() * 0.03 + 0.008,
                phase: Math.random() * Math.PI * 2,
                driftX: (Math.random() - 0.5) * 0.06,
                driftY: (Math.random() - 0.5) * 0.06,
            });
        }

        let animationId;

        const animate = () => {
            // Solid fill — no gradients per frame
            ctx.fillStyle = '#080418';
            ctx.fillRect(0, 0, w, h);

            // No shadowBlur — use direct drawing only
            for (let i = 0; i < numStars; i++) {
                const star = stars[i];
                star.phase += star.twinkleSpeed;
                const alpha = Math.abs(Math.sin(star.phase));

                star.x += star.driftX;
                star.y += star.driftY;
                if (star.x < 0) star.x = w;
                if (star.x > w) star.x = 0;
                if (star.y < 0) star.y = h;
                if (star.y > h) star.y = 0;

                ctx.globalAlpha = alpha * 0.8;
                ctx.fillStyle = color;

                // Cross-shaped star (simple lines)
                const s = star.size;
                ctx.fillRect(star.x - s * 0.3, star.y - s * 2, s * 0.6, s * 4);
                ctx.fillRect(star.x - s * 2, star.y - s * 0.3, s * 4, s * 0.6);

                // Bright center
                ctx.globalAlpha = alpha * 0.4;
                ctx.fillStyle = '#fff';
                ctx.fillRect(star.x - s * 0.4, star.y - s * 0.4, s * 0.8, s * 0.8);
            }

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
