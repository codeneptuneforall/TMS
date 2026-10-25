'use client';
import React from 'react';
import { Link } from '@/lib/router';
import { ChevronRightIcon } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions, meta }: PageHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 &&
        <nav aria-label="Breadcrumb" className="mb-1.5">
            <ol className="flex flex-wrap items-center gap-1 text-[12px] text-ink-3">
              {breadcrumbs.map((c, i) =>
            <li key={c.label} className="flex items-center gap-1">
                  {c.to ?
              <Link to={c.to} className="rounded hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
                      {c.label}
                    </Link> :

              <span aria-current="page" className="text-ink-2">
                      {c.label}
                    </span>
              }
                  {i < breadcrumbs.length - 1 && <ChevronRightIcon className="h-3 w-3" aria-hidden />}
                </li>
            )}
            </ol>
          </nav>
        }
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-[-0.01em] text-ink">{title}</h1>
          {meta}
        </div>
        {description && <p className="mt-1 text-[13px] text-ink-3">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>);

}

export function PageContainer({ children, wide }: {children: React.ReactNode;wide?: boolean;}) {
  return <div className={wide ? 'mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6' : 'mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-6'}>{children}</div>;
}

export function SampleDataBadge() {
  return (
    <span className="inline-flex h-5 items-center rounded border border-dashed border-line-strong px-1.5 text-2xs font-medium text-ink-3" title="Figures are generated from prototype sample data">
      Sample data
    </span>);

}
