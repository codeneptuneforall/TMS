'use client';
import React, { useMemo, useState } from 'react';
import { DownloadIcon, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageContainer, PageHeader, SampleDataBadge } from '../components/ui/PageHeader';
import { Tabs } from '../components/ui/Tabs';
import { Select } from '../components/ui/FormControls';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Panel } from '../components/dashboard/Panel';
import { KpiStrip } from '../components/dashboard/KpiStrip';
import { VolumeChart } from '../components/dashboard/VolumeChart';
import { HorizontalBars } from '../components/reports/ReportCharts';
import { useAppState, useCurrentUser } from '../contexts/AppStateContext';
import { dailyVolume } from '../data/reportSeries';
import { ticketsInScope } from '../utils/permissions';
import { isActive, PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER } from '../utils/ticketMeta';
import { resolutionByPriority, ticketsToCsv } from '../utils/reports';
import { formatHours } from '../utils/time';

type ReportTab = 'overview' | 'breakdown' | 'workload' | 'resolution';

export function Reports() {
  const user = useCurrentUser();
  const { tickets, teams, users, getUser } = useAppState();
  const [tab, setTab] = useState<ReportTab>('overview');
  const [range, setRange] = useState('14');
  const [teamId, setTeamId] = useState('');

  const scoped = useMemo(() => {
    const scope = ticketsInScope(user, tickets);
    return teamId ? scope.filter((t) => t.teamId === teamId) : scope;
  }, [user, tickets, teamId]);

  const days = Math.min(Number(range), dailyVolume.length);
  const series = dailyVolume.slice(-days);
  const created = series.reduce((s, d) => s + d.created, 0);
  const resolved = series.reduce((s, d) => s + d.resolved, 0);

  const exportCsv = () => {
    const csv = ticketsToCsv(scoped, (id) => getUser(id)?.name ?? '');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `relay-tickets-${teamId || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${scoped.length} tickets`);
  };

  return (
    <PageContainer wide>
      <PageHeader
        title="Reports"
        meta={<SampleDataBadge />}
        description={user.role === 'admin' ? 'Ticket volume, workload, and resolution across all teams.' : 'Metrics for tickets within your scope.'}
        actions={
        <>
            <Select aria-label="Date range" value={range} onChange={(e) => setRange(e.target.value)} className="h-8 text-[13px]">
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
            </Select>
            <Select aria-label="Team" value={teamId} onChange={(e) => setTeamId(e.target.value)} className="h-8 text-[13px]">
              <option value="">All teams</option>
              {teams.filter((t) => t.active).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
            <Button size="sm" onClick={exportCsv} leadingIcon={<DownloadIcon className="h-4 w-4" />}>Export CSV</Button>
          </>
        } />
      

      <Tabs
        label="Report sections"
        value={tab}
        onChange={setTab}
        tabs={[
        { id: 'overview', label: 'Created vs. resolved' },
        { id: 'breakdown', label: 'Status & priority' },
        { id: 'workload', label: 'Workload' },
        { id: 'resolution', label: 'Resolution time' }]
        }
        className="mb-5" />
      

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="space-y-5">
        {tab === 'overview' &&
        <>
            <KpiStrip
            items={[
            { label: 'Created', value: created, hint: `Last ${days} days` },
            { label: 'Resolved', value: resolved, hint: `Last ${days} days` },
            { label: 'Net backlog change', value: `${created - resolved > 0 ? '+' : ''}${created - resolved}`, tone: created > resolved ? 'warning' : 'success' },
            { label: 'Active right now', value: scoped.filter((t) => isActive(t.status)).length, hint: teamId ? teams.find((t) => t.id === teamId)?.name : 'All teams' }]
            } />
          
            {range === '30' &&
          <p className="flex items-center gap-2 text-[12px] text-ink-3"><InfoIcon className="h-3.5 w-3.5" aria-hidden />Only 14 days of sample history exist, so the chart shows 14 days.</p>
          }
            <Panel title="Created vs. resolved" description="Daily tickets created (bars) and resolved (line). Trend series is illustrative sample data and ignores the team filter." bodyClassName="px-2 pb-3 sm:px-3">
              <VolumeChart data={series} height={280} />
            </Panel>
          </>
        }

        {tab === 'breakdown' &&
        <>
            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="Tickets by status" description={`${scoped.length} tickets`} bodyClassName="px-3 pb-3">
                <HorizontalBars data={STATUS_ORDER.map((s) => ({ label: STATUS_META[s].label, value: scoped.filter((t) => t.status === s).length, color: STATUS_META[s].chart }))} />
              </Panel>
              <Panel title="Tickets by priority" description="All statuses" bodyClassName="px-3 pb-3">
                <HorizontalBars data={PRIORITY_ORDER.map((p) => ({ label: PRIORITY_META[p].label, value: scoped.filter((t) => t.priority === p).length, color: PRIORITY_META[p].chart }))} />
              </Panel>
            </div>
            <Panel title="Status × priority" description="Count of tickets in each combination.">
              <div className="overflow-x-auto border-t border-line">
                <table className="w-full min-w-[560px] text-[13px]">
                  <thead className="bg-subtle text-[12px] text-ink-3">
                    <tr>
                      <th scope="col" className="h-9 px-5 text-left font-medium">Status</th>
                      {PRIORITY_ORDER.map((p) => <th key={p} scope="col" className="px-3 text-right font-medium">{PRIORITY_META[p].label}</th>)}
                      <th scope="col" className="px-5 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STATUS_ORDER.map((s) => {
                    const row = scoped.filter((t) => t.status === s);
                    return (
                      <tr key={s} className="border-t border-line">
                          <th scope="row" className="px-5 py-2.5 text-left font-normal text-ink">{STATUS_META[s].label}</th>
                          {PRIORITY_ORDER.map((p) => {
                          const n = row.filter((t) => t.priority === p).length;
                          return <td key={p} className={`px-3 text-right tabular-nums ${n ? 'text-ink' : 'text-ink-3'}`}>{n}</td>;
                        })}
                          <td className="px-5 text-right font-medium tabular-nums text-ink">{row.length}</td>
                        </tr>);

                  })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </>
        }

        {tab === 'workload' &&
        <>
            <Panel title="Workload by agent" description="Current assignment counts.">
              <div className="overflow-x-auto border-t border-line">
                <table className="w-full min-w-[640px] text-[13px]">
                  <thead className="bg-subtle text-[12px] text-ink-3">
                    <tr>
                      <th scope="col" className="h-9 px-5 text-left font-medium">Agent</th>
                      <th scope="col" className="px-3 text-left font-medium">Team</th>
                      {(['open', 'in_progress', 'pending', 'resolved'] as const).map((s) => <th key={s} scope="col" className="px-3 text-right font-medium">{STATUS_META[s].label}</th>)}
                      <th scope="col" className="px-5 text-right font-medium">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.
                  filter((u) => u.role !== 'requester' && u.status === 'active').
                  map((u) => ({ u, mine: scoped.filter((t) => t.assigneeId === u.id) })).
                  filter(({ mine }) => mine.length > 0 || !teamId).
                  sort((a, b) => b.mine.filter((t) => isActive(t.status)).length - a.mine.filter((t) => isActive(t.status)).length).
                  map(({ u, mine }) =>
                  <tr key={u.id} className="border-t border-line">
                          <td className="px-5 py-2.5"><span className="flex items-center gap-2"><Avatar name={u.name} id={u.id} size="sm" /><span className="text-ink">{u.name}</span></span></td>
                          <td className="px-3 text-ink-2">{teams.find((t) => u.teamIds.includes(t.id))?.name ?? '—'}</td>
                          {(['open', 'in_progress', 'pending', 'resolved'] as const).map((s) => {
                      const n = mine.filter((t) => t.status === s).length;
                      return <td key={s} className={`px-3 text-right tabular-nums ${n ? 'text-ink' : 'text-ink-3'}`}>{n}</td>;
                    })}
                          <td className="px-5 text-right font-semibold tabular-nums text-ink">{mine.filter((t) => isActive(t.status)).length}</td>
                        </tr>
                  )}
                    <tr className="border-t border-line bg-subtle">
                      <td className="px-5 py-2.5 text-ink-2" colSpan={2}>Unassigned</td>
                      {(['open', 'in_progress', 'pending', 'resolved'] as const).map((s) => <td key={s} className="px-3 text-right tabular-nums text-ink-2">{scoped.filter((t) => !t.assigneeId && t.status === s).length}</td>)}
                      <td className="px-5 text-right font-semibold tabular-nums text-warning-fg">{scoped.filter((t) => !t.assigneeId && isActive(t.status)).length}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Panel>
            <Panel title="Workload by team" description="Active tickets per team." bodyClassName="px-3 pb-3">
              <HorizontalBars data={teams.filter((t) => t.active).map((t) => ({ label: t.name.replace('Technical ', '').replace('Customer ', ''), value: scoped.filter((x) => x.teamId === t.id && isActive(x.status)).length, color: 'rgb(var(--accent))' }))} />
            </Panel>
          </>
        }

        {tab === 'resolution' && <ResolutionReport tickets={scoped} />}
      </div>
    </PageContainer>);

}

