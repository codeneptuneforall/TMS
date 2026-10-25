'use client';
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { CircleCheckBigIcon, InboxIcon, SparklesIcon, FlameIcon } from 'lucide-react';
import { KpiStrip } from './KpiStrip';
import { Panel } from './Panel';
import { TicketMiniList } from './TicketMiniList';
import { ActivityFeed } from './ActivityFeed';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { awaitingAgent, lastPublicMessage, ticketsInScope } from '../../utils/permissions';
import { currentTime, relativeTime } from '../../utils/time';
import { isActive } from '../../utils/ticketMeta';

export function AgentDashboard() {
  const user = useCurrentUser();
  const { tickets, getUser } = useAppState();

  const data = useMemo(() => {
    const scope = ticketsInScope(user, tickets);
    const mine = scope.filter((t) => t.assigneeId === user.id);
    const mineActive = mine.filter((t) => isActive(t.status));
    const dayAgo = format(new Date(currentTime().getTime() - 24 * 3600000), "yyyy-MM-dd'T'HH:mm:ss");
    const newlyAssigned = mineActive.filter((t) => t.activity.some((a) => a.kind === 'assigned' && a.to === user.id && a.createdAt >= dayAgo));
    return {
      mineActive,
      awaiting: mineActive.filter(awaitingAgent),
      newlyAssigned,
      urgent: scope.filter((t) => t.priority === 'urgent' && isActive(t.status)),
      pending: mineActive.filter((t) => t.status === 'pending'),
      recent: [...mine].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
      scope
    };
  }, [tickets, user]);

  const waitingLine = (t: (typeof tickets)[number]) => {
    const last = lastPublicMessage(t);
    return last ? `${getUser(last.authorId)?.name} replied ${relativeTime(last.createdAt)}` : `No reply yet · opened ${relativeTime(t.createdAt)}`;
  };

  return (
    <div className="space-y-5">
      <KpiStrip
        items={[
        { label: 'My open tickets', value: data.mineActive.length, to: '/queue/mine' },
        { label: 'Awaiting my reply', value: data.awaiting.length, tone: 'accent', to: '/queue/mine' },
        { label: 'Assigned in last 24h', value: data.newlyAssigned.length, tone: 'info', to: '/queue/mine' },
        { label: 'Urgent in my scope', value: data.urgent.length, tone: 'danger', to: '/queue/all' },
        { label: 'My pending', value: data.pending.length, tone: 'warning', to: '/queue/pending' }]
        } />
      

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Panel title="Awaiting your reply" description="The requester spoke last, or nobody has replied yet." action={{ label: 'My tickets', to: '/queue/mine' }}>
            <TicketMiniList tickets={data.awaiting} showDue subline={waitingLine} empty={{ icon: <CircleCheckBigIcon />, title: 'You’re all caught up', description: 'No requesters are waiting on you right now.' }} />
          </Panel>
          <Panel title="Newly assigned" description="Assigned to you in the last 24 hours.">
            <TicketMiniList tickets={data.newlyAssigned} showDue subline={(t) => getUser(t.requesterId)?.organization} empty={{ icon: <SparklesIcon />, title: 'No new assignments', description: 'New tickets assigned to you will appear here.' }} />
          </Panel>
          <Panel title="Recently updated" description="Your tickets, most recent first.">
            <TicketMiniList tickets={data.recent} subline={(t) => getUser(t.requesterId)?.name} empty={{ icon: <InboxIcon />, title: 'No tickets yet' }} />
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Urgent" description="Across your teams and unassigned.">
            <TicketMiniList tickets={data.urgent} showAssignee empty={{ icon: <FlameIcon />, title: 'No urgent tickets' }} />
          </Panel>
          <Panel title="Pending on others" description="Paused tickets you own.">
            <TicketMiniList tickets={data.pending} subline={(t) => t.pendingReason === 'requester' ? `Waiting on ${getUser(t.requesterId)?.name}` : 'Waiting on third party'} empty={{ icon: <InboxIcon />, title: 'Nothing pending' }} />
          </Panel>
          <Panel title="My recent activity">
            <ActivityFeed tickets={data.scope} actorId={user.id} limit={6} />
          </Panel>
        </div>
      </div>
    </div>);

}
