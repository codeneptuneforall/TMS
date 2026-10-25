'use client';
import React from 'react';
import { Link, useNavigate } from '@/lib/router';
import { BellIcon, BellOffIcon } from 'lucide-react';
import { Popover } from '../ui/Popover';
import { useAppState } from '../../contexts/AppStateContext';
import { NotificationRow } from '../notifications/NotificationRow';

export function NotificationMenu() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppState();
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover
      align="end"
      label="Notifications"
      className="w-[min(380px,calc(100vw-16px))] p-0"
      trigger={({ ref, toggle, open }) =>
      <button
        ref={ref}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-ink-2 transition-colors duration-150 hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
        
          <BellIcon className="h-[18px] w-[18px]" />
          {unread > 0 &&
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold tabular-nums text-white ring-2 ring-surface">
              {unread}
            </span>
        }
        </button>
      }>
      
      {(close) =>
      <div>
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold text-ink">Notifications</h2>
            {unread > 0 &&
          <button type="button" data-menu-item onClick={markAllNotificationsRead} className="rounded text-[12px] font-medium text-accent-fg hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
                Mark all as read
              </button>
          }
          </div>
          <div className="scroll-thin max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ?
          <div className="flex flex-col items-center px-6 py-10 text-center">
                <BellOffIcon className="mb-2 h-5 w-5 text-ink-3" aria-hidden />
                <p className="text-[13px] font-medium text-ink">You’re all caught up</p>
                <p className="mt-0.5 text-[12px] text-ink-3">New replies and assignments will appear here.</p>
              </div> :

          notifications.slice(0, 6).map((n) =>
          <NotificationRow
            key={n.id}
            notification={n}
            compact
            onOpen={() => {
              markNotificationRead(n.id);
              close();
              navigate(n.ticketId ? `/tickets/${n.ticketId}` : '/notifications');
            }} />

          )
          }
          </div>
          <div className="border-t border-line p-1">
            <Link to="/notifications" onClick={close} className="block rounded-md px-3 py-2 text-center text-[13px] font-medium text-ink-2 hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
              View all notifications
            </Link>
          </div>
        </div>
      }
    </Popover>);

}
