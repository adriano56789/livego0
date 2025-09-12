
import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 00-4.873-1.424l-.001-.001-.001-.001A1.125 1.125 0 011.124 16.12v-6.352a1.125 1.125 0 011.124-1.124h1.423a9.75 9.75 0 004.873-1.424l.001-.001.001-.001a1.125 1.125 0 011.124 1.124v6.352a1.125 1.125 0 01-1.124 1.124h-1.423M16.5 18.75h-9m9 0a9 9 0 009-9m-9 9V9.375m0 9.375a9 9 0 01-9-9m9 9V9.375M3.375 9.375a9 9 0 0117.25 0V18a2.25 2.25 0 01-2.25 2.25H16.5a2.25 2.25 0 01-2.25-2.25V18m-9 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 18v.75m9-15.75A2.25 2.25 0 009.75 5.25v1.5a2.25 2.25 0 002.25 2.25h.008a2.25 2.25 0 002.25-2.25v-1.5A2.25 2.25 0 0012 3z" />
  </svg>
);

export default TrophyIcon;
