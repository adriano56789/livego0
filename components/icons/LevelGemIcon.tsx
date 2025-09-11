import React from 'react';

const LevelGemIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const animationStyle = `
        @keyframes pulse-glow {
            0%, 100% {
                filter: drop-shadow(0 0 4px #ec4899);
            }
            50% {
                filter: drop-shadow(0 0 10px #a855f7);
            }
        }
    `;

    return (
        <>
            <style>{animationStyle}</style>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} style={{ animation: 'pulse-glow 2.5s ease-in-out infinite' }}>
                <defs>
                    <linearGradient id="levelGemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="url(#levelGemGrad)" stroke="#fbcfe8" strokeWidth="0.5" />
                <path d="M12 2L22 7L12 22" fill="url(#levelGemGrad)" fillOpacity="0.6" />
                <path d="M12 2L2 7L12 9L22 7L12 2Z" fill="white" fillOpacity="0.4" />
            </svg>
        </>
    );
};

export default LevelGemIcon;
