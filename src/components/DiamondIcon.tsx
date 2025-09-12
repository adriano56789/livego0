
import React from 'react';

const DiamondIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 2L3 8.25L12 22L21 8.25L12 2Z" fill="#FFC700"/>
        <path d="M12 2L16.5 8.25L12 22L7.5 8.25L12 2Z" fill="#FFEB3B"/>
        <path d="M3 8.25L12 22L7.5 8.25L3 8.25Z" fill="#FFD700"/>
        <path d="M21 8.25L12 22L16.5 8.25H21Z" fill="#FFD700"/>
        <path d="M3 8.25L12 9.75L21 8.25L12 2L3 8.25Z" fill="#FFF59D"/>
    </svg>
);

export default DiamondIcon;
