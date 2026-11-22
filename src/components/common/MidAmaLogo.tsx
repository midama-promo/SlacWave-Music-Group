import React from 'react';
interface MidAmaLogoProps { className?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; variant?: 'badge' | 'full' | 'icon'; showSubtitle?: boolean; }
export const MidAmaLogo: React.FC<MidAmaLogoProps> = ({ className = '', size = 'md', variant = 'badge', showSubtitle = false }) => {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-lg' };
  return <div className={`ma-glass-mark ${variant === 'full' ? 'ma-glass-mark-full' : ''} ${className}`}><div className="slacwave-wordmark"><span className="slacwave-symbol">SW</span>{variant !== 'icon' && <span><strong className={sizes[size]}>SLACWAVE</strong><small>MUSIC GROUP</small></span>}</div>{showSubtitle && <span className="ma-glass-caption">A DIVISION OF MID AMA DISTRIBUTION</span>}</div>;
};
