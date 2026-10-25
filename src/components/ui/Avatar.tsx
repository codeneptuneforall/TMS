'use client';
import React from 'react';
import { cn } from '../../utils/cn';

const SIZES = {
  xs: 'h-5 w-5 text-[9px]',
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-[11px]',
  lg: 'h-10 w-10 text-[13px]',
  xl: 'h-14 w-14 text-base'
};

const PALETTE = [
'bg-[#E4ECF7] text-[#2B4A75]',
'bg-[#E6F1EC] text-[#2C5B45]',
'bg-[#F3E9E2] text-[#6E4127]',
'bg-[#ECE8F5] text-[#4B3D78]',
'bg-[#F4ECD9] text-[#6A5216]',
'bg-[#E3EFF1] text-[#24575E]'];


function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = h * 31 + s.charCodeAt(i) >>> 0;
  return h;
}

export function initials(name: string): string {
  const parts = name.replace(/[^a-zA-Z' ]/g, '').trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

interface AvatarProps {
  name: string;
  id?: string;
  size?: keyof typeof SIZES;
  className?: string;
  decorative?: boolean;
}

export function Avatar({ name, id, size = 'md', className, decorative = true }: AvatarProps) {
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : name}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold ring-1 ring-inset ring-ink/5',
        PALETTE[hash(id ?? name) % PALETTE.length],
        SIZES[size],
        className
      )}>
      
      {initials(name)}
    </span>);

}
