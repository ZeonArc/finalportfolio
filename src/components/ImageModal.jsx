import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './ImageModal.css';

export default function ImageModal({ isOpen, imageUrl, altText, onClose }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; 
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !imageUrl) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="image-modal-backdrop" onClick={handleBackdropClick}>
            <div className="image-modal-content">
                <button className="image-modal-close" onClick={onClose} aria-label="Close modal">
                    <X size={24} />
                </button>
                <img src={imageUrl} alt={altText || 'Certificate Preview'} className="image-modal-img" />
            </div>
        </div>
    );
}
