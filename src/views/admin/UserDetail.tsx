'use client';
import React, { useState } from 'react';
import { useParams } from '@/lib/router';
import { InboxIcon, PencilIcon, UserXIcon } from 'lucide-react';
import { PageContainer, PageHeader } from '../../components/ui/PageHeader';
import { ACCOUNT_STATUS, ROLE_LABEL } from '../../components/admin/AdminTabs';
import { UserFormDialog } from '../../components/admin/UserFormDialog';
import { Panel } from '../../components/dashboard/Panel';
import { TicketMiniList } from '../../components/dashboard/TicketMiniList';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button, ButtonLink } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/States';
import { useAppState } from '../../contexts/AppStateContext';
import { formatDate, relativeTime } from '../../utils/time';
import { isActive } from '../../utils/ticketMeta';

export function UserDetail() {
  const { id } = useParams();
  const { getUser, getTeam, tickets } = useAppState();
  const [editing, setEditing] = useState(false);
  const user = getUser(id);

  if (!user) {
    return (
      <PageContainer>
        <EmptyState icon={<UserXIcon />} title="User not found" description="This user may have been deleted." action={<ButtonLink to="/admin/users" size="sm">Back to users</ButtonLink>} />
      </PageContainer>);

  }

  const staff = user.role !== 'requester';
  const related = tickets.filter((t) => staff ? t.assigneeId === user.id : t.requesterId === user.id);
  const active = related.filter((t) => isActive(t.status));

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: 'Users & Teams', to: '/admin/users' }, { label: user.name }]}
        title={user.name}
        meta={<Badge tone={ACCOUNT_STATUS[user.status].tone}>{ACCOUNT_STATUS[user.status].label}</Badge>}
        description={`${ROLE_LABEL[user.role]} · ${user.email}`}
        actions={<Button size="sm" onClick={() => setEditing(true)} leadingIcon={<PencilIcon className="h-4 w-4" />}>Edit user</Button>} />
      

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="h-fit rounded-lg border border-line bg-surface p-5 shadow-card" aria-label="Profile">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} id={user.id} size="xl" />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-ink">{user.name}</p>
              <p className="truncate text-[13px] text-ink-3">{user.title || ROLE_LABEL[user.role]}</p>
            </div>
          </div>
          <dl className="mt-5 divide-y divide-line border-t border-line text-[13px]">
            {[
            ['Role', ROLE_LABEL[user.role]],
            [staff ? 'Teams' : 'Organization', staff ? user.teamIds.map((t) => getTeam(t)?.name).join(', ') || 'No team' : user.organization],
            ['Created', formatDate(user.createdAt)],
            ['Last active', user.lastActiveAt ? relativeTime(user.lastActiveAt) : 'Never signed in'],
            [staff ? 'Active tickets' : 'Open requests', String(active.length)]].
            map(([k, v]) =>
            <div key={k} className="flex justify-between gap-4 py-2.5">
                <dt className="text-ink-3">{k}</dt>
                <dd className="text-right text-ink">{v}</dd>
              </div>
            )}
          </dl>
        </section>

        <div className="space-y-5">
          <Panel title={staff ? 'Assigned tickets' : 'Submitted tickets'} description={`${related.length} total · ${active.length} active`}>
            <TicketMiniList tickets={[...related].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))} showDue={staff} empty={{ icon: <InboxIcon />, title: staff ? 'No tickets assigned' : 'No tickets submitted' }} />
          </Panel>
          <Panel title="Recent activity">
            <ActivityFeed tickets={tickets} actorId={user.id} limit={8} />
          </Panel>
        </div>
      </div>
      <UserFormDialog open={editing} mode="edit" user={user} onClose={() => setEditing(false)} />
    </PageContainer>);

}
