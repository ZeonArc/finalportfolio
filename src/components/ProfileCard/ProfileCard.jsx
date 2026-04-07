import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import './ProfileCard.css';

const ProfileCard = ({ image, name, role, bio, socialLinks, onClick }) => {
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateY = -1 * ((x - rect.width / 2) / 10);
            const rotateX = (y - rect.height / 2) / 10;

            gsap.to(card, {
                rotateX,
                rotateY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000,
            });
        };

        const handleMouseLeave = () => {
            setIsHovered(false);
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)',
            });
        };

        const handleMouseEnter = () => setIsHovered(true);

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        card.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
            card.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    return (
        <div 
            ref={cardRef} 
            className={`profile-card-rb ${isHovered ? 'hovered' : ''}`}
            onClick={onClick}
        >
            <div className="profile-card-inner" ref={contentRef}>
                <div className="profile-card-bg">
                    {image && <img src={image} alt="Background" className="profile-card-bg-img" />}
                </div>
                
                <div className="profile-card-content">

                    
                    <h3 className="profile-card-name">{name}</h3>
                    <p className="profile-card-role">{role}</p>
                    
                    {socialLinks && (
                        <div className="profile-card-socials">
                            {socialLinks}
                        </div>
                    )}
                </div>
                
                {/* Shinning overlay */}
                <div className="profile-card-shine" />
            </div>
        </div>
    );
};

export default ProfileCard;
