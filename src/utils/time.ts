import { format } from 'date-fns';
import type { Tone } from './ticketMeta';
import type { TicketStatus } from '../types/ticket';

/** Prototype clock: all sample data is anchored to this moment. */
export const NOW = new Date('2026-10-24T10:00:00');
const SESSION_START = Date.now();

export function currentTime(): Date {
  return new Date(NOW.getTime() + (Date.now() - SESSION_START));
}

export function nowIso(): string {
  return format(currentTime(), "yyyy-MM-dd'T'HH:mm:ss");
}

export function addHoursIso(iso: string, hours: number): string {
  return format(new Date(new Date(iso).getTime() + hours * 3600000), "yyyy-MM-dd'T'HH:mm:ss");
}

export function relativeTime(iso: string): string {
  const mins = (currentTime().getTime() - new Date(iso).getTime()) / 60000;
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${Math.floor(mins)}m ago`;
  const hours = mins / 60;
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}d ago`;
  return format(new Date(iso), 'MMM d');
}

export const formatDateTime = (iso: string) => format(new Date(iso), 'MMM d, yyyy · HH:mm');
export const formatDate = (iso: string) => format(new Date(iso), 'MMM d, yyyy');
export const formatShortDate = (iso: string) => format(new Date(iso), 'MMM d');
export const formatTime = (iso: string) => format(new Date(iso), 'HH:mm');

function duration(mins: number): string {
  if (mins < 60) return `${Math.max(1, Math.round(mins))}m`;
  const h = mins / 60;
  if (h < 24) return `${Math.round(h)}h`;
  return `${Math.round(h / 24)}d`;
}

export function hoursBetween(a: string, b: string): number {
  return (new Date(b).getTime() - new Date(a).getTime()) / 3600000;
}

export function formatHours(hours: number): string {
  return duration(hours * 60);
}

export function dueStatus(
iso: string | null,
status: TicketStatus)
: {label: string;tone: Tone;overdue: boolean;} | null {
  if (!iso || status === 'resolved' || status === 'closed' || status === 'pending') return null;
  const mins = (new Date(iso).getTime() - currentTime().getTime()) / 60000;
  if (mins < 0) return { label: `Overdue ${duration(-mins)}`, tone: 'danger', overdue: true };
  if (mins < 120) return { label: `Due in ${duration(mins)}`, tone: 'warning', overdue: false };
  return { label: `Due in ${duration(mins)}`, tone: 'neutral', overdue: false };
}

export function greeting(): string {
  const h = currentTime().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
