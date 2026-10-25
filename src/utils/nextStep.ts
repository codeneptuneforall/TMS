import type { Ticket } from '../types/ticket';
import type { User } from '../types/user';
import type { Tone } from './ticketMeta';
import { awaitingAgent } from './permissions';
import { relativeTime } from './time';

export type NextAction = 'assign_me' | 'start' | 'reply' | 'reopen' | 'none';

export interface NextStep {
  tone: Tone;
  text: string;
  action: NextAction;
}

/** Plain-language summary of who owns the ticket and what should happen next. */
export function nextStep(ticket: Ticket, viewer: User, names: {requester?: string;assignee?: string;}): NextStep {
  const requester = names.requester ?? 'the requester';
  const assignee = names.assignee;
  const mine = ticket.assigneeId === viewer.id;
  const lastResolved = [...ticket.activity].reverse().find((a) => a.kind === 'resolved');

  if (viewer.role === 'requester') {
    switch (ticket.status) {
      case 'open':
        return { tone: 'info', text: assignee ? `${assignee} has your request and will reply soon.` : 'Your request is in the queue. An agent will pick it up shortly.', action: 'none' };
      case 'in_progress':
        return { tone: 'violet', text: `${assignee ?? 'Our team'} is working on this.`, action: 'none' };
      case 'pending':
        return ticket.pendingReason === 'requester' ?
        { tone: 'warning', text: 'We need your reply to continue. Answering below moves the ticket back to our team.', action: 'reply' } :
        { tone: 'warning', text: 'We’re waiting on a third party. We’ll update you as soon as we hear back.', action: 'none' };
      case 'resolved':
        return { tone: 'success', text: 'We marked this as resolved. Replying or reopening within 7 days sends it back to our team.', action: 'reopen' };
      case 'closed':
        return { tone: 'neutral', text: 'This request is closed. Create a new ticket if you need more help.', action: 'none' };
    }
  }

  if (ticket.status === 'closed') return { tone: 'neutral', text: 'Closed and read-only. Only administrators can reopen it.', action: viewer.role === 'admin' ? 'reopen' : 'none' };
  if (ticket.status === 'resolved')
  return { tone: 'success', text: `Resolved ${lastResolved ? relativeTime(lastResolved.createdAt) : ''}. It closes automatically after 7 days unless ${requester} reopens it.`, action: 'none' };
  if (!ticket.assigneeId) return { tone: 'warning', text: 'No one owns this ticket yet. Take it or assign it to a teammate.', action: 'assign_me' };
  if (ticket.status === 'pending')
  return ticket.pendingReason === 'requester' ?
  { tone: 'warning', text: `Waiting on ${requester}. Their reply moves the ticket back to In Progress.`, action: 'none' } :
  { tone: 'warning', text: 'Waiting on a third party. The SLA clock is paused.', action: 'none' };
  if (ticket.status === 'open') return { tone: 'info', text: mine ? 'Assigned to you and not started yet.' : `Assigned to ${assignee}, not started yet.`, action: mine ? 'start' : 'none' };
  if (awaitingAgent(ticket)) return { tone: 'violet', text: mine ? `${requester} is waiting on your reply.` : `${requester} is waiting on a reply from ${assignee}.`, action: mine ? 'reply' : 'none' };
  return { tone: 'violet', text: mine ? `You replied last. Waiting for ${requester} to respond.` : `${assignee} replied last.`, action: 'none' };
}
