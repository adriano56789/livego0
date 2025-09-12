
import React from 'react';

const PixIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="white" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M16 12C14.8954 12 14 12.8954 14 14V34C14 35.1046 14.8954 36 16 36H24.5714C30.8814 36 36 30.8814 36 24.5714V23.4286C36 17.1186 30.8814 12 24.5714 12H16Z" />
    <path d="M24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28H20V20H24Z" fill="#1A2A22"/>
  </svg>
);

export default PixIcon;