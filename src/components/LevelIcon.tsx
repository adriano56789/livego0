
import React from 'react';

const LevelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="levelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="url(#levelGrad)" />
    <text x="50%" y="52%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
      LV 6
    </text>
  </svg>
);

export default LevelIcon;