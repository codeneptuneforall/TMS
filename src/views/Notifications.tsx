'use client';
import React, { useState } from 'react';
import { useNavigate } from '@/lib/router';
import { BellOffIcon, CheckCheckIcon } from 'lucide-react';
import { PageContainer, PageHeader } from '../components/ui/PageHeader';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';
import { NotificationRow } from '../components/notifications/NotificationRow';
import { useAppState } from '../contexts/AppStateContext';
import { currentTime } from '../utils/time';
import { format } from 'date-fns';

type Filter = 'all' | 'unread' | 'mentions';

export function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppState();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const unread = notifications.filter((n) => !n.read).length;

  const list = notifications.filter((n) => filter === 'unread' ? !n.read : filter === 'mentions' ? n.kind === 'mention' : true);
  const today = format(currentTime(), 'yyyy-MM-dd');
  const groups = [
  { label: 'Today', items: list.filter((n) => n.createdAt.startsWith(today)) },
  { label: 'Earlier', items: list.filter((n) => !n.createdAt.startsWith(today)) }].
  filter((g) => g.items.length);

  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Notifications"
          description="Replies, assignments, mentions, and SLA alerts for tickets you’re involved in."
          actions={
          <Button size="sm" onClick={markAllNotificationsRead} disabled={unread === 0} leadingIcon={<CheckCheckIcon className="h-4 w-4" />}>
              Mark all as read
            </Button>
          } />
        
        <Tabs
          label="Filter notifications"
          value={filter}
          onChange={setFilter}
          tabs={[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unread },
          { id: 'mentions', label: 'Mentions' }]
          } />
        
        <div id={`panel-${filter}`} role="tabpanel" aria-labelledby={`tab-${filter}`} className="mt-4">
          {groups.length === 0 ?
          <div className="rounded-lg border border-line bg-surface">
              <EmptyState
              icon={<BellOffIcon />}
              title={filter === 'unread' ? 'No unread notifications' : filter === 'mentions' ? 'No mentions yet' : 'No notifications'}
              description={filter === 'all' ? 'You’ll be notified here when someone replies to or assigns you a ticket.' : 'You’re all caught up.'} />
            
            </div> :

          <div className="space-y-6">
              {groups.map((g) =>
            <section key={g.label} aria-label={g.label}>
                  <h2 className="mb-2 text-[12px] font-medium text-ink-3">{g.label}</h2>
                  <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
                    {g.items.map((n) =>
                <NotificationRow
                  key={n.id}
                  notification={n}
                  onOpen={() => {
                    markNotificationRead(n.id);
                    if (n.ticketId) navigate(`/tickets/${n.ticketId}`);
                  }} />

                )}
                  </div>
                </section>
            )}
            </div>
          }
        </div>
      </div>
    </PageContainer>);

}
