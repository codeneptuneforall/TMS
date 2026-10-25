'use client';
import React, { useState } from 'react';
import { Link } from '@/lib/router';
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CopyIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PanelRightIcon,
  PencilIcon,
  UserPlusIcon,
  UsersRoundIcon } from
'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Popover } from '../ui/Popover';
import { MenuItem, MenuSeparator } from '../ui/Menu';
import { StatusMenu } from './StatusMenu';
import { PriorityIndicator } from './PriorityIndicator';
import { EditTicketDialog } from './EditTicketDialog';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { allowedTransitions, TONE_CLASSES } from '../../utils/ticketMeta';
import { dueStatus, formatDateTime, relativeTime } from '../../utils/time';
import { nextStep } from '../../utils/nextStep';
import { cn } from '../../utils/cn';
import type { Ticket } from '../../types/ticket';

interface TicketHeaderProps {
  ticket: Ticket;
  onOpenDetails: () => void;
}

export function TicketHeader({ ticket, onOpenDetails }: TicketHeaderProps) {
  const user = useCurrentUser();
  const { getUser, assign } = useAppState();
  const { requestStatus, openAssign, openTeam } = useWorkflow();
  const [editing, setEditing] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const staff = user.role !== 'requester';
  const requester = getUser(ticket.requesterId);
  const assignee = getUser(ticket.assigneeId);
  const due = staff ? dueStatus(ticket.dueAt, ticket.status) : null;
  const step = nextStep(ticket, user, { requester: requester?.name, assignee: assignee?.name });
  const transitions = allowedTransitions(ticket.status, user.role);

  const assignToMe = async () => {
    setAssigning(true);
    const res = await assign([ticket.id], user.id);
    setAssigning(false);
    if (res.ok) toast.success(`You now own ${ticket.id}`);else
    toast.error('Assignment failed', { description: res.error });
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).then(
      () => toast.success(`${label} copied`),
      () => toast.error(`Couldn’t copy ${label.toLowerCase()}`)
    );
  };

  const primary = (() => {
    if (staff) {
      if (step.action === 'assign_me') return <Button variant="primary" size="sm" loading={assigning} onClick={assignToMe} leadingIcon={<UserPlusIcon className="h-4 w-4" />}>Assign to me</Button>;
      if (step.action === 'start') return <Button variant="primary" size="sm" onClick={() => requestStatus([ticket.id], 'in_progress')}>Start work</Button>;
      if (ticket.status === 'in_progress' || ticket.status === 'pending' || ticket.status === 'open' && ticket.assigneeId) return <Button variant="primary" size="sm" onClick={() => requestStatus([ticket.id], 'resolved')}>Resolve</Button>;
      if (ticket.status === 'resolved') return <Button size="sm" onClick={() => requestStatus([ticket.id], 'open')}>Reopen</Button>;
      if (ticket.status === 'closed' && user.role === 'admin') return <Button size="sm" onClick={() => requestStatus([ticket.id], 'open')}>Reopen</Button>;
      return null;
    }
    if (ticket.status === 'resolved') return <Button size="sm" onClick={() => requestStatus([ticket.id], 'open')}>Reopen</Button>;
    if (transitions.includes('resolved')) return <Button size="sm" onClick={() => requestStatus([ticket.id], 'resolved')}>Mark as resolved</Button>;
    return null;
  })();

  const backTo = staff ? ticket.assigneeId === user.id ? '/queue/mine' : '/queue/all' : '/queue/mine';

  return (
    <header className="shrink-0 border-b border-line bg-surface">
      <div className="px-4 pb-3 pt-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Link to={backTo} className="-ml-1.5 flex h-8 items-center gap-1 rounded-md px-1.5 text-[12px] text-ink-3 hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
            <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">{staff ? ticket.assigneeId === user.id ? 'My Tickets' : 'All Tickets' : 'My Tickets'}</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <span className="text-ink-3" aria-hidden>/</span>
          <button type="button" onClick={() => copy(ticket.id, 'Ticket ID')} className="group inline-flex items-center gap-1 rounded px-1 text-[12px] text-ink-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50" aria-label={`Copy ticket ID ${ticket.id}`}>
            <span className="ticket-id">{ticket.id}</span>
            <CopyIcon className="h-3 w-3 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            {primary && <span className="hidden sm:inline-flex">{primary}</span>}
            {staff && <span className="hidden md:inline-flex"><StatusMenu ticket={ticket} variant="button" /></span>}
            <Button size="sm" onClick={onOpenDetails} leadingIcon={<PanelRightIcon className="h-4 w-4" />} className="xl:hidden">
              Details
            </Button>
            <Popover
              align="end"
              label="More actions"
              className="w-56"
              trigger={({ ref, toggle, open }) =>
              <Button ref={ref} size="icon-sm" onClick={toggle} aria-expanded={open} aria-haspopup="menu" aria-label="More actions">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              }>
              
              {(close) => {
                const run = (fn: () => void) => () => {
                  close();
                  fn();
                };
                return (
                  <div role="menu">
                    {staff && ticket.status !== 'closed' &&
                    <>
                        <MenuItem icon={<PencilIcon />} onSelect={run(() => setEditing(true))}>Edit ticket</MenuItem>
                        <MenuItem icon={<UserPlusIcon />} onSelect={run(() => openAssign([ticket.id]))}>Assign agent</MenuItem>
                        <MenuItem icon={<UsersRoundIcon />} onSelect={run(() => openTeam([ticket.id]))}>Change team</MenuItem>
                        <MenuSeparator />
                      </>
                    }
                    <MenuItem icon={<LinkIcon />} onSelect={run(() => copy(window.location.href, 'Link'))}>Copy link</MenuItem>
                    {staff &&
                    <>
                        <MenuSeparator />
                        <MenuItem
                        icon={<ArchiveIcon />}
                        tone="danger"
                        disabled={!transitions.includes('closed')}
                        hint={!transitions.includes('closed') && ticket.status !== 'closed' ? 'Resolve first' : undefined}
                        onSelect={run(() => requestStatus([ticket.id], 'closed'))}>
                        
                          Close ticket
                        </MenuItem>
                      </>
                    }
                  </div>);

              }}
            </Popover>
          </div>
        </div>

        <h1 className="mt-2 break-words text-lg font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-xl">{ticket.subject}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-ink-3">
          {staff ? <span className="md:hidden"><StatusMenu ticket={ticket} /></span> : <StatusMenu ticket={ticket} />}
          <PriorityIndicator priority={ticket.priority} />
          {due && <Badge tone={due.tone}>{due.label}</Badge>}
          <span>
            Opened by <span className="text-ink-2">{requester?.id === user.id ? 'you' : requester?.name}</span>{' '}
            <time dateTime={ticket.createdAt} title={formatDateTime(ticket.createdAt)}>{relativeTime(ticket.createdAt)}</time>
          </span>
        </div>
      </div>

      <div className={cn('flex items-center gap-3 border-t border-line px-4 py-2 sm:px-6', TONE_CLASSES[step.tone].soft)} role="status">
        <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', TONE_CLASSES[step.tone].dot)} aria-hidden />
        <p className={cn('min-w-0 flex-1 text-[13px]', TONE_CLASSES[step.tone].text)}>{step.text}</p>
        {primary && <span className="sm:hidden">{primary}</span>}
      </div>

      {staff && <EditTicketDialog ticket={ticket} open={editing} onClose={() => setEditing(false)} />}
    </header>);

}
