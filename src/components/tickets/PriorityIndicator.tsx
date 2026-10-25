'use client';
import React from 'react';
import { cn } from '../../utils/cn';
import { PRIORITY_META, TONE_CLASSES } from '../../utils/ticketMeta';
import type { TicketPriority } from '../../types/ticket';

export function PriorityGlyph({ priority }: {priority: TicketPriority;}) {
  const meta = PRIORITY_META[priority];
  if (priority === 'urgent') {
    return (
      <span aria-hidden className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-danger text-[10px] font-bold leading-none text-white">
        !
      </span>);

  }
  const heights = ['h-1.5', 'h-2.5', 'h-3.5'];
  return (
    <span aria-hidden className="flex h-3.5 w-3.5 items-end gap-[2px]">
      {heights.map((h, i) =>
      <span key={h} className={cn('w-[3px] rounded-[1px]', h, i < meta.level ? TONE_CLASSES[meta.tone].bar : 'bg-line-strong')} />
      )}
    </span>);

}

export function PriorityIndicator({ priority, className }: {priority: TicketPriority;className?: string;}) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap text-[13px]', priority === 'urgent' ? 'font-medium text-danger-fg' : 'text-ink-2', className)}>
      <PriorityGlyph priority={priority} />
      {meta.label}
    </span>);

}
