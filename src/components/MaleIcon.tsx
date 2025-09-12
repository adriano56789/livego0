
import React from 'react';

const MaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 15a6 6 0 100-12 6 6 0 000 12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5L20 4m0 0h-4m4 0v4" />
  </svg>
);

export default MaleIcon;
