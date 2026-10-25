'use client';
import React, { useState } from 'react';
import { Link } from '@/lib/router';
import { ChevronDownIcon, PlusIcon, UserPlusIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Popover } from '../ui/Popover';
import { MenuItem, MenuLabel } from '../ui/Menu';
import { StatusMenu } from './StatusMenu';
import { PriorityMenu } from './PriorityMenu';
import { AttachmentCard } from './AttachmentCard';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { PENDING_REASON_LABEL } from '../../utils/ticketMeta';
import { dueStatus, formatDateTime, relativeTime } from '../../utils/time';
import type { Ticket } from '../../types/ticket';

const valueBtn =
'-mx-1.5 flex max-w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-[13px] text-ink hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';

function Row({ label, children }: {label: string;children: React.ReactNode;}) {
  return (
    <div className="grid min-h-[32px] grid-cols-[96px_1fr] items-center gap-3">
      <dt className="text-[12px] text-ink-3">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>);

}

export function TicketMetaPanel({ ticket }: {ticket: Ticket;}) {
  const user = useCurrentUser();
  const { getUser, getTeam, getCategory, categories, tickets, updateTicket } = useAppState();
  const { openAssign, openTeam } = useWorkflow();
  const [tag, setTag] = useState('');
  const staff = user.role !== 'requester';
  const editable = staff && ticket.status !== 'closed';
  const requester = getUser(ticket.requesterId);
  const assignee = getUser(ticket.assigneeId);
  const team = getTeam(ticket.teamId);
  const category = getCategory(ticket.categoryId);
  const due = dueStatus(ticket.dueAt, ticket.status);
  const otherTickets = tickets.filter((t) => t.requesterId === ticket.requesterId && t.id !== ticket.id).length;
  const files = [...ticket.attachments, ...ticket.messages.filter((m) => staff || m.visibility === 'public').flatMap((m) => m.attachments)];

  const save = async (patch: Parameters<typeof updateTicket>[1], success: string) => {
    const res = await updateTicket(ticket.id, patch);
    if (res.ok) toast.success(success);else
    toast.error('Change not saved', { description: res.error });
  };

  const addTag = () => {
    const value = tag.trim().toLowerCase().replace(/\s+/g, '-');
    if (!value || ticket.tags.includes(value)) return setTag('');
    setTag('');
    save({ tags: [...ticket.tags, value] }, `Tag “${value}” added`);
  };

  return (
    <div className="divide-y divide-line">
      {staff && requester &&
      <section className="px-5 py-4" aria-labelledby="requester-heading">
          <h2 id="requester-heading" className="mb-3 text-[12px] font-medium text-ink-3">Requester</h2>
          <div className="flex items-center gap-3">
            <Avatar name={requester.name} id={requester.id} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-ink">{requester.name}</p>
              <p className="truncate text-[12px] text-ink-3">{requester.title} · {requester.organization}</p>
            </div>
          </div>
          <dl className="mt-3 space-y-1 text-[12px]">
            <div className="flex justify-between gap-3"><dt className="text-ink-3">Email</dt><dd className="truncate text-ink-2">{requester.email}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-ink-3">Other tickets</dt>
              <dd>
                {otherTickets > 0 ?
              <Link to={`/queue/search?q=${encodeURIComponent(requester.name)}`} className="font-medium text-accent-fg hover:underline">{otherTickets} tickets</Link> :
              <span className="text-ink-2">None</span>}
              </dd>
            </div>
          </dl>
        </section>
      }

      <section className="px-5 py-4" aria-labelledby="props-heading">
        <h2 id="props-heading" className="mb-2 text-[12px] font-medium text-ink-3">Properties</h2>
        <dl className="space-y-0.5">
          <Row label="Status"><StatusMenu ticket={ticket} /></Row>
          {ticket.status === 'pending' && ticket.pendingReason && <Row label="Waiting on"><span className="text-[13px] text-ink-2">{PENDING_REASON_LABEL[ticket.pendingReason].replace('Waiting on ', '')}</span></Row>}
          <Row label="Priority"><PriorityMenu ticket={ticket} editable={editable} /></Row>
          <Row label={staff ? 'Assignee' : 'Agent'}>
            {editable ?
            <button type="button" className={valueBtn} onClick={() => openAssign([ticket.id])} aria-label={assignee ? `Assignee: ${assignee.name}. Change` : 'Assign agent'}>
                {assignee ? <><Avatar name={assignee.name} id={assignee.id} size="sm" /><span className="truncate">{assignee.id === user.id ? `${assignee.name} (you)` : assignee.name}</span></> : <><UserPlusIcon className="h-4 w-4 text-ink-3" aria-hidden /><span className="text-ink-3">Assign agent</span></>}
              </button> :

            <span className="flex items-center gap-2 text-[13px] text-ink">{assignee && <Avatar name={assignee.name} id={assignee.id} size="sm" />}{assignee?.name ?? <span className="text-ink-3">Not yet assigned</span>}</span>
            }
          </Row>
          <Row label="Team">
            {editable ?
            <button type="button" className={valueBtn} onClick={() => openTeam([ticket.id])} aria-label={`Team: ${team?.name ?? 'None'}. Change`}>
                <span className="truncate">{team?.name ?? 'No team'}</span>
              </button> :
            <span className="text-[13px] text-ink">{team?.name ?? '—'}</span>}
          </Row>
          <Row label="Category">
            {editable ?
            <Popover
              label="Change category"
              trigger={({ ref, toggle, open }) =>
              <button ref={ref} type="button" onClick={toggle} aria-expanded={open} className={valueBtn} aria-label={`Category: ${category?.name}. Change`}>
                    <span className="truncate">{category?.name}</span>
                    <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-ink-3" aria-hidden />
                  </button>
              }>
              
                {(close) =>
              <div role="menu">
                    <MenuLabel>Category</MenuLabel>
                    {categories.filter((c) => c.active).map((c) =>
                <MenuItem key={c.id} selected={c.id === ticket.categoryId} onSelect={() => {close();if (c.id !== ticket.categoryId) save({ categoryId: c.id }, `Category set to ${c.name}`);}}>
                        {c.name}
                      </MenuItem>
                )}
                  </div>
              }
              </Popover> :
            <span className="text-[13px] text-ink">{category?.name}</span>}
          </Row>
        </dl>
      </section>

      <section className="px-5 py-4" aria-labelledby="dates-heading">
        <h2 id="dates-heading" className="mb-2 text-[12px] font-medium text-ink-3">Dates</h2>
        <dl className="space-y-0.5">
          <Row label="Created"><time dateTime={ticket.createdAt} className="text-[13px] tabular-nums text-ink">{formatDateTime(ticket.createdAt)}</time></Row>
          <Row label="Last activity"><time dateTime={ticket.updatedAt} title={formatDateTime(ticket.updatedAt)} className="text-[13px] tabular-nums text-ink">{relativeTime(ticket.updatedAt)}</time></Row>
          {staff &&
          <Row label="Resolution due">
              {due ? <Badge tone={due.tone}>{due.label}</Badge> : <span className="text-[13px] text-ink-3">{ticket.status === 'pending' ? 'Paused while pending' : '—'}</span>}
            </Row>
          }
        </dl>
      </section>

      {staff &&
      <section className="px-5 py-4" aria-labelledby="tags-heading">
          <h2 id="tags-heading" className="mb-2 text-[12px] font-medium text-ink-3">Tags</h2>
          <ul className="flex flex-wrap gap-1.5">
            {ticket.tags.map((t) =>
          <li key={t} className="inline-flex h-6 items-center gap-1 rounded-md bg-muted pl-2 pr-1 text-[12px] text-ink-2">
                {t}
                {editable &&
            <button type="button" onClick={() => save({ tags: ticket.tags.filter((x) => x !== t) }, `Tag “${t}” removed`)} aria-label={`Remove tag ${t}`} className="rounded p-0.5 text-ink-3 hover:bg-line hover:text-ink">
                    <XIcon className="h-3 w-3" />
                  </button>
            }
              </li>
          )}
            {ticket.tags.length === 0 && !editable && <li className="text-[13px] text-ink-3">No tags</li>}
          </ul>
          {editable &&
        <form onSubmit={(e) => {e.preventDefault();addTag();}} className="mt-2 flex items-center gap-1.5">
              <label htmlFor="add-tag" className="sr-only">Add tag</label>
              <input id="add-tag" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Add tag" className="h-7 min-w-0 flex-1 rounded-md border border-line bg-surface px-2 text-[12px] placeholder:text-ink-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15" />
              <button type="submit" aria-label="Add tag" disabled={!tag.trim()} className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-2 hover:bg-muted disabled:opacity-40">
                <PlusIcon className="h-3.5 w-3.5" />
              </button>
            </form>
        }
        </section>
      }

      {files.length > 0 &&
      <section className="px-5 py-4" aria-labelledby="files-heading">
          <h2 id="files-heading" className="mb-2 text-[12px] font-medium text-ink-3">Files · {files.length}</h2>
          <div className="space-y-1.5 [&>button]:w-full">
            {files.map((f) => <AttachmentCard key={f.id} attachment={f} />)}
          </div>
        </section>
      }
    </div>);

}
