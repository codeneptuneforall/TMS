'use client';
import React from 'react';
import { Link } from '@/lib/router';

export function LogoMark({ className = 'h-7 w-7' }: {className?: string;}) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-md bg-primary text-white ${className}`} aria-hidden>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 18V6h7a4 4 0 0 1 0 8H5" />
        <path d="M12 14l5 4" />
      </svg>
    </span>);

}

export function Logo({ compact }: {compact?: boolean;}) {
  return (
    <Link to="/overview" className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50" aria-label="Relay — go to overview">
      <LogoMark />
      {!compact && <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Relay</span>}
    </Link>);

}
