'use client';
import React, { useState } from 'react';
import { useParams } from '@/lib/router';
import { InboxIcon, PencilIcon, PowerIcon, UsersRoundIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageContainer, PageHeader } from '../../components/ui/PageHeader';
import { TeamFormDialog } from '../../components/admin/TeamFormDialog';
import { Panel } from '../../components/dashboard/Panel';
import { TicketMiniList } from '../../components/dashboard/TicketMiniList';
import { StatusDistribution } from '../../components/dashboard/StatusDistribution';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button, ButtonLink } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/States';
import { useAppState } from '../../contexts/AppStateContext';
import { isActive } from '../../utils/ticketMeta';
import type { User } from '../../types/user';

export function TeamDetail() {
  const { id } = useParams();
  const { getTeam, getUser, tickets, saveTeam } = useAppState();
  const team = getTeam(id);
  const [editing, setEditing] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [removing, setRemoving] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);

  if (!team) {
    return (
      <PageContainer>
        <EmptyState icon={<UsersRoundIcon />} title="Team not found" description="This team may have been deleted." action={<ButtonLink to="/admin/teams" size="sm">Back to teams</ButtonLink>} />
      </PageContainer>);

  }

  const teamTickets = tickets.filter((t) => t.teamId === team.id);
  const active = teamTickets.filter((t) => isActive(t.status)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const activeCount = active.length;

  const toggleActive = async () => {
    setBusy(true);
    const res = await saveTeam({ ...team, active: !team.active });
    setBusy(false);
    if (!res.ok) return toast.error('Change not saved', { description: res.error });
    toast.success(team.active ? `${team.name} deactivated` : `${team.name} activated`);
    setConfirmToggle(false);
  };

  const removeMember = async () => {
    if (!removing) return;
    setBusy(true);
    const res = await saveTeam({ ...team, memberIds: team.memberIds.filter((m) => m !== removing.id), leadId: team.leadId === removing.id ? null : team.leadId });
    setBusy(false);
    if (!res.ok) return toast.error('Change not saved', { description: res.error });
    toast.success(`${removing.name} removed from ${team.name}`);
    setRemoving(null);
  };

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: 'Users & Teams', to: '/admin/users' }, { label: 'Teams', to: '/admin/teams' }, { label: team.name }]}
        title={team.name}
        meta={<Badge tone={team.active ? 'success' : 'neutral'}>{team.active ? 'Active' : 'Inactive'}</Badge>}
        description={team.description}
        actions={
        <>
            <Button size="sm" onClick={() => setConfirmToggle(true)} leadingIcon={<PowerIcon className="h-4 w-4" />}>{team.active ? 'Deactivate' : 'Activate'}</Button>
            <Button size="sm" variant="primary" onClick={() => setEditing(true)} leadingIcon={<PencilIcon className="h-4 w-4" />}>Edit team</Button>
          </>
        } />
      

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Panel title="Active queue" description={`${activeCount} tickets in Open, In Progress, or Pending`} action={{ label: 'Team queue', to: '/queue/team' }}>
            <TicketMiniList tickets={active} showAssignee showDue empty={{ icon: <InboxIcon />, title: 'Queue is clear', description: 'No active tickets for this team.' }} />
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Members" description={`${team.memberIds.length} people`}>
            {team.memberIds.length === 0 ?
            <EmptyState compact icon={<UsersRoundIcon />} title="No members" description="Edit the team to add agents." /> :

            <ul className="divide-y divide-line border-t border-line">
                {team.memberIds.map((m) => {
                const u = getUser(m);
                if (!u) return null;
                const load = tickets.filter((t) => t.assigneeId === u.id && isActive(t.status)).length;
                return (
                  <li key={m} className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
                      <Avatar name={u.name} id={u.id} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
                          <span className="truncate">{u.name}</span>
                          {team.leadId === u.id && <span className="rounded bg-accent-soft px-1.5 text-2xs font-medium text-accent-fg">Lead</span>}
                        </span>
                        <span className="block text-[12px] text-ink-3">{u.status === 'invited' ? 'Invitation pending' : `${load} active tickets`}</span>
                      </span>
                      <Button size="icon-sm" variant="ghost" onClick={() => setRemoving(u)} aria-label={`Remove ${u.name} from team`}>
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </li>);

              })}
              </ul>
            }
          </Panel>
          <Panel title="All tickets by status" description={`${teamTickets.length} total`}>
            <StatusDistribution tickets={teamTickets} />
          </Panel>
        </div>
      </div>

      <TeamFormDialog open={editing} team={team} onClose={() => setEditing(false)} />
      <Dialog
        open={confirmToggle}
        onClose={() => setConfirmToggle(false)}
        size="sm"
        role="alertdialog"
        title={team.active ? `Deactivate ${team.name}?` : `Activate ${team.name}?`}
        description={team.active ? `New tickets can’t be routed to this team. ${activeCount} active tickets stay in place until reassigned.` : 'The team will start receiving tickets from its routed categories again.'}
        footer={
        <>
            <Button onClick={() => setConfirmToggle(false)}>Cancel</Button>
            <Button variant={team.active ? 'danger' : 'primary'} loading={busy} onClick={toggleActive}>{team.active ? 'Deactivate team' : 'Activate team'}</Button>
          </>
        } />
      
      <Dialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        size="sm"
        title={`Remove ${removing?.name}?`}
        description={`${removing?.name} will no longer see ${team.name}’s queue. Tickets already assigned to them are not changed.`}
        footer={
        <>
            <Button onClick={() => setRemoving(null)}>Cancel</Button>
            <Button variant="danger" loading={busy} onClick={removeMember}>Remove member</Button>
          </>
        } />
      
    </PageContainer>);

}
