
import React from 'react';

const CoHostIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H7.5V13.5H13.5V10.5Z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5H13.5V13.5H16.5V10.5Z" transform="rotate(90 15 12)"></path>
    <path d="M13.14,13.14a4.24,4.24,0,0,1-6.28,0" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M17.36,8.64a4.24,4.24,0,0,1,0,6.28" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M10.86,10.86a4.24,4.24,0,0,1,6.28,0" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M6.64,15.36a4.24,4.24,0,0,1,0-6.28" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

export default CoHostIcon;
