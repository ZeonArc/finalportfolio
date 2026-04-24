import React, { useRef, useCallback } from 'react';

const ClickSpark = ({
    children,
    sparkColor = '#4AEDD9',
    sparkCount = 6,
    sparkRadius = 15,
    sparkSize = 3,
    duration = 350,
}) => {
    const canvasRef = useRef(null);

    const handleClick = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        const x = e.clientX;
        const y = e.clientY;

        const sparks = [];
        for (let i = 0; i < sparkCount; i++) {
            const angle = (Math.PI * 2 * i) / sparkCount;
            sparks.push({
                x, y, angle,
                speed: sparkRadius * (0.5 + Math.random() * 0.5),
                size: sparkSize * (0.5 + Math.random()),
            });
        }

        const startTime = performance.now();

        const animate = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            sparks.forEach(spark => {
                const dist = spark.speed * progress;
                const sx = spark.x + Math.cos(spark.angle) * dist;
                const sy = spark.y + Math.sin(spark.angle) * dist;
                const opacity = 1 - progress;
                const size = spark.size * (1 - progress * 0.5);

                ctx.globalAlpha = opacity;
                ctx.fillStyle = sparkColor;
                ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
            });

            ctx.globalAlpha = 1;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        requestAnimationFrame(animate);
    }, [sparkColor, sparkCount, sparkRadius, sparkSize, duration]);

    return (
        <>
            <canvas
                ref={canvasRef}
                onClick={handleClick}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    zIndex: 99998,
                }}
            />
            <div onClick={handleClick}>
                {children}
            </div>
        </>
    );
};

export default ClickSpark;
