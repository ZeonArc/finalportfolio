import React, { useEffect, useRef } from 'react';

const SquaresBackground = ({ 
    direction = 'diagonal', 
    speed = 0.5, 
    borderColor = 'rgba(255,255,255,0.05)', 
    squareSize = 50,
    hoverFillColor = 'rgba(0, 242, 254, 0.2)'
}) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const numSquaresX = useRef(0);
    const numSquaresY = useRef(0);
    const gridOffset = useRef({ x: 0, y: 0 });
    const hoveredSquareRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
            numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const drawGrid = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

            ctx.lineWidth = 1;

            for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
                for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
                    const squareX = x - (gridOffset.current.x % squareSize);
                    const squareY = y - (gridOffset.current.y % squareSize);

                    // Draw Hovered Square
                    if (
                        hoveredSquareRef.current &&
                        Math.floor((hoveredSquareRef.current.x - (squareX - startX)) / squareSize) === 0 &&
                        Math.floor((hoveredSquareRef.current.y - (squareY - startY)) / squareSize) === 0
                    ) {
                        ctx.fillStyle = hoverFillColor;
                        ctx.fillRect(squareX, squareY, squareSize, squareSize);
                    }

                    // Setup border color (fallback to CSS vars if possible, but keep simple)
                    const g1 = getComputedStyle(document.documentElement).getPropertyValue('--glass-border').trim() || borderColor;
                    ctx.strokeStyle = g1;
                    
                    ctx.strokeRect(squareX, squareY, squareSize, squareSize);
                }
            }
        };

        const updateAnimation = () => {
            const effectiveSpeed = Math.max(speed, 0.1);
            if (direction === 'diagonal') {
                gridOffset.current.x -= effectiveSpeed;
                gridOffset.current.y -= effectiveSpeed;
            } else if (direction === 'up') {
                gridOffset.current.y -= effectiveSpeed;
            } else if (direction === 'down') {
                gridOffset.current.y += effectiveSpeed;
            } else if (direction === 'left') {
                gridOffset.current.x -= effectiveSpeed;
            } else if (direction === 'right') {
                gridOffset.current.x += effectiveSpeed;
            }

            drawGrid();
            requestRef.current = requestAnimationFrame(updateAnimation);
        };

        const handleMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

            const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x % squareSize) / squareSize);
            const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y % squareSize) / squareSize);

            hoveredSquareRef.current = { x: hoveredSquareX * squareSize, y: hoveredSquareY * squareSize };
        };

        const handleMouseLeave = () => {
            hoveredSquareRef.current = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        requestRef.current = requestAnimationFrame(updateAnimation);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(requestRef.current);
        };
    }, [direction, speed, borderColor, hoverFillColor, squareSize]);

    return (
        <canvas
            ref={canvasRef}
            className="squares-background"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -2,
                pointerEvents: 'none',
                opacity: 0.5
            }}
        />
    );
};

export default SquaresBackground;
