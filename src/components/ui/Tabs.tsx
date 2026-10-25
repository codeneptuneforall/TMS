'use client';
import React, { useRef } from 'react';
import { cn } from '../../utils/cn';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
}

export function Tabs<T extends string>({ tabs, value, onChange, label, className }: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus();
  };

  return (
    <div ref={listRef} role="tablist" aria-label={label} className={cn('flex gap-5 overflow-x-auto border-b border-line', className)}>
      {tabs.map((tab, idx) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, idx)}
            className={cn(
              '-mb-px flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 text-[13px] font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40',
              active ? 'border-ink text-ink' : 'border-transparent text-ink-3 hover:text-ink'
            )}>
            
            {tab.label}
            {tab.count !== undefined &&
            <span className={cn('rounded px-1.5 text-2xs tabular-nums', active ? 'bg-ink text-white' : 'bg-muted text-ink-2')}>{tab.count}</span>
            }
          </button>);

      })}
    </div>);

}
