'use client';
import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Popover } from '../ui/Popover';
import { MenuItem, MenuLabel } from '../ui/Menu';
import { StatusBadge } from './StatusBadge';
import { useCurrentUser } from '../../contexts/AppStateContext';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { allowedTransitions, STATUS_META, TONE_CLASSES, transitionLabel } from '../../utils/ticketMeta';
import { cn } from '../../utils/cn';
import type { Ticket } from '../../types/ticket';

interface StatusMenuProps {
  ticket: Ticket;
  variant?: 'badge' | 'button';
}

export function StatusMenu({ ticket, variant = 'badge' }: StatusMenuProps) {
  const user = useCurrentUser();
  const { requestStatus } = useWorkflow();
  const options = allowedTransitions(ticket.status, user.role);

  if (options.length === 0) return <StatusBadge status={ticket.status} />;

  return (
    <Popover
      label="Change status"
      trigger={({ ref, toggle, open }) =>
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Status: ${STATUS_META[ticket.status].label}. Change status`}
        className={cn(
          'group inline-flex items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          variant === 'button' && 'h-9 border border-line-strong bg-surface px-2 shadow-card hover:bg-muted'
        )}>
        
          <StatusBadge status={ticket.status} />
          <ChevronDownIcon className="h-3.5 w-3.5 text-ink-3 transition-colors group-hover:text-ink" aria-hidden />
        </button>
      }>
      
      {(close) =>
      <div role="menu" onClick={(e) => e.stopPropagation()}>
          <MenuLabel>Move to</MenuLabel>
          {options.map((to) =>
        <MenuItem
          key={to}
          icon={<span className={cn('h-2 w-2 rounded-full', TONE_CLASSES[STATUS_META[to].tone].dot)} />}
          hint={STATUS_META[to].label}
          onSelect={() => {
            close();
            requestStatus([ticket.id], to);
          }}>
          
              {transitionLabel(ticket.status, to, user.role)}
            </MenuItem>
        )}
        </div>
      }
    </Popover>);

}
