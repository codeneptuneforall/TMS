'use client';
import React from 'react';
import { Link } from '@/lib/router';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { StatusBadge } from './StatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { awaitingAgent, awaitingRequester } from '../../utils/permissions';
import { dueStatus, relativeTime } from '../../utils/time';
import type { Ticket } from '../../types/ticket';

/** Mobile layout for ticket lists — readable cards instead of a squeezed table. */
export function TicketCardList({ rows }: {rows: Ticket[];}) {
  const user = useCurrentUser();
  const { getUser } = useAppState();
  const staff = user.role !== 'requester';

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface shadow-card md:hidden">
      {rows.map((t) => {
        const assignee = getUser(t.assigneeId);
        const requester = getUser(t.requesterId);
        const due = staff ? dueStatus(t.dueAt, t.status) : null;
        const needsReply = staff ? awaitingAgent(t) && !!t.assigneeId : awaitingRequester(t);
        return (
          <li key={t.id}>
            <Link to={`/tickets/${t.id}`} className="block px-4 py-3.5 active:bg-muted focus-visible:bg-muted focus-visible:outline-none">
              <div className="flex items-center gap-2">
                <span className="ticket-id text-[12px] text-ink-3">{t.id}</span>
                {needsReply && <span className="text-[11px] font-medium text-accent-fg">{staff ? '· Awaiting reply' : '· Waiting on you'}</span>}
                <span className="ml-auto">
                  <StatusBadge status={t.status} />
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[14px] font-medium leading-5 text-ink">{t.subject}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-ink-3">
                <PriorityIndicator priority={t.priority} className="text-[12px]" />
                {staff && <span className="truncate">{requester?.name}</span>}
                {due && <Badge tone={due.tone}>{due.label}</Badge>}
                <span className="ml-auto flex items-center gap-1.5">
                  {assignee ? <Avatar name={assignee.name} id={assignee.id} size="xs" /> : <span className="text-ink-3">Unassigned ·</span>}
                  <span className="tabular-nums">{relativeTime(t.updatedAt)}</span>
                </span>
              </div>
            </Link>
          </li>);

      })}
    </ul>);

}
