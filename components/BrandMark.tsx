import React from 'react';

interface BrandMarkProps {
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M9 23.5H15.5V17H22V10.5H31"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 11.5C12.1 10.75 13.75 9.1 14.5 6C15.25 9.1 16.9 10.75 20 11.5C16.9 12.25 15.25 13.9 14.5 17C13.75 13.9 12.1 12.25 9 11.5Z"
      fill="currentColor"
    />
    <circle cx="12" cy="30" r="3" fill="currentColor" />
    <circle cx="21" cy="30" r="3" fill="currentColor" opacity="0.82" />
    <path
      d="M28 28.5V20.5L33 18.5V26.5"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="28" cy="30" r="2.5" fill="currentColor" />
  </svg>
);
