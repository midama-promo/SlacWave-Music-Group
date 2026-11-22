import React from 'react';
interface LogoProps { size?: 'sm' | 'md' | 'lg' | 'xl'; showTagline?: boolean; className?: string; onClick?: () => void; }
export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '', onClick }) => {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl' };
  return <div onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? e => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined} className={`ma-wordmark inline-flex flex-col select-none ${onClick ? 'cursor-pointer' : ''} ${className}`} aria-label="SlacWave Music Group — a division of Mid Ama Distribution">
    <div className="slacwave-wordmark"><span className="slacwave-symbol">SW</span><span><strong className={sizes[size]}>SLACWAVE</strong><small>MUSIC GROUP</small></span></div>
    {showTagline && <span className="ma-wordmark-tagline">A DIVISION OF MID AMA DISTRIBUTION</span>}
  </div>;
};
