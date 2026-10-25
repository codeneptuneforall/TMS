'use client';
import React from 'react';
import { Link } from '@/lib/router';
import { STATUS_META, STATUS_ORDER, TONE_CLASSES } from '../../utils/ticketMeta';
import { cn } from '../../utils/cn';
import type { Ticket } from '../../types/ticket';

export function StatusDistribution({ tickets }: {tickets: Ticket[];}) {
  const total = tickets.length || 1;
  const rows = STATUS_ORDER.map((s) => ({ status: s, count: tickets.filter((t) => t.status === s).length }));
  const linkFor = (s: string) => s === 'pending' || s === 'resolved' || s === 'closed' ? `/queue/${s}` : '/queue/all';

  return (
    <div className="px-4 pb-4 sm:px-5">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={rows.map((r) => `${STATUS_META[r.status].label}: ${r.count}`).join(', ')}>
        {rows.map((r) =>
        r.count ? <span key={r.status} className={cn('h-full border-r-2 border-surface last:border-r-0', TONE_CLASSES[STATUS_META[r.status].tone].bar)} style={{ width: `${r.count / total * 100}%` }} /> : null
        )}
      </div>
      <ul className="mt-4 space-y-1">
        {rows.map((r) =>
        <li key={r.status}>
            <Link to={linkFor(r.status)} className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
              <span className={cn('h-2 w-2 rounded-full', TONE_CLASSES[STATUS_META[r.status].tone].dot)} aria-hidden />
              <span className="flex-1 text-ink-2">{STATUS_META[r.status].label}</span>
              <span className="font-medium tabular-nums text-ink">{r.count}</span>
              <span className="w-10 text-right text-[12px] tabular-nums text-ink-3">{Math.round(r.count / total * 100)}%</span>
            </Link>
          </li>
        )}
      </ul>
    </div>);

}
