'use client';
import React, { useMemo } from 'react';
import { ShieldCheckIcon } from 'lucide-react';
import { KpiStrip } from './KpiStrip';
import { Panel } from './Panel';
import { TicketMiniList } from './TicketMiniList';
import { VolumeChart } from './VolumeChart';
import { StatusDistribution } from './StatusDistribution';
import { WorkloadList } from './WorkloadList';
import { ActivityFeed } from './ActivityFeed';
import { SampleDataBadge } from '../ui/PageHeader';
import { useAppState } from '../../contexts/AppStateContext';
import { dailyVolume } from '../../data/reportSeries';
import { dueStatus } from '../../utils/time';
import { isActive, PRIORITY_META } from '../../utils/ticketMeta';

export function AdminDashboard() {
  const { tickets, getUser } = useAppState();

  const counts = useMemo(() => {
    const by = (fn: (s: string) => boolean) => tickets.filter((t) => fn(t.status)).length;
    return {
      total: tickets.length,
      open: by((s) => s === 'open'),
      progress: by((s) => s === 'in_progress'),
      pending: by((s) => s === 'pending'),
      resolved: by((s) => s === 'resolved'),
      urgent: tickets.filter((t) => t.priority === 'urgent' && isActive(t.status)).length,
      unassigned: tickets.filter((t) => !t.assigneeId && isActive(t.status)).length
    };
  }, [tickets]);

  const attention = useMemo(
    () =>
    tickets.
    filter((t) => isActive(t.status) && t.status !== 'pending').
    filter((t) => t.priority === 'urgent' || dueStatus(t.dueAt, t.status)?.overdue || !t.assigneeId && t.priority === 'high').
    sort((a, b) => PRIORITY_META[b.priority].level - PRIORITY_META[a.priority].level || (a.dueAt ?? '').localeCompare(b.dueAt ?? '')),
    [tickets]
  );

  const reason = (t: (typeof tickets)[number]) => {
    const due = dueStatus(t.dueAt, t.status);
    const parts = [];
    if (!t.assigneeId) parts.push('Unassigned');
    if (due?.overdue) parts.push(due.label);
    if (t.priority === 'urgent' && t.assigneeId) parts.push(`Urgent · ${getUser(t.assigneeId)?.name}`);
    return parts.join(' · ') || getUser(t.requesterId)?.organization;
  };

  return (
    <div className="space-y-5">
      <KpiStrip
        items={[
        { label: 'Total tickets', value: counts.total, to: '/queue/all' },
        { label: 'Open', value: counts.open, tone: 'info', to: '/queue/all' },
        { label: 'In progress', value: counts.progress, tone: 'violet', to: '/queue/all' },
        { label: 'Pending', value: counts.pending, tone: 'warning', to: '/queue/pending' },
        { label: 'Resolved', value: counts.resolved, tone: 'success', to: '/queue/resolved' },
        { label: 'Urgent', value: counts.urgent, tone: 'danger', to: '/queue/all', hint: 'Active only' },
        { label: 'Unassigned', value: counts.unassigned, tone: 'orange', to: '/queue/unassigned', hint: 'Active only' }]
        } />
      

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Panel title="Needs attention" description="Urgent, overdue, or high-priority tickets without an owner." action={{ label: 'All tickets', to: '/queue/all' }}>
            <TicketMiniList tickets={attention} showAssignee showDue subline={reason} empty={{ icon: <ShieldCheckIcon />, title: 'Nothing needs attention', description: 'No urgent, overdue, or unowned high-priority tickets right now.' }} />
          </Panel>
          <Panel title="Ticket volume" description="Created vs. resolved, last 14 days" extra={<SampleDataBadge />} bodyClassName="px-2 pb-3 sm:px-3">
            <VolumeChart data={dailyVolume} />
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="By status" description={`${counts.total} tickets`}>
            <StatusDistribution tickets={tickets} />
          </Panel>
          <Panel title="Workload" action={{ label: 'Reports', to: '/reports' }}>
            <WorkloadList tickets={tickets} compact />
          </Panel>
          <Panel title="Recent activity">
            <ActivityFeed tickets={tickets} limit={6} />
          </Panel>
        </div>
      </div>
    </div>);

}
