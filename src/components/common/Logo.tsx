import React, { useEffect, useState } from 'react';
interface LogoProps { size?: 'sm' | 'md' | 'lg' | 'xl'; showTagline?: boolean; className?: string; onClick?: () => void; }
export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '', onClick }) => {
  const [logoUrl, setLogoUrl] = useState('');
  useEffect(() => {
    let alive = true;
    const apply = (url: string) => { if (!alive) return; setLogoUrl(url); if (url) { const icon = document.querySelector<HTMLLinkElement>('link[rel~=\"icon\"]'); if (icon) icon.href = url; } };
    const load = () => fetch('/api/site-settings', { credentials: 'include', cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(data => apply(data?.settings?.logoUrl || '')).catch(() => {});
    const update = (event: Event) => apply((event as CustomEvent).detail?.logoUrl || '');
    void load(); window.addEventListener('slacwave:site-settings-updated', update);
    return () => { alive = false; window.removeEventListener('slacwave:site-settings-updated', update); };
  }, []);
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl' };
  return <div onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? e => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined} className={`ma-wordmark inline-flex flex-col select-none ${onClick ? 'cursor-pointer' : ''} ${className}`} aria-label="SlacWave Music Group — a division of Mid Ama Distribution">
    {logoUrl ? <img src={logoUrl} alt="SlacWave Music Group" className="max-h-12 max-w-[190px] object-contain" /> : <div className="slacwave-wordmark"><span className="slacwave-symbol">SW</span><span><strong className={sizes[size]}>SLACWAVE</strong><small>MUSIC GROUP</small></span></div>}
    {showTagline && <span className="ma-wordmark-tagline">A DIVISION OF MID AMA DISTRIBUTION</span>}
  </div>;
};
