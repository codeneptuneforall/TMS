'use client';
import React, { useState } from 'react';
import { Link } from '@/lib/router';
import { Avatar } from '../ui/Avatar';
import { useAppState } from '../../contexts/AppStateContext';
import { isActive } from '../../utils/ticketMeta';
import { cn } from '../../utils/cn';
import type { Ticket } from '../../types/ticket';

export function WorkloadList({ tickets, compact }: {tickets: Ticket[];compact?: boolean;}) {
  const { users, teams, currentUser } = useAppState();
  const isAdminUser = currentUser?.role === 'admin';
  const [mode, setMode] = useState<'agent' | 'team'>('agent');
  const active = tickets.filter((t) => isActive(t.status));

  const rows =
  mode === 'agent' ?
  users.
  filter((u) => u.role !== 'requester' && u.status === 'active').
  map((u) => ({ id: u.id, name: u.name, sub: teams.find((t) => u.teamIds.includes(t.id))?.name ?? 'No team', count: active.filter((t) => t.assigneeId === u.id).length, urgent: active.filter((t) => t.assigneeId === u.id && t.priority === 'urgent').length, link: `/admin/users/${u.id}`, avatar: true })) :
  teams.
  filter((t) => t.active).
  map((t) => ({ id: t.id, name: t.name, sub: `${t.memberIds.length} members`, count: active.filter((x) => x.teamId === t.id).length, urgent: active.filter((x) => x.teamId === t.id && x.priority === 'urgent').length, link: `/admin/teams/${t.id}`, avatar: false }));
  const sorted = rows.sort((a, b) => b.count - a.count).slice(0, compact ? 6 : undefined);
  const max = Math.max(1, ...sorted.map((r) => r.count));

  return (
    <div className="px-4 pb-4 sm:px-5">
      <div className="mb-3 inline-flex rounded-md border border-line bg-subtle p-0.5" role="tablist" aria-label="Group workload by">
        {(['agent', 'team'] as const).map((m) =>
        <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={cn('h-6 rounded px-2.5 text-[12px] font-medium transition-colors duration-150', mode === m ? 'bg-surface text-ink shadow-card' : 'text-ink-3 hover:text-ink')}>
            By {m}
          </button>
        )}
      </div>
      <ul className="space-y-2.5">
        {sorted.map((r) =>
        <li key={r.id}>
            <Link to={isAdminUser ? r.link : `/queue/all`} className="group flex items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
              {r.avatar && <Avatar name={r.name} id={r.id} size="sm" />}
              <span className="w-32 min-w-0 shrink-0">
                <span className="block truncate text-[13px] text-ink group-hover:underline">{r.name}</span>
                <span className="block truncate text-2xs text-ink-3">{r.sub}</span>
              </span>
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
                <span className="absolute inset-y-0 left-0 rounded-full bg-ink/70" style={{ width: `${r.count / max * 100}%` }} />
              </span>
              <span className="w-14 text-right text-[12px] tabular-nums">
                <span className="font-medium text-ink">{r.count}</span>
                {r.urgent > 0 && <span className="ml-1 text-danger-fg" title={`${r.urgent} urgent`}>·{r.urgent}!</span>}
              </span>
            </Link>
          </li>
        )}
      </ul>
      <p className="mt-3 text-2xs text-ink-3">Active tickets (Open, In Progress, Pending). <span className="text-danger-fg">!</span> marks urgent.</p>
    </div>);

}
