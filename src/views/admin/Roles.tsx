'use client';
import React from 'react';
import { CheckIcon, MinusIcon, InfoIcon } from 'lucide-react';
import { PageContainer, PageHeader } from '../../components/ui/PageHeader';
import { AdminTabs, ROLE_LABEL } from '../../components/admin/AdminTabs';
import { useAppState } from '../../contexts/AppStateContext';
import type { Role } from '../../types/user';

type Access = boolean | string;

const MATRIX: {group: string;rows: {label: string;access: Partial<Record<Role, Access>>;}[];}[] = [
{
  group: 'Tickets',
  rows: [
  { label: 'Create tickets', access: { admin: true, agent: true, requester: true } },
  { label: 'View tickets', access: { admin: 'All', agent: 'Own teams + unassigned', requester: 'Own only' } },
  { label: 'Reply publicly', access: { admin: true, agent: true, requester: 'Own tickets' } },
  { label: 'Add and read internal notes', access: { admin: true, agent: true, requester: false } },
  { label: 'Assign agents and teams', access: { admin: true, agent: true, requester: false } },
  { label: 'Change priority', access: { admin: true, agent: true, requester: false } },
  { label: 'Resolve or reopen', access: { admin: true, agent: true, requester: 'Own tickets' } },
  { label: 'Reopen closed tickets', access: { admin: true, agent: false, requester: false } },
  { label: 'Bulk actions', access: { admin: true, agent: true, requester: false } }]

},
{
  group: 'Workspace',
  rows: [
  { label: 'View reports', access: { admin: 'All teams', agent: 'Own scope', requester: false } },
  { label: 'Manage users and teams', access: { admin: true, agent: false, requester: false } },
  { label: 'Configure categories, priorities, workflow', access: { admin: true, agent: false, requester: false } },
  { label: 'View audit log', access: { admin: true, agent: false, requester: false } }]

}];


function Cell({ value }: {value: Access | undefined;}) {
  if (value === true) return <span className="inline-flex items-center gap-1 text-success-fg"><CheckIcon className="h-4 w-4" aria-hidden /><span className="sr-only">Allowed</span></span>;
  if (value === undefined) return <span className="text-ink-3">-</span>;
  if (value === false) return <span className="inline-flex text-ink-3"><MinusIcon className="h-4 w-4" aria-hidden /><span className="sr-only">Not allowed</span></span>;
  return <span className="text-[12px] text-ink-2">{value}</span>;
}

export function Roles() {
  const { users } = useAppState();
  const roles: Role[] = ['admin', 'manager', 'agent', 'requester'];
  return (
    <PageContainer wide>
      <PageHeader title="Users & Teams" description="Manage who can access Cadence Support and what they can do." />
      <AdminTabs />
      <div className="mb-4 flex items-start gap-2.5 rounded-md border border-line bg-surface px-4 py-3 text-[13px] text-ink-2">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
        <p>Relay uses three fixed roles. This table describes what each role can do — permissions are enforced by the server on every request, not just hidden in the interface.</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface shadow-card">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead className="border-b border-line bg-subtle">
            <tr>
              <th scope="col" className="h-11 px-4 text-left text-[12px] font-medium text-ink-3">Capability</th>
              {roles.map((r) =>
              <th key={r} scope="col" className="w-[200px] px-4 text-left">
                  <span className="block text-[13px] font-semibold text-ink">{ROLE_LABEL[r]}</span>
                  <span className="block text-[12px] font-normal tabular-nums text-ink-3">{users.filter((u) => u.role === r).length} users</span>
                </th>
              )}
            </tr>
          </thead>
          {MATRIX.map((g) =>
          <tbody key={g.group}>
              <tr className="border-b border-line bg-subtle/60">
                <th scope="rowgroup" colSpan={4} className="px-4 py-2 text-left text-[12px] font-medium text-ink-3">{g.group}</th>
              </tr>
              {g.rows.map((row) =>
            <tr key={row.label} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-2.5 text-left font-normal text-ink">{row.label}</th>
                  {roles.map((r) => <td key={r} className="px-4 py-2.5"><Cell value={row.access[r]} /></td>)}
                </tr>
            )}
            </tbody>
          )}
        </table>
      </div>
    </PageContainer>);

}
