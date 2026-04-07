import React, { useRef, useEffect, useState } from 'react';

const DecryptedText = ({
    text = '',
    speed = 50,
    maxIterations = 10,
    revealDirection = 'start',
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    parentClassName = '',
    encryptedClassName = '',
    decryptedClassName = '',
    onDecryptionComplete,
    animateOn = 'view',
}) => {
    const [displayText, setDisplayText] = useState(text);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [hasDecrypted, setHasDecrypted] = useState(false);
    const containerRef = useRef(null);

    const decrypt = () => {
        if (isDecrypting || hasDecrypted) return;
        setIsDecrypting(true);

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(
                text.split('').map((char, index) => {
                    if (char === ' ') return ' ';

                    const revealIndex = revealDirection === 'start'
                        ? index
                        : text.length - 1 - index;

                    if (revealIndex < iteration) return text[index];
                    return characters[Math.floor(Math.random() * characters.length)];
                }).join('')
            );

            if (iteration >= text.length) {
                clearInterval(interval);
                setDisplayText(text);
                setIsDecrypting(false);
                setHasDecrypted(true);
                onDecryptionComplete?.();
            }

            iteration += 0.5;
        }, speed);
    };

    useEffect(() => {
        if (animateOn === 'view') {
            const observer = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) decrypt(); },
                { threshold: 0.1 }
            );
            if (containerRef.current) observer.observe(containerRef.current);
            return () => observer.disconnect();
        }
    }, [animateOn, text]);

    return (
        <span
            ref={containerRef}
            className={parentClassName}
            onMouseEnter={() => animateOn === 'hover' && decrypt()}
            style={{ display: 'inline-block' }}
        >
            {displayText.split('').map((char, i) => (
                <span
                    key={i}
                    className={
                        hasDecrypted || (text[i] === char && i < displayText.length)
                            ? decryptedClassName
                            : encryptedClassName
                    }
                >
                    {char}
                </span>
            ))}
        </span>
    );
};

export default DecryptedText;
