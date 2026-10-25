'use client';
import React, { useState } from 'react';
import { useParams } from '@/lib/router';
import { ArchiveIcon, FileQuestionIcon } from 'lucide-react';
import { TicketHeader } from '../components/tickets/TicketHeader';
import { Conversation } from '../components/tickets/Conversation';
import { ActivityTimeline } from '../components/tickets/ActivityTimeline';
import { ReplyComposer } from '../components/tickets/ReplyComposer';
import { TicketMetaPanel } from '../components/tickets/TicketMetaPanel';
import { Tabs } from '../components/ui/Tabs';
import { Drawer } from '../components/ui/Drawer';
import { Button, ButtonLink } from '../components/ui/Button';
import { EmptyState, Skeleton } from '../components/ui/States';
import { useAppState, useCurrentUser } from '../contexts/AppStateContext';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import { canViewTicket } from '../utils/permissions';
import { Unauthorized } from './system/Unauthorized';

type DetailTab = 'conversation' | 'activity';

const OLDEST_LIVE_TICKET = 1259;

export function TicketDetail() {
  const { id = '' } = useParams();
  const user = useCurrentUser();
  const { getTicket } = useAppState();
  const [loading] = useSimulatedLoading(id, 300);
  const [tab, setTab] = useState<DetailTab>('conversation');
  const [escalating, setEscalating] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const escalate = async () => {
    const reason = window.prompt('Escalation reason:', 'Technical issue requiring senior assistance');
    if (!reason) return;
    const description = window.prompt('Description for team leader:', '') || '';
    setEscalating(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      await fetch(`${apiBase}/tickets/${id.toUpperCase()}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, description, actorId: user.id })
      });
      alert('Escalated');
    } finally {
      setEscalating(false);
    }
  };
  const ticket = getTicket(id.toUpperCase());

  if (loading) return <DetailSkeleton />;

  if (!ticket) {
    const n = Number(id.toUpperCase().replace('TKT-', ''));
    const archived = Number.isFinite(n) && n > 0 && n < OLDEST_LIVE_TICKET;
    return (
      <div className="flex min-h-full items-center justify-center">
        <EmptyState
          icon={archived ? <ArchiveIcon /> : <FileQuestionIcon />}
          title={archived ? `${id.toUpperCase()} has been archived` : 'Ticket not found'}
          description={
          archived ?
          'Tickets older than 24 months are moved to the archive and can no longer be opened here. An administrator can restore it if needed.' :
          `We couldn’t find “${id}”. It may have been deleted or merged into another ticket.`
          }
          action={<ButtonLink to={user.role === 'requester' ? '/queue/mine' : '/queue/all'} size="sm">Back to tickets</ButtonLink>} />
        
      </div>);

  }

  if (!canViewTicket(user, ticket)) {
    return <Unauthorized inShell description="This ticket belongs to another requester or a team you’re not part of. Ask an administrator if you need access." />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <TicketHeader ticket={ticket} onOpenDetails={() => setDetailsOpen(true)} />
      <div className="px-4 py-2">
        <Button size="sm" loading={escalating} onClick={escalate}>Escalate to Team Leader</Button>
      </div>

      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col bg-canvas" aria-label="Conversation">
          <div className="shrink-0 bg-surface px-4 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <Tabs
                label="Ticket views"
                value={tab}
                onChange={setTab}
                tabs={[
                { id: 'conversation', label: 'Conversation', count: (user.role === 'requester' ? ticket.messages.filter((m) => m.visibility === 'public') : ticket.messages).length + 1 },
                { id: 'activity', label: 'Activity' }]
                }
                className="border-b-0" />
              
            </div>
          </div>
          <div className="scroll-thin min-h-0 flex-1 overflow-y-auto border-t border-line px-4 py-6 sm:px-6">
            <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="mx-auto max-w-3xl">
              {tab === 'conversation' ? <Conversation ticket={ticket} /> : <ActivityTimeline ticket={ticket} />}
            </div>
          </div>
          <ReplyComposer ticket={ticket} />
        </section>

        <aside className="scroll-thin hidden w-[320px] shrink-0 overflow-y-auto border-l border-line bg-surface xl:block" aria-label="Ticket details">
          <TicketMetaPanel ticket={ticket} />
        </aside>
      </div>

      <Drawer open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Ticket details" className="w-[min(360px,92vw)]">
        <TicketMetaPanel ticket={ticket} />
      </Drawer>
    </div>);

}

function DetailSkeleton() {
  return (
    <div className="flex h-full flex-col" aria-busy="true" aria-label="Loading ticket">
      <div className="space-y-3 border-b border-line bg-surface px-6 py-4">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-6 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-8">
          {[0, 1, 2].map((i) =>
          <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          )}
        </div>
        <div className="hidden w-[320px] space-y-4 border-l border-line bg-surface p-5 xl:block">
          {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </div>
    </div>);

}
