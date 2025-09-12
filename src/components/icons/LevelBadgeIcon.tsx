
import React from 'react';

const LevelBadgeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none"/>
    <circle cx="8" cy="8" r="2" />
  </svg>
);

export default LevelBadgeIcon;