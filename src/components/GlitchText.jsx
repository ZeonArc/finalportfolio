import React, { useRef, useEffect, useState } from 'react';

const GlitchText = ({
  children,
  speed = 50,
  enableShadows = true,
  enableOnHover = false,
  className = '',
}) => {
  const textRef = useRef(null);
  const [isGlitching, setIsGlitching] = useState(!enableOnHover);
  const [displayText, setDisplayText] = useState(children);
  const glitchChars = '!<>-_\\/[]{}—=+*^?#_▓▒░█';

  useEffect(() => {
    if (!isGlitching) {
      setDisplayText(children);
      return;
    }

    const originalText = children;
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) return originalText[index];
            if (char === ' ') return ' ';
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join('')
      );

      if (iteration >= originalText.length) {
        clearInterval(interval);
        if (enableOnHover) {
          setTimeout(() => setIsGlitching(false), 200);
        }
      }

      iteration += 1 / 2;
    }, speed);

    return () => clearInterval(interval);
  }, [children, speed, isGlitching, enableOnHover]);

  const shadowStyle = enableShadows ? {
    textShadow: isGlitching
      ? '2px 0 var(--mc-redstone, #FF1A1A), -2px 0 var(--accent-color, #4AEDD9)'
      : 'none',
    transition: 'text-shadow 0.3s ease',
  } : {};

  return (
    <span
      ref={textRef}
      className={`glitch-text ${className}`}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-pixel)',
        ...shadowStyle,
      }}
      onMouseEnter={() => enableOnHover && setIsGlitching(true)}
    >
      {displayText}
    </span>
  );
};

export default GlitchText;
