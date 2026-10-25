'use client';
import React from 'react';
import { Link } from '@/lib/router';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/States';
import { StatusBadge } from '../tickets/StatusBadge';
import { PriorityGlyph } from '../tickets/PriorityIndicator';
import { useAppState } from '../../contexts/AppStateContext';
import { dueStatus, relativeTime } from '../../utils/time';
import { PRIORITY_META } from '../../utils/ticketMeta';
import type { Ticket } from '../../types/ticket';

interface TicketMiniListProps {
  tickets: Ticket[];
  empty: {icon: React.ReactNode;title: string;description?: string;};
  showAssignee?: boolean;
  showDue?: boolean;
  subline?: (t: Ticket) => React.ReactNode;
}

export function TicketMiniList({ tickets, empty, showAssignee, showDue, subline }: TicketMiniListProps) {
  const { getUser } = useAppState();
  if (tickets.length === 0) return <EmptyState compact icon={empty.icon} title={empty.title} description={empty.description} />;
  return (
    <ul className="divide-y divide-line border-t border-line">
      {tickets.map((t) => {
        const assignee = getUser(t.assigneeId);
        const due = showDue ? dueStatus(t.dueAt, t.status) : null;
        return (
          <li key={t.id}>
            <Link to={`/tickets/${t.id}`} className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-100 hover:bg-subtle focus-visible:bg-muted focus-visible:outline-none sm:px-5">
              <span title={`${PRIORITY_META[t.priority].label} priority`}>
                <PriorityGlyph priority={t.priority} />
                <span className="sr-only">{PRIORITY_META[t.priority].label} priority</span>
              </span>
              <span className="ticket-id hidden w-[92px] shrink-0 text-[12px] text-ink-3 sm:block">{t.id}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-ink">{t.subject}</span>
                {subline && <span className="block truncate text-[12px] text-ink-3">{subline(t)}</span>}
              </span>
              {due && <Badge tone={due.tone} className="hidden md:inline-flex">{due.label}</Badge>}
              {showAssignee &&
              <span className="hidden w-6 lg:block" title={assignee ? assignee.name : 'Unassigned'}>
                  {assignee ? <Avatar name={assignee.name} id={assignee.id} size="sm" /> : <span className="block h-6 w-6 rounded-full border border-dashed border-line-strong" aria-label="Unassigned" />}
                </span>
              }
              <StatusBadge status={t.status} className="hidden sm:inline-flex" />
              <span className="w-14 shrink-0 text-right text-[12px] tabular-nums text-ink-3">{relativeTime(t.updatedAt)}</span>
            </Link>
          </li>);

      })}
    </ul>);

}
