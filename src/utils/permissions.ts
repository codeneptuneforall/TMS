import type { Ticket } from '../types/ticket';
import type { User } from '../types/user';
import { isActive } from './ticketMeta';

/*
 * UI-level visibility helpers. These mirror the intended server rules so the
 * interface never offers something the API would reject — they are NOT a
 * substitute for authorization in the Express layer.
 */

export const isStaff = (user: User | null | undefined): boolean => !!user && user.role !== 'requester';
export const isAdmin = (user: User | null | undefined): boolean => user?.role === 'admin';
export const isManager = (user: User | null | undefined): boolean => user?.role === 'manager' || user?.role === 'admin';

export function canViewTicket(user: User, ticket: Ticket): boolean {
  if (user.role === 'admin' || user.role === 'manager') return true;
  if (user.role === 'requester') return ticket.requesterId === user.id;
  return (
    ticket.assigneeId === user.id ||
    ticket.assigneeId === null ||
    ticket.teamId !== null && user.teamIds.includes(ticket.teamId));

}

export function ticketsInScope(user: User, tickets: Ticket[]): Ticket[] {
  return tickets.filter((t) => canViewTicket(user, t));
}

export type QueueView = 'all' | 'mine' | 'unassigned' | 'team' | 'pending' | 'resolved' | 'closed' | 'search';

export const QUEUE_VIEWS: QueueView[] = ['all', 'mine', 'unassigned', 'team', 'pending', 'resolved', 'closed', 'search'];

export function ticketsForView(view: QueueView, user: User, tickets: Ticket[]): Ticket[] {
  const scope = ticketsInScope(user, tickets);
  switch (view) {
    case 'all':
    case 'search':
      return scope;
    case 'mine':
      return user.role === 'requester' ? scope : scope.filter((t) => t.assigneeId === user.id);
    case 'unassigned':
      return scope.filter((t) => t.assigneeId === null && isActive(t.status));
    case 'team':
      return user.role === 'admin' || user.role === 'manager' ?
      scope.filter((t) => t.teamId !== null) :
      scope.filter((t) => t.teamId !== null && user.teamIds.includes(t.teamId));
    case 'pending':
    case 'resolved':
    case 'closed':
      return scope.filter((t) => t.status === view);
  }
}

export function viewAllowed(view: QueueView, user: User): boolean {
  if (user.role !== 'requester') return true;
  return view === 'mine' || view === 'resolved' || view === 'search' || view === 'all';
}

export function lastPublicMessage(ticket: Ticket) {
  for (let i = ticket.messages.length - 1; i >= 0; i -= 1) {
    if (ticket.messages[i].visibility === 'public') return ticket.messages[i];
  }
  return null;
}

/** Staff side: the requester spoke last (or nobody has replied yet) and the ticket is active. */
export function awaitingAgent(ticket: Ticket): boolean {
  if (ticket.status !== 'open' && ticket.status !== 'in_progress') return false;
  const last = lastPublicMessage(ticket);
  return !last || last.authorId === ticket.requesterId;
}

/** Requester side: support is waiting on the requester. */
export function awaitingRequester(ticket: Ticket): boolean {
  return ticket.status === 'pending' && ticket.pendingReason === 'requester';
}
