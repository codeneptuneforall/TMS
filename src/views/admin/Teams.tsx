'use client';
import React, { useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { PlusIcon, UsersRoundIcon } from 'lucide-react';
import { PageContainer, PageHeader } from '../../components/ui/PageHeader';
import { AdminTabs } from '../../components/admin/AdminTabs';
import { TeamFormDialog } from '../../components/admin/TeamFormDialog';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/States';
import { useAppState } from '../../contexts/AppStateContext';
import { isActive } from '../../utils/ticketMeta';

export function Teams() {
  const { teams, tickets, getUser } = useAppState();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  return (
    <PageContainer wide>
      <PageHeader
        title="Users & Teams"
        description="Manage who can access Cadence Support and what they can do."
        actions={<Button size="sm" variant="primary" onClick={() => setCreating(true)} leadingIcon={<PlusIcon className="h-4 w-4" />}>Create team</Button>} />
      
      <AdminTabs />

      {teams.length === 0 ?
      <div className="rounded-lg border border-line bg-surface">
          <EmptyState icon={<UsersRoundIcon />} title="No teams yet" description="Create a team to start routing tickets to a shared queue." action={<Button size="sm" variant="primary" onClick={() => setCreating(true)}>Create team</Button>} />
        </div> :

      <div className="overflow-x-auto rounded-lg border border-line bg-surface shadow-card">
          <table className="w-full min-w-[720px] text-[13px]">
            <thead className="border-b border-line bg-subtle text-left text-[12px] text-ink-3">
              <tr>
                <th scope="col" className="h-9 px-4 font-medium">Team</th>
                <th scope="col" className="px-3 font-medium">Lead</th>
                <th scope="col" className="px-3 font-medium">Members</th>
                <th scope="col" className="px-3 text-right font-medium">Active tickets</th>
                <th scope="col" className="px-3 text-right font-medium">Urgent</th>
                <th scope="col" className="px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => {
              const lead = getUser(t.leadId);
              const activeTickets = tickets.filter((x) => x.teamId === t.id && isActive(x.status));
              const urgent = activeTickets.filter((x) => x.priority === 'urgent').length;
              return (
                <tr key={t.id} onClick={() => navigate(`/admin/teams/${t.id}`)} className="cursor-pointer border-b border-line last:border-b-0 hover:bg-subtle">
                    <td className="max-w-[360px] px-4 py-3">
                      <Link to={`/admin/teams/${t.id}`} onClick={(e) => e.stopPropagation()} className="font-medium text-ink hover:underline">{t.name}</Link>
                      <p className="truncate text-[12px] text-ink-3">{t.description}</p>
                    </td>
                    <td className="px-3">
                      {lead ? <span className="flex items-center gap-2"><Avatar name={lead.name} id={lead.id} size="sm" /><span className="truncate text-ink-2">{lead.name}</span></span> : <span className="text-ink-3">—</span>}
                    </td>
                    <td className="px-3">
                      {t.memberIds.length ?
                    <span className="flex items-center">
                          {t.memberIds.slice(0, 4).map((m) => {
                        const u = getUser(m);
                        return u ? <Avatar key={m} name={u.name} id={u.id} size="sm" className="-ml-1.5 ring-2 ring-surface first:ml-0" /> : null;
                      })}
                          <span className="ml-2 tabular-nums text-ink-3">{t.memberIds.length}</span>
                        </span> :
                    <span className="text-ink-3">No members</span>}
                    </td>
                    <td className="px-3 text-right tabular-nums text-ink">{activeTickets.length}</td>
                    <td className="px-3 text-right tabular-nums">{urgent ? <span className="font-medium text-danger-fg">{urgent}</span> : <span className="text-ink-3">0</span>}</td>
                    <td className="px-4"><Badge tone={t.active ? 'success' : 'neutral'}>{t.active ? 'Active' : 'Inactive'}</Badge></td>
                  </tr>);

            })}
            </tbody>
          </table>
        </div>
      }
      <TeamFormDialog open={creating} onClose={() => setCreating(false)} />
    </PageContainer>);

}
