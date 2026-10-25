'use client';
import React, { useMemo } from 'react';
import { Link } from '@/lib/router';
import { HistoryIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { EmptyState } from '../ui/States';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { PRIORITY_META, STATUS_META } from '../../utils/ticketMeta';
import { formatDateTime, relativeTime } from '../../utils/time';
import type { Ticket, TicketPriority, TicketStatus } from '../../types/ticket';

interface FeedItem {
  id: string;
  actorId: string;
  ticketId: string;
  text: string;
  createdAt: string;
}

interface ActivityFeedProps {
  tickets: Ticket[];
  actorId?: string;
  limit?: number;
  includeInternal?: boolean;
}

export function ActivityFeed({ tickets, actorId, limit = 7, includeInternal = true }: ActivityFeedProps) {
  const { getUser } = useAppState();
  const me = useCurrentUser();

  const items = useMemo(() => {
    const out: FeedItem[] = [];
    tickets.forEach((t) => {
      t.activity.forEach((a) => {
        let text = '';
        if (a.kind === 'assigned') text = a.to ? `assigned to ${a.to === me.id ? 'you' : getUser(a.to)?.name}` : 'unassigned';else
        if (a.kind === 'status' || a.kind === 'resolved' || a.kind === 'closed' || a.kind === 'reopened') text = `moved to ${STATUS_META[a.to as TicketStatus]?.label}`;else
        if (a.kind === 'priority') text = `set priority to ${PRIORITY_META[a.to as TicketPriority]?.label}`;else
        if (a.kind === 'team') text = 'changed team';else
        return;
        out.push({ id: a.id, actorId: a.actorId, ticketId: t.id, text, createdAt: a.createdAt });
      });
      t.messages.forEach((m) => {
        if (m.visibility === 'internal' && !includeInternal) return;
        out.push({ id: m.id, actorId: m.authorId, ticketId: t.id, text: m.visibility === 'internal' ? 'added an internal note' : 'replied', createdAt: m.createdAt });
      });
    });
    return out.
    filter((i) => !actorId || i.actorId === actorId).
    sort((a, b) => b.createdAt.localeCompare(a.createdAt)).
    slice(0, limit);
  }, [tickets, actorId, limit, includeInternal, getUser, me.id]);

  if (!items.length) return <EmptyState compact icon={<HistoryIcon />} title="No recent activity" description="Updates to tickets will show up here." />;

  return (
    <ol className="space-y-3 px-4 pb-4 sm:px-5">
      {items.map((i) => {
        const actor = getUser(i.actorId);
        return (
          <li key={i.id} className="flex gap-2.5">
            <Avatar name={actor?.name ?? '?'} id={i.actorId} size="sm" className="mt-0.5" />
            <p className="min-w-0 flex-1 text-[13px] leading-5 text-ink-2">
              <span className="font-medium text-ink">{i.actorId === me.id ? 'You' : actor?.name}</span> {i.text} on{' '}
              <Link to={`/tickets/${i.ticketId}`} className="ticket-id text-[12px] text-ink hover:underline">{i.ticketId}</Link>
              <time dateTime={i.createdAt} title={formatDateTime(i.createdAt)} className="ml-1.5 whitespace-nowrap text-[12px] tabular-nums text-ink-3">{relativeTime(i.createdAt)}</time>
            </p>
          </li>);

      })}
    </ol>);

}
