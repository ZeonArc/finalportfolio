import React, { useEffect, useRef } from 'react';

const ParticlesBg = ({ particleColor = '#4AEDD9', count = 80 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        const particles = [];
        let w, h;
        let mouseX = -1000, mouseY = -1000;

        const resize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
        };

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        resize();

        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                radius: Math.random() * 2 + 0.5,
                vx: Math.random() * 0.3 - 0.15,
                vy: Math.random() * 0.3 - 0.15,
                alpha: Math.random() * 0.5 + 0.1,
                alphaDir: (Math.random() * 0.01) - 0.005,
            });
        }

        let animationId;
        const connectionDist = 100;
        const connectionDistSq = connectionDist * connectionDist; // Pre-compute

        const animate = () => {
            // Background fill — no radial gradient per frame, just solid
            ctx.fillStyle = '#060610';
            ctx.fillRect(0, 0, w, h);

            ctx.globalAlpha = 1;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Mouse push (simplified)
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const distSq = dx * dx + dy * dy;
                if (distSq < 14400) { // 120*120
                    const dist = Math.sqrt(distSq);
                    const force = (120 - dist) / 120 * 0.2;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                p.vx *= 0.99;
                p.vy *= 0.99;
                p.x += p.vx;
                p.y += p.vy;

                // Wrap edges
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                p.alpha += p.alphaDir;
                if (p.alpha <= 0.1 || p.alpha >= 0.6) p.alphaDir *= -1;

                // Draw particle — NO shadowBlur
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, 6.2832);
                ctx.fill();

                // Connection lines — only check forward, use squared distance
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const ldx = p.x - p2.x;
                    const ldy = p.y - p2.y;
                    const ldistSq = ldx * ldx + ldy * ldy;

                    if (ldistSq < connectionDistSq) {
                        const ldist = Math.sqrt(ldistSq);
                        ctx.globalAlpha = (1 - ldist / connectionDist) * 0.12;
                        ctx.strokeStyle = particleColor;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1;
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, [particleColor, count]);

    return <canvas ref={canvasRef} />;
};

export default ParticlesBg;
