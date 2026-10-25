'use client';

import React from 'react';
import { Link } from '@/lib/router';
import { usePathname } from 'next/navigation';
import { cn } from '../../utils/cn';

export interface SubNavItem {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

/** Vertical section navigation on desktop, horizontal scroller on small screens. */
export function SubNav({ items, label }: {items: SubNavItem[];label: string;}) {
  const pathname = usePathname() ?? '';
  return (
    <nav aria-label={label} className="-mx-4 overflow-x-auto border-b border-line px-4 lg:mx-0 lg:border-0 lg:px-0">
      <ul className="flex gap-1 lg:flex-col lg:gap-0.5">
        {items.map((i) => {
          const isActive = pathname === i.to;
          return (
        <li key={i.to} className="shrink-0">
            <Link
            to={i.to}
            className={cn(
              'flex h-9 items-center gap-2.5 whitespace-nowrap px-2.5 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
              'border-b-2 lg:rounded-md lg:border-b-0',
              isActive ? 'border-ink text-ink lg:bg-muted' : 'border-transparent text-ink-3 hover:text-ink lg:hover:bg-subtle'
            )}>
            
              {i.icon && <span className="hidden text-ink-3 lg:inline [&>svg]:h-4 [&>svg]:w-4">{i.icon}</span>}
              {i.label}
            </Link>
          </li>
          );
        })}
      </ul>
    </nav>);

}

export function SettingsSection({ title, description, children, footer }: {title: string;description?: string;children: React.ReactNode;footer?: React.ReactNode;}) {
  return (
    <section className="rounded-lg border border-line bg-surface shadow-card" aria-label={title}>
      <header className="border-b border-line px-5 py-4">
        <h2 className="text-[14px] font-semibold text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-ink-3">{description}</p>}
      </header>
      <div className="px-5 py-4">{children}</div>
      {footer && <div className="flex flex-col-reverse gap-2 border-t border-line bg-subtle px-5 py-3 sm:flex-row sm:items-center sm:justify-end">{footer}</div>}
    </section>);

}
