import type { Ticket, TicketPriority } from '../types/ticket';
import { hoursBetween } from './time';
import { PRIORITY_ORDER } from './ticketMeta';

export function resolutionHours(t: Ticket): number | null {
  const resolved = t.activity.find((a) => a.kind === 'resolved');
  return resolved ? hoursBetween(t.createdAt, resolved.createdAt) : null;
}

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function resolutionByPriority(tickets: Ticket[]): {priority: TicketPriority;median: number | null;count: number;}[] {
  return PRIORITY_ORDER.map((p) => {
    const hrs = tickets.filter((t) => t.priority === p).map(resolutionHours).filter((h): h is number => h !== null);
    return { priority: p, median: median(hrs), count: hrs.length };
  });
}

export function ticketsToCsv(tickets: Ticket[], name: (id: string | null) => string): string {
  const header = ['id', 'subject', 'status', 'priority', 'requester', 'assignee', 'created_at', 'updated_at'];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = tickets.map((t) => [t.id, t.subject, t.status, t.priority, name(t.requesterId), name(t.assigneeId), t.createdAt, t.updatedAt].map((v) => esc(String(v))).join(','));
  return [header.join(','), ...rows].join('\n');
}
