
import React from 'react';

const FlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 18.75h15M4.5 7.5h15v6.75h-15V7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 18.75V3" />
  </svg>
);

export default FlagIcon;
