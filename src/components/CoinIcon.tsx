
import React from 'react';

const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="12" r="10" fill="#F59E0B"/>
        <circle cx="12" cy="12" r="6" fill="#FBBF24"/>
    </svg>
);

export default CoinIcon;