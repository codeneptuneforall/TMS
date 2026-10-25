'use client';
import React from 'react';
import { Link, useNavigate } from '@/lib/router';
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, PaperclipIcon, UserPlusIcon } from 'lucide-react';
import { Checkbox } from '../ui/Checkbox';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/States';
import { StatusMenu } from './StatusMenu';
import { PriorityMenu } from './PriorityMenu';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { awaitingAgent, awaitingRequester } from '../../utils/permissions';
import { dueStatus, formatDate, formatDateTime, relativeTime } from '../../utils/time';
import { cn } from '../../utils/cn';
import type { SortKey, SortState } from '../../hooks/useTicketQuery';
import type { Ticket } from '../../types/ticket';

interface TicketTableProps {
  rows: Ticket[];
  sort: SortState;
  onSort: (key: SortKey) => void;
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
}

const stop = (e: React.SyntheticEvent) => e.stopPropagation();

export function TicketTable({ rows, sort, onSort, selected, onSelectedChange }: TicketTableProps) {
  const user = useCurrentUser();
  const { getUser, getTeam, density } = useAppState();
  const { openAssign } = useWorkflow();
  const navigate = useNavigate();
  const staff = user.role !== 'requester';
  const rowH = density === 'compact' ? 'h-10' : 'h-[52px]';

  const pageIds = rows.map((r) => r.id);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someSelected = pageIds.some((id) => selected.includes(id));

  const toggleAll = () => onSelectedChange(allSelected ? selected.filter((id) => !pageIds.includes(id)) : Array.from(new Set([...selected, ...pageIds])));
  const toggleOne = (id: string) => onSelectedChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  const s = { sort, onSort };

  return (
    <div className="hidden overflow-x-auto rounded-lg border border-line bg-surface shadow-card md:block">
      <table className="w-full min-w-[720px] table-fixed border-collapse text-[13px]">
        <thead className="border-b border-line bg-subtle">
          <tr>
            {staff &&
            <th scope="col" className="w-11 pl-4">
                <Checkbox aria-label="Select all tickets on this page" checked={allSelected} indeterminate={!allSelected && someSelected} onChange={toggleAll} />
              </th>
            }
            <SortTh {...s} k="id" className="w-[112px]">Ticket</SortTh>
            <SortTh {...s} k="subject">Subject</SortTh>
            {staff && <SortTh {...s} k="requester" className="hidden w-[176px] lg:table-cell">Requester</SortTh>}
            <SortTh {...s} k="assignee" className="w-[168px]">{staff ? 'Assignee' : 'Agent'}</SortTh>
            {staff && <SortTh {...s} className="hidden w-[150px] xl:table-cell">Team</SortTh>}
            <SortTh {...s} k="priority" className="w-[108px]">Priority</SortTh>
            <SortTh {...s} k="status" className="w-[140px]">Status</SortTh>
            <SortTh {...s} k="createdAt" className="hidden w-[116px] 2xl:table-cell">Created</SortTh>
            {staff && <SortTh {...s} k="dueAt" className="hidden w-[124px] xl:table-cell">Due</SortTh>}
            <SortTh {...s} k="updatedAt" className="w-[100px]">Activity</SortTh>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => {
            const requester = getUser(t.requesterId);
            const assignee = getUser(t.assigneeId);
            const team = getTeam(t.teamId);
            const isSel = selected.includes(t.id);
            const due = dueStatus(t.dueAt, t.status);
            const needsReply = staff ? awaitingAgent(t) && !!t.assigneeId : awaitingRequester(t);
            return (
              <tr
                key={t.id}
                onClick={() => navigate(`/tickets/${t.id}`)}
                className={cn('cursor-pointer border-b border-line transition-colors duration-100 last:border-b-0', rowH, isSel ? 'bg-accent-soft/60' : 'hover:bg-subtle')}>
                
                {staff &&
                <td className="pl-4" onClick={stop}>
                    <Checkbox aria-label={`Select ${t.id}`} checked={isSel} onChange={() => toggleOne(t.id)} />
                  </td>
                }
                <td className="px-3">
                  <span className="ticket-id text-[12px] text-ink-3">{t.id}</span>
                </td>
                <td className="px-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {needsReply &&
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" title={staff ? 'Awaiting your reply' : 'Waiting on you'}>
                        <span className="sr-only">{staff ? 'Awaiting agent reply.' : 'Waiting on you.'}</span>
                      </span>
                    }
                    <Link to={`/tickets/${t.id}`} onClick={stop} className="truncate font-medium text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm" title={t.subject}>
                      {t.subject}
                    </Link>
                    {(t.attachments.length > 0 || t.messages.some((m) => m.attachments.length)) && <PaperclipIcon className="h-3.5 w-3.5 shrink-0 text-ink-3" aria-label="Has attachments" />}
                  </div>
                  {staff && density !== 'compact' && <div className="mt-0.5 truncate text-[12px] text-ink-3 lg:hidden">{requester?.name}</div>}
                </td>
                {staff &&
                <td className="hidden px-3 lg:table-cell">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar name={requester?.name ?? '?'} id={t.requesterId} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-ink">{requester?.name}</span>
                        {density !== 'compact' && <span className="block truncate text-[12px] text-ink-3">{requester?.organization}</span>}
                      </span>
                    </div>
                  </td>
                }
                <td className="px-3" onClick={stop}>
                  {staff && t.status !== 'closed' ?
                  <button
                    type="button"
                    onClick={() => openAssign([t.id])}
                    aria-label={assignee ? `Assigned to ${assignee.name}. Reassign` : 'Unassigned. Assign agent'}
                    className="-mx-1.5 flex max-w-full items-center gap-2 rounded-md px-1.5 py-1 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
                    
                      {assignee ?
                    <>
                          <Avatar name={assignee.name} id={assignee.id} size="sm" />
                          <span className="truncate text-ink">{assignee.id === user.id ? 'You' : assignee.name}</span>
                        </> :

                    <>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-line-strong text-ink-3">
                            <UserPlusIcon className="h-3 w-3" aria-hidden />
                          </span>
                          <span className="text-ink-3">Unassigned</span>
                        </>
                    }
                    </button> :

                  <span className="flex items-center gap-2">
                      {assignee ? <Avatar name={assignee.name} id={assignee.id} size="sm" /> : null}
                      <span className={cn('truncate', assignee ? 'text-ink' : 'text-ink-3')}>{assignee?.name ?? (staff ? 'Unassigned' : 'Awaiting agent')}</span>
                    </span>
                  }
                </td>
                {staff && <td className="hidden truncate px-3 text-ink-2 xl:table-cell">{team?.name ?? '—'}</td>}
                <td className="px-3" onClick={stop}>
                  <PriorityMenu ticket={t} editable={staff} />
                </td>
                <td className="px-3" onClick={stop}>
                  <StatusMenu ticket={t} />
                </td>
                <td className="hidden px-3 tabular-nums text-ink-2 2xl:table-cell">
                  <time dateTime={t.createdAt} title={formatDateTime(t.createdAt)}>{formatDate(t.createdAt)}</time>
                </td>
                {staff &&
                <td className="hidden px-3 xl:table-cell">
                    {due ? <Badge tone={due.tone}>{due.label}</Badge> : <span className="text-ink-3">—</span>}
                  </td>
                }
                <td className="px-3 tabular-nums text-ink-3">
                  <time dateTime={t.updatedAt} title={formatDateTime(t.updatedAt)}>{relativeTime(t.updatedAt)}</time>
                </td>
              </tr>);

          })}
        </tbody>
      </table>
    </div>);

}

interface SortThProps {
  k?: SortKey;
  children: React.ReactNode;
  className?: string;
  sort: SortState;
  onSort: (key: SortKey) => void;
}

function SortTh({ k, children, className, sort, onSort }: SortThProps) {
  const active = k && sort.key === k;
  return (
    <th scope="col" aria-sort={active ? sort.dir === 'asc' ? 'ascending' : 'descending' : undefined} className={cn('h-9 whitespace-nowrap px-3 text-left text-[12px] font-medium text-ink-3', className)}>
      {k ?
      <button type="button" onClick={() => onSort(k)} className={cn('-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50', active && 'text-ink')}>
          {children}
          {active ? sort.dir === 'asc' ? <ArrowUpIcon className="h-3 w-3" aria-hidden /> : <ArrowDownIcon className="h-3 w-3" aria-hidden /> : <ChevronsUpDownIcon className="h-3 w-3 opacity-40" aria-hidden />}
        </button> :

      children
      }
    </th>);

}

export function TicketTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card" aria-busy="true" aria-label="Loading tickets">
      <div className="h-9 border-b border-line bg-subtle" />
      {Array.from({ length: 8 }).map((_, i) =>
      <div key={i} className="flex h-[52px] items-center gap-4 border-b border-line px-4 last:border-b-0">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className={cn('h-3', i % 3 === 0 ? 'w-2/5' : i % 3 === 1 ? 'w-1/3' : 'w-1/2')} />
          <Skeleton className="ml-auto hidden h-6 w-6 rounded-full md:block" />
          <Skeleton className="hidden h-3 w-20 md:block" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
      )}
    </div>);

}
