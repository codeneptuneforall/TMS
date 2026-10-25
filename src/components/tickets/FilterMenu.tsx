'use client';
import React, { useState } from 'react';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';
import { Popover } from '../ui/Popover';
import { Checkbox } from '../ui/Checkbox';
import { cn } from '../../utils/cn';

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface FilterMenuProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  searchable?: boolean;
}

export function FilterMenu({ label, options, selected, onToggle, onClear, searchable }: FilterMenuProps) {
  const [q, setQ] = useState('');
  const visible = options.filter((o) => o.label.toLowerCase().includes(q.trim().toLowerCase()));
  const active = selected.length > 0;

  return (
    <Popover
      label={`Filter by ${label.toLowerCase()}`}
      className="w-60"
      trigger={({ ref, toggle, open }) =>
      <button
        ref={ref}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={cn(
          'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-[13px] font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          active ? 'border-accent/40 bg-accent-soft text-accent-fg' : 'border-dashed border-line-strong text-ink-2 hover:bg-muted hover:text-ink'
        )}>
        
          {label}
          {active && <span className="rounded bg-accent px-1 text-2xs tabular-nums text-white">{selected.length}</span>}
          <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </button>
      }>
      
      {() =>
      <div>
          {searchable &&
        <div className="relative mb-1">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" aria-hidden />
              <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}`}
            aria-label={`Search ${label.toLowerCase()}`}
            className="h-8 w-full rounded-md border border-line bg-subtle pl-8 pr-2 text-[13px] focus:border-accent focus:outline-none" />
          
            </div>
        }
          <div className="scroll-thin max-h-64 overflow-y-auto" role="group" aria-label={label}>
            {visible.map((o) =>
          <label key={o.value} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-ink hover:bg-muted">
                <Checkbox data-menu-item checked={selected.includes(o.value)} onChange={() => onToggle(o.value)} />
                {o.icon}
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {o.count !== undefined && <span className="text-2xs tabular-nums text-ink-3">{o.count}</span>}
              </label>
          )}
            {visible.length === 0 && <p className="px-2 py-3 text-center text-[12px] text-ink-3">No matches</p>}
          </div>
          {active &&
        <>
              <div className="-mx-1 my-1 h-px bg-line" />
              <button type="button" onClick={onClear} className="w-full rounded-md px-2 py-1.5 text-left text-[13px] text-ink-2 hover:bg-muted hover:text-ink">
                Clear {label.toLowerCase()}
              </button>
            </>
        }
        </div>
      }
    </Popover>);

}
