'use client';
import React from 'react';
import { AtSignIcon, BellIcon, ClockAlertIcon, MessageSquareIcon, RefreshCwIcon, UserPlusIcon } from 'lucide-react';
import { useAppState } from '../../contexts/AppStateContext';
import { Avatar } from '../ui/Avatar';
import { relativeTime, formatDateTime } from '../../utils/time';
import { cn } from '../../utils/cn';
import type { AppNotification, NotificationKind } from '../../types/notification';

const KIND_ICON: Record<NotificationKind, React.ReactNode> = {
  assigned: <UserPlusIcon className="h-3 w-3" />,
  reply: <MessageSquareIcon className="h-3 w-3" />,
  mention: <AtSignIcon className="h-3 w-3" />,
  status: <RefreshCwIcon className="h-3 w-3" />,
  sla: <ClockAlertIcon className="h-3 w-3" />,
  system: <BellIcon className="h-3 w-3" />
};

interface NotificationRowProps {
  notification: AppNotification;
  onOpen: () => void;
  compact?: boolean;
}

export function NotificationRow({ notification: n, onOpen, compact }: NotificationRowProps) {
  const { getUser } = useAppState();
  const actor = getUser(n.actorId);

  return (
    <button
      type="button"
      data-menu-item
      onClick={onOpen}
      className={cn(
        'flex w-full items-start gap-3 border-b border-line text-left last:border-b-0 transition-colors duration-100 hover:bg-subtle focus-visible:bg-muted focus-visible:outline-none',
        compact ? 'px-4 py-3' : 'px-4 py-3.5 sm:px-5'
      )}>
      
      <span className="relative mt-0.5">
        {actor ?
        <Avatar name={actor.name} id={actor.id} size="md" /> :

        <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', n.kind === 'sla' ? 'bg-warning-soft text-warning-fg' : 'bg-muted text-ink-2')}>
            {KIND_ICON[n.kind]}
          </span>
        }
        {actor &&
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-surface text-ink-2 ring-1 ring-line">
            {KIND_ICON[n.kind]}
          </span>
        }
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className={cn('min-w-0 flex-1 truncate text-[13px]', n.read ? 'text-ink-2' : 'font-semibold text-ink')}>{n.title}</span>
          <time dateTime={n.createdAt} title={formatDateTime(n.createdAt)} className="shrink-0 text-2xs tabular-nums text-ink-3">
            {relativeTime(n.createdAt)}
          </time>
        </span>
        <span className={cn('mt-0.5 block text-[12px] leading-5 text-ink-3', compact ? 'line-clamp-1' : 'line-clamp-2')}>{n.body}</span>
        {n.ticketId && <span className="ticket-id mt-1 block text-2xs text-ink-3">{n.ticketId}</span>}
      </span>
      <span className="mt-2 w-2 shrink-0">
        {!n.read && <span className="block h-2 w-2 rounded-full bg-accent" aria-label="Unread" />}
      </span>
    </button>);

}
