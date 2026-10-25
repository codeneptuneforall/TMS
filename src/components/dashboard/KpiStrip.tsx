'use client';
import React from 'react';
import { Link } from '@/lib/router';
import { cn } from '../../utils/cn';
import { TONE_CLASSES, type Tone } from '../../utils/ticketMeta';

export interface Kpi {
  label: string;
  value: number | string;
  to?: string;
  tone?: Tone;
  hint?: string;
}

const COLS: Record<number, string> = {
  3: 'grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  7: 'grid-cols-2 sm:grid-cols-4 xl:grid-cols-7'
};

export function KpiStrip({ items }: {items: Kpi[];}) {
  return (
    <dl className={cn('grid overflow-hidden rounded-lg border border-line bg-line shadow-card [gap:1px]', COLS[items.length] ?? 'grid-cols-2 sm:grid-cols-4')}>
      {items.map((k) => {
        const content =
        <>
            <dt className="flex items-center gap-1.5 text-[12px] text-ink-3">
              {k.tone && <span className={cn('h-1.5 w-1.5 rounded-full', TONE_CLASSES[k.tone].dot)} aria-hidden />}
              {k.label}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.02em] text-ink">{k.value}</dd>
            {k.hint && <dd className="mt-0.5 truncate text-[12px] text-ink-3">{k.hint}</dd>}
          </>;

        return k.to ?
        <Link key={k.label} to={k.to} className="block bg-surface px-4 py-3.5 transition-colors duration-150 hover:bg-subtle focus-visible:relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50">
            {content}
          </Link> :

        <div key={k.label} className="bg-surface px-4 py-3.5">
            {content}
          </div>;

      })}
    </dl>);

}
