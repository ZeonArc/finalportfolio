import React, { useEffect, useRef } from 'react';
import './Aurora.css';

const Aurora = ({ color1 = '#4AEDD9', color2 = '#5D8C3E', color3 = '#1a3a1a', speed = 0.5 }) => {
    return (
        <div className="aurora-hero">
            <div className="aurora-container">
                <div 
                    className="aurora-blob aurora-blob-1"
                    style={{ backgroundColor: color1, animationDuration: `${20 / speed}s` }}
                />
                <div 
                    className="aurora-blob aurora-blob-2"
                    style={{ backgroundColor: color2, animationDuration: `${25 / speed}s` }}
                />
                <div 
                    className="aurora-blob aurora-blob-3"
                    style={{ backgroundColor: color3, animationDuration: `${30 / speed}s` }}
                />
                <div className="aurora-overlay"></div>
            </div>
        </div>
    );
};

export default Aurora;
