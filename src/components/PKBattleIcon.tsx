
import React from 'react';

const PKBattleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="pkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#4f46e5'}} />
        <stop offset="100%" style={{stopColor: '#db2777'}} />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="11" fill="url(#pkGradient)" />
    <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
      PK
    </text>
  </svg>
);

export default PKBattleIcon;