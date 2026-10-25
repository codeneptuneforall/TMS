'use client';
import React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MenuItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onSelect: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  selected?: boolean;
  hint?: React.ReactNode;
}

export function MenuItem({ icon, children, onSelect, tone = 'default', disabled, selected, hint }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      data-menu-item
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] outline-none transition-colors duration-100',
        'hover:bg-muted focus-visible:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
        tone === 'danger' ? 'text-danger-fg' : 'text-ink'
      )}>
      
      {icon && <span className="flex h-4 w-4 shrink-0 items-center justify-center text-ink-3 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint && <span className="shrink-0 text-2xs text-ink-3">{hint}</span>}
      {selected && <CheckIcon className="h-4 w-4 shrink-0 text-accent" aria-label="Selected" />}
    </button>);

}

export function MenuLabel({ children }: {children: React.ReactNode;}) {
  return <div className="px-2 pb-1 pt-1.5 text-2xs font-medium text-ink-3">{children}</div>;
}

export function MenuSeparator() {
  return <div role="separator" className="-mx-1 my-1 h-px bg-line" />;
}
