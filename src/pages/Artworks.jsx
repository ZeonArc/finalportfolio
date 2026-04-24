import React, { useState } from 'react';
import { X } from 'lucide-react';
import { artworksData } from '../data/artworks';
import './Artworks.css';

const Artworks = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const openModal = (art) => {
        setSelectedImage(art);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <section className="mc-artworks-section">
            <div className="mc-artworks-header">
                <h1 className="mc-title">Featured <span className="mc-highlight">Loot</span> (Artworks)</h1>
                <p className="mc-subtitle">A collection of digital paintings, concept art, and 3D renders.</p>
            </div>

            <div className="mc-masonry-grid">
                {artworksData.map((art) => (
                    <div 
                        key={art.id} 
                        className="mc-artwork-card cursor-target"
                        onClick={() => openModal(art)}
                    >
                        <div className="mc-artwork-image-container">
                            <img src={art.image} alt={art.title} className="mc-artwork-image" loading="lazy" />
                            <div className="mc-artwork-overlay">
                                <h3 className="mc-artwork-title">{art.title}</h3>
                                <span className="mc-artwork-category">{art.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="mc-lightbox" onClick={closeModal}>
                    <div className="mc-lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="mc-lightbox-close cursor-target" onClick={closeModal} aria-label="Close">
                            <X size={24} />
                        </button>
                        <img 
                            src={selectedImage.image} 
                            alt={selectedImage.title} 
                            className="mc-lightbox-image" 
                        />
                        <div className="mc-lightbox-info">
                            <h2>{selectedImage.title}</h2>
                            <p>{selectedImage.description}</p>
                            <span className="mc-lightbox-tag">{selectedImage.category}</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Artworks;
