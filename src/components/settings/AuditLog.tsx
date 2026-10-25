'use client';
import React, { useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { ScrollTextIcon, SearchIcon } from 'lucide-react';
import { SettingsSection } from '../ui/SubNav';
import { Select } from '../ui/FormControls';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/States';
import { useAppState } from '../../contexts/AppStateContext';
import { auditLog } from '../../data/auditLog';
import { formatDateTime } from '../../utils/time';
import type { Tone } from '../../utils/ticketMeta';

const CATEGORY_TONE: Record<string, Tone> = { ticket: 'info', user: 'violet', team: 'accent', settings: 'neutral', security: 'warning' };
const PAGE = 8;

export function AuditLog() {
  const { getUser } = useAppState();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
    auditLog.filter((e) => (!category || e.category === category) && (!q.trim() || `${e.action} ${e.target} ${getUser(e.actorId)?.name}`.toLowerCase().includes(q.trim().toLowerCase()))),
    [q, category, getUser]
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice((Math.min(page, pageCount) - 1) * PAGE, Math.min(page, pageCount) * PAGE);

  return (
    <SettingsSection title="Audit log" description="A record of administrative and workflow changes. Entries are retained for 12 months and can’t be edited.">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
          <input type="search" value={q} onChange={(e) => {setQ(e.target.value);setPage(1);}} placeholder="Search action, target, or person" aria-label="Search audit log" className="h-8 w-full rounded-md border border-line-strong bg-surface pl-9 pr-3 text-[13px] placeholder:text-ink-3 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15" />
        </div>
        <Select aria-label="Filter by category" value={category} onChange={(e) => {setCategory(e.target.value);setPage(1);}} className="h-8 text-[13px] sm:w-44">
          <option value="">All categories</option>
          {Object.keys(CATEGORY_TONE).map((c) => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
        </Select>
      </div>
      {rows.length === 0 ?
      <EmptyState compact icon={<ScrollTextIcon />} title="No matching entries" description="Try a different search or category." /> :

      <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-[13px]">
            <thead className="border-y border-line bg-subtle text-left text-[12px] text-ink-3">
              <tr>
                <th scope="col" className="h-9 px-5 font-medium">When</th>
                <th scope="col" className="px-3 font-medium">Who</th>
                <th scope="col" className="px-3 font-medium">Action</th>
                <th scope="col" className="px-3 font-medium">Target</th>
                <th scope="col" className="px-5 font-medium">IP address</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => {
              const actor = getUser(e.actorId);
              return (
                <tr key={e.id} className="border-b border-line">
                    <td className="whitespace-nowrap px-5 py-2.5 tabular-nums text-ink-2">{formatDateTime(e.createdAt)}</td>
                    <td className="px-3"><span className="flex items-center gap-2"><Avatar name={actor?.name ?? '?'} id={e.actorId} size="xs" /><span className="whitespace-nowrap text-ink">{actor?.name}</span></span></td>
                    <td className="px-3"><span className="flex items-center gap-2"><Badge tone={CATEGORY_TONE[e.category]}>{e.category}</Badge><span className="text-ink-2">{e.action}</span></span></td>
                    <td className="px-3">{e.target.startsWith('TKT-') ? <Link to={`/tickets/${e.target}`} className="ticket-id text-[12px] text-ink hover:underline">{e.target}</Link> : <span className="text-ink-2">{e.target}</span>}</td>
                    <td className="ticket-id px-5 text-[12px] text-ink-3">{e.ip}</td>
                  </tr>);

            })}
            </tbody>
          </table>
        </div>
      }
      <Pagination page={Math.min(page, pageCount)} pageCount={pageCount} total={filtered.length} pageSize={PAGE} onChange={setPage} noun="entries" />
    </SettingsSection>);

}
