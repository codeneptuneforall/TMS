'use client';
import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Popover } from '../ui/Popover';
import { MenuItem, MenuLabel } from '../ui/Menu';
import { PriorityGlyph, PriorityIndicator } from './PriorityIndicator';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { PRIORITY_META, PRIORITY_ORDER } from '../../utils/ticketMeta';
import type { Ticket } from '../../types/ticket';

export function PriorityMenu({ ticket, editable = true }: {ticket: Ticket;editable?: boolean;}) {
  const { changePriority } = useWorkflow();
  if (!editable || ticket.status === 'closed') return <PriorityIndicator priority={ticket.priority} />;

  return (
    <Popover
      label="Change priority"
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
        aria-label={`Priority: ${PRIORITY_META[ticket.priority].label}. Change priority`}
        className="group -mx-1 inline-flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
        
          <PriorityIndicator priority={ticket.priority} />
          <ChevronDownIcon className="h-3.5 w-3.5 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
        </button>
      }>
      
      {(close) =>
      <div role="menu" onClick={(e) => e.stopPropagation()}>
          <MenuLabel>Priority</MenuLabel>
          {PRIORITY_ORDER.map((p) =>
        <MenuItem
          key={p}
          icon={<PriorityGlyph priority={p} />}
          selected={ticket.priority === p}
          onSelect={() => {
            close();
            if (p !== ticket.priority) changePriority([ticket.id], p);
          }}>
          
              {PRIORITY_META[p].label}
            </MenuItem>
        )}
        </div>
      }
    </Popover>);

}
