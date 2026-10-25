'use client';
import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { FilterMenu, type FilterOption } from './FilterMenu';
import { PriorityGlyph } from './PriorityIndicator';
import { Avatar } from '../ui/Avatar';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER, TONE_CLASSES } from '../../utils/ticketMeta';
import { cn } from '../../utils/cn';
import type { TicketQuery, FilterKey } from '../../hooks/useTicketQuery';
import type { Ticket } from '../../types/ticket';

interface TicketFilterBarProps {
  query: TicketQuery;
  base: Ticket[];
}

export function TicketFilterBar({ query, base }: TicketFilterBarProps) {
  const user = useCurrentUser();
  const { users, teams, getUser, getTeam } = useAppState();
  const staff = user.role !== 'requester';

  const count = (fn: (t: Ticket) => boolean) => base.filter(fn).length;

  const statusOptions: FilterOption[] = STATUS_ORDER.map((s) => ({
    value: s,
    label: STATUS_META[s].label,
    icon: <span className={cn('h-2 w-2 rounded-full', TONE_CLASSES[STATUS_META[s].tone].dot)} aria-hidden />,
    count: count((t) => t.status === s)
  }));
  const priorityOptions: FilterOption[] = PRIORITY_ORDER.map((p) => ({
    value: p,
    label: PRIORITY_META[p].label,
    icon: <PriorityGlyph priority={p} />,
    count: count((t) => t.priority === p)
  }));
  const assigneeOptions: FilterOption[] = [
  { value: 'unassigned', label: 'Unassigned', count: count((t) => !t.assigneeId) },
  ...users.
  filter((u) => u.role !== 'requester' && u.status === 'active').
  map((u) => ({
    value: u.id,
    label: u.id === user.id ? `${u.name} (you)` : u.name,
    icon: <Avatar name={u.name} id={u.id} size="xs" />,
    count: count((t) => t.assigneeId === u.id)
  }))];

  const teamOptions: FilterOption[] = teams.filter((t) => t.active).map((t) => ({ value: t.id, label: t.name, count: count((x) => x.teamId === t.id) }));

  const chips: {key: FilterKey;value: string;label: string;}[] = [
  ...query.filters.statuses.map((v) => ({ key: 'statuses' as const, value: v, label: `Status: ${STATUS_META[v].label}` })),
  ...query.filters.priorities.map((v) => ({ key: 'priorities' as const, value: v, label: `Priority: ${PRIORITY_META[v].label}` })),
  ...query.filters.assignees.map((v) => ({ key: 'assignees' as const, value: v, label: `Assignee: ${v === 'unassigned' ? 'Unassigned' : getUser(v)?.name}` })),
  ...query.filters.teams.map((v) => ({ key: 'teams' as const, value: v, label: `Team: ${getTeam(v)?.name}` }))];


  return (
    <div className="space-y-2.5">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
          <input
            type="search"
            value={query.search}
            onChange={(e) => query.setSearch(e.target.value)}
            placeholder={staff ? 'Filter by ID, subject, requester' : 'Filter by ID or subject'}
            aria-label="Filter tickets"
            className="h-8 w-full rounded-md border border-line-strong bg-surface pl-9 pr-3 text-[13px] text-ink shadow-card placeholder:text-ink-3 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15" />
          
        </div>
        <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5 lg:pb-0">
          <FilterMenu label="Status" options={statusOptions} selected={query.filters.statuses} onToggle={(v) => query.toggle('statuses', v as never)} onClear={() => query.clear('statuses')} />
          <FilterMenu label="Priority" options={priorityOptions} selected={query.filters.priorities} onToggle={(v) => query.toggle('priorities', v as never)} onClear={() => query.clear('priorities')} />
          {staff &&
          <>
              <FilterMenu label="Assignee" searchable options={assigneeOptions} selected={query.filters.assignees} onToggle={(v) => query.toggle('assignees', v)} onClear={() => query.clear('assignees')} />
              <FilterMenu label="Team" options={teamOptions} selected={query.filters.teams} onToggle={(v) => query.toggle('teams', v)} onClear={() => query.clear('teams')} />
            </>
          }
          {query.activeCount > 0 &&
          <button type="button" onClick={query.resetAll} className="h-8 shrink-0 rounded-md px-2 text-[13px] font-medium text-ink-2 hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
              Reset
            </button>
          }
        </div>
        <p className="shrink-0 text-[12px] tabular-nums text-ink-3 lg:ml-auto" aria-live="polite">
          {query.total} {query.total === 1 ? 'ticket' : 'tickets'}
          {query.activeCount > 0 && ` of ${base.length}`}
        </p>
      </div>

      {chips.length > 0 &&
      <ul className="flex flex-wrap gap-1.5" aria-label="Active filters">
          {chips.map((c) =>
        <li key={`${c.key}-${c.value}`}>
              <button
            type="button"
            onClick={() => query.toggle(c.key, c.value as never)}
            aria-label={`Remove filter ${c.label}`}
            className="inline-flex h-6 items-center gap-1 rounded-md bg-muted pl-2 pr-1 text-[12px] text-ink-2 hover:bg-line hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
            
                {c.label}
                <XIcon className="h-3 w-3" aria-hidden />
              </button>
            </li>
        )}
        </ul>
      }
    </div>);

}
