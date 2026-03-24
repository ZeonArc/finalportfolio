import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Magnet({ children, padding = 100, disabled = false, magnetStrength = 0.5, className = "" }) {
    const magnetRef = useRef(null);

    useEffect(() => {
        const magnet = magnetRef.current;
        if (!magnet || disabled) return;

        const handleMouseMove = (e) => {
            const { left, top, width, height } = magnet.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;

            // Check if within padding distance
            if (Math.abs(distX) < width / 2 + padding && Math.abs(distY) < height / 2 + padding) {
                gsap.to(magnet, {
                    x: distX * magnetStrength,
                    y: distY * magnetStrength,
                    duration: 0.4,
                    ease: "power2.out",
                });
            } else {
                gsap.to(magnet, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
            }
        };

        const handleMouseLeave = () => {
            gsap.to(magnet, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
        };

        window.addEventListener("mousemove", handleMouseMove);
        magnet.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            magnet.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [padding, disabled, magnetStrength]);

    return (
        <div ref={magnetRef} className={className} style={{ display: "inline-block" }}>
            {children}
        </div>
    );
}
