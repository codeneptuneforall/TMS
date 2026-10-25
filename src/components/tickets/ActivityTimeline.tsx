'use client';
import React from 'react';
import {
  ArchiveIcon,
  CircleCheckBigIcon,
  CirclePlusIcon,
  LockIcon,
  MessageSquareIcon,
  PencilIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SignalIcon,
  UserPlusIcon,
  UsersRoundIcon } from
'lucide-react';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { PRIORITY_META, STATUS_META } from '../../utils/ticketMeta';
import { formatDateTime, relativeTime } from '../../utils/time';
import type { ActivityEvent, ActivityKind, TicketPriority, TicketStatus, Ticket } from '../../types/ticket';

const ICONS: Record<ActivityKind | 'created', React.ReactNode> = {
  created: <CirclePlusIcon />,
  assigned: <UserPlusIcon />,
  team: <UsersRoundIcon />,
  status: <RefreshCwIcon />,
  priority: <SignalIcon />,
  reply: <MessageSquareIcon />,
  note: <LockIcon />,
  resolved: <CircleCheckBigIcon />,
  reopened: <RotateCcwIcon />,
  closed: <ArchiveIcon />,
  edited: <PencilIcon />
};

const REQUESTER_VISIBLE: (ActivityKind | 'created')[] = ['created', 'status', 'resolved', 'reopened', 'closed', 'reply'];

export function ActivityTimeline({ ticket }: {ticket: Ticket;}) {
  const user = useCurrentUser();
  const { getUser, getTeam } = useAppState();
  const staff = user.role !== 'requester';

  const name = (id: string | null | undefined) => id === user.id ? 'you' : getUser(id)?.name ?? 'Unassigned';

  const describe = (e: ActivityEvent): React.ReactNode => {
    const b = (s: React.ReactNode) => <span className="font-medium text-ink">{s}</span>;
    switch (e.kind) {
      case 'assigned':
        return e.to ? <>assigned this to {b(name(e.to))}</> : <>removed the assignee {b(name(e.from))}</>;
      case 'team':
        return <>moved this from {b(getTeam(e.from)?.name ?? 'no team')} to {b(getTeam(e.to)?.name)}</>;
      case 'status':
        return <>changed status from {b(STATUS_META[e.from as TicketStatus]?.label)} to {b(STATUS_META[e.to as TicketStatus]?.label)}</>;
      case 'priority':
        return <>changed priority from {b(PRIORITY_META[e.from as TicketPriority]?.label)} to {b(PRIORITY_META[e.to as TicketPriority]?.label)}</>;
      case 'reply':
        return <>posted a public reply</>;
      case 'note':
        return <>added an internal note</>;
      case 'resolved':
        return <>marked this {b('Resolved')}</>;
      case 'reopened':
        return <>{b('reopened')} this ticket</>;
      case 'closed':
        return <>{b('closed')} this ticket</>;
      case 'edited':
        return <>edited the ticket details</>;
    }
  };

  const derived: ActivityEvent[] = ticket.messages.
  filter((m) => staff || m.visibility === 'public').
  map((m) => ({ id: `msg-${m.id}`, kind: m.visibility === 'internal' ? 'note' as const : 'reply' as const, actorId: m.authorId, createdAt: m.createdAt }));

  const recorded = ticket.activity.filter((a) => a.kind !== 'reply' && a.kind !== 'note');
  const events = [...recorded, ...derived].
  filter((e) => staff || REQUESTER_VISIBLE.includes(e.kind)).
  sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const rows = [{ id: 'created', kind: 'created' as const, actorId: ticket.requesterId, createdAt: ticket.createdAt }, ...events];

  return (
    <ol className="relative space-y-0" aria-label="Ticket activity">
      {rows.map((e, i) =>
      <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
          {i < rows.length - 1 && <span className="absolute left-[13px] top-7 h-[calc(100%-20px)] w-px bg-line" aria-hidden />}
          <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-3 [&>svg]:h-3.5 [&>svg]:w-3.5">
            {ICONS[e.kind]}
          </span>
          <div className="min-w-0 flex-1 pt-1 text-[13px] leading-5 text-ink-2">
            <span className="font-medium text-ink">{e.actorId === user.id ? 'You' : getUser(e.actorId)?.name ?? 'System'}</span>{' '}
            {e.kind === 'created' ? 'opened this ticket' : describe(e as ActivityEvent)}
            <time dateTime={e.createdAt} title={formatDateTime(e.createdAt)} className="ml-2 whitespace-nowrap text-[12px] tabular-nums text-ink-3">
              {relativeTime(e.createdAt)}
            </time>
          </div>
        </li>
      )}
    </ol>);

}
