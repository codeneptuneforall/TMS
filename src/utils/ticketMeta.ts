import type { PendingReason, TicketPriority, TicketStatus } from '../types/ticket';
import type { Role } from '../types/user';

export type Tone = 'info' | 'violet' | 'warning' | 'success' | 'neutral' | 'orange' | 'danger' | 'accent';

export const TONE_CLASSES: Record<Tone, {badge: string;dot: string;text: string;soft: string;bar: string;}> = {
  info: { badge: 'bg-info-soft text-info-fg ring-info/20', dot: 'bg-info', text: 'text-info-fg', soft: 'bg-info-soft', bar: 'bg-info' },
  violet: { badge: 'bg-violet-soft text-violet-fg ring-violet/20', dot: 'bg-violet', text: 'text-violet-fg', soft: 'bg-violet-soft', bar: 'bg-violet' },
  warning: { badge: 'bg-warning-soft text-warning-fg ring-warning/25', dot: 'bg-warning', text: 'text-warning-fg', soft: 'bg-warning-soft', bar: 'bg-warning' },
  success: { badge: 'bg-success-soft text-success-fg ring-success/20', dot: 'bg-success', text: 'text-success-fg', soft: 'bg-success-soft', bar: 'bg-success' },
  neutral: { badge: 'bg-neutral-soft text-neutral-fg ring-neutral/20', dot: 'bg-neutral', text: 'text-neutral-fg', soft: 'bg-neutral-soft', bar: 'bg-neutral' },
  orange: { badge: 'bg-orange-soft text-orange-fg ring-orange/20', dot: 'bg-orange', text: 'text-orange-fg', soft: 'bg-orange-soft', bar: 'bg-orange' },
  danger: { badge: 'bg-danger-soft text-danger-fg ring-danger/20', dot: 'bg-danger', text: 'text-danger-fg', soft: 'bg-danger-soft', bar: 'bg-danger' },
  accent: { badge: 'bg-accent-soft text-accent-fg ring-accent/20', dot: 'bg-accent', text: 'text-accent-fg', soft: 'bg-accent-soft', bar: 'bg-accent' }
};

export const STATUS_META: Record<TicketStatus, {label: string;tone: Tone;description: string;chart: string;}> = {
  open: { label: 'Open', tone: 'info', description: 'New or reopened — waiting for an agent to start work.', chart: 'rgb(var(--info))' },
  in_progress: { label: 'In Progress', tone: 'violet', description: 'An agent is actively working on it.', chart: 'rgb(var(--violet))' },
  pending: { label: 'Pending', tone: 'warning', description: 'Paused while waiting on someone outside the support team.', chart: 'rgb(var(--warning))' },
  resolved: { label: 'Resolved', tone: 'success', description: 'A solution was provided. The requester can still reopen it.', chart: 'rgb(var(--success))' },
  closed: { label: 'Closed', tone: 'neutral', description: 'Archived and read-only. No further replies are accepted.', chart: 'rgb(var(--neutral))' }
};

export const STATUS_ORDER: TicketStatus[] = ['open', 'in_progress', 'pending', 'resolved', 'closed'];

export const PRIORITY_META: Record<TicketPriority, {label: string;tone: Tone;level: number;description: string;chart: string;}> = {
  low: { label: 'Low', tone: 'neutral', level: 1, description: 'Questions and minor issues with a workaround.', chart: 'rgb(var(--neutral))' },
  medium: { label: 'Medium', tone: 'info', level: 2, description: 'Something is impaired but work can continue.', chart: 'rgb(var(--info))' },
  high: { label: 'High', tone: 'orange', level: 3, description: 'Important functionality is blocked for several people.', chart: 'rgb(var(--orange))' },
  urgent: { label: 'Urgent', tone: 'danger', level: 4, description: 'Outage or business-critical impact. Respond immediately.', chart: 'rgb(var(--danger))' }
};

export const PRIORITY_ORDER: TicketPriority[] = ['urgent', 'high', 'medium', 'low'];

export const PENDING_REASON_LABEL: Record<PendingReason, string> = {
  requester: 'Waiting on requester',
  third_party: 'Waiting on third party'
};

export const ACTIVE_STATUSES: TicketStatus[] = ['open', 'in_progress', 'pending'];

export function isActive(status: TicketStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

export function isReopen(from: TicketStatus, to: TicketStatus): boolean {
  return to === 'open' && (from === 'resolved' || from === 'closed');
}

/** Client-side guidance only. The server is the source of truth for valid transitions. */
export function allowedTransitions(status: TicketStatus, role: Role): TicketStatus[] {
  if (role === 'requester') {
    if (status === 'resolved') return ['open'];
    if (status === 'closed') return [];
    return ['resolved'];
  }
  switch (status) {
    case 'open':
      return ['in_progress', 'pending', 'resolved'];
    case 'in_progress':
      return ['open', 'pending', 'resolved'];
    case 'pending':
      return ['in_progress', 'resolved'];
    case 'resolved':
      return ['open', 'closed'];
    case 'closed':
      return role === 'admin' ? ['open'] : [];
  }
}

export function transitionLabel(from: TicketStatus, to: TicketStatus, role: Role = 'agent'): string {
  if (isReopen(from, to)) return 'Reopen ticket';
  if (to === 'resolved') return role === 'requester' ? 'Mark as resolved' : 'Resolve';
  if (to === 'closed') return 'Close ticket';
  if (to === 'pending') return 'Set to Pending';
  if (to === 'in_progress') return from === 'open' ? 'Start work' : 'Resume work';
  return 'Move back to Open';
}

export function needsConfirmation(from: TicketStatus, to: TicketStatus): boolean {
  return to === 'resolved' || to === 'closed' || to === 'pending' || isReopen(from, to);
}