function ResolutionReport({ tickets }: {tickets: ReturnType<typeof ticketsInScope>;}) {
  const rows = resolutionByPriority(tickets);
  const measured = rows.reduce((s, r) => s + r.count, 0);
  return (
    <>
      <div className="flex items-start gap-2.5 rounded-md border border-line bg-surface px-4 py-3 text-[13px] text-ink-2">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
        <p>
          Measured from ticket creation to the first <span className="font-medium text-ink">Resolved</span> event across {measured} sample tickets. SLA compliance isn’t shown because SLA targets are still a draft policy.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel title="Median time to resolve" description="By priority, in hours" bodyClassName="px-3 pb-3">
          <HorizontalBars unit="h" data={rows.map((r) => ({ label: PRIORITY_META[r.priority].label, value: r.median ? Math.round(r.median) : 0, color: PRIORITY_META[r.priority].chart }))} />
        </Panel>
        <Panel title="Sample size">
          <dl className="divide-y divide-line border-t border-line text-[13px]">
            {rows.map((r) =>
            <div key={r.priority} className="flex items-center justify-between px-5 py-2.5">
                <dt className="text-ink-2">{PRIORITY_META[r.priority].label}</dt>
                <dd className="tabular-nums text-ink">{r.median !== null ? formatHours(r.median) : <span className="text-ink-3">Not enough data</span>} <span className="ml-1 text-ink-3">· n={r.count}</span></dd>
              </div>
            )}
          </dl>
        </Panel>
      </div>
    </>);

}
