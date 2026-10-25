'use client';
import React from 'react';
import { cn } from '../../utils/cn';
import { TONE_CLASSES, type Tone } from '../../utils/ticketMeta';

interface BadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({ tone = 'neutral', children, dot, icon, className }: BadgeProps) {
  const t = TONE_CLASSES[tone];
  return (
    <span
      className={cn(
        'inline-flex h-[22px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-[12px] font-medium ring-1 ring-inset',
        t.badge,
        className
      )}>
      
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', t.dot)} aria-hidden />}
      {icon}
      {children}
    </span>);

}
