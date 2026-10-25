'use client';
import React from 'react';
import { Link } from '@/lib/router';
import { ArrowRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PanelProps {
  title: string;
  description?: string;
  action?: {label: string;to: string;};
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, description, action, extra, children, className, bodyClassName }: PanelProps) {
  const id = `panel-${title.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <section aria-labelledby={id} className={cn('flex flex-col rounded-lg border border-line bg-surface shadow-card', className)}>
      <header className="flex items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
        <div className="min-w-0">
          <h2 id={id} className="text-[14px] font-semibold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-[12px] text-ink-3">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {extra}
          {action &&
          <Link to={action.to} className="group inline-flex items-center gap-1 rounded text-[12px] font-medium text-ink-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
              {action.label}
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          }
        </div>
      </header>
      <div className={cn('min-h-0 flex-1', bodyClassName)}>{children}</div>
    </section>);

}
