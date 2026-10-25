'use client';
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { MailIcon, MoreHorizontalIcon, PencilIcon, SearchIcon, UserCheckIcon, UserPlusIcon, UserXIcon, UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageContainer, PageHeader } from '../../components/ui/PageHeader';
import { AdminTabs, ACCOUNT_STATUS, ROLE_LABEL } from '../../components/admin/AdminTabs';
import { UserFormDialog } from '../../components/admin/UserFormDialog';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/FormControls';
import { Popover } from '../../components/ui/Popover';
import { MenuItem, MenuSeparator } from '../../components/ui/Menu';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/States';
import { Dialog } from '../../components/ui/Dialog';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { formatDate, relativeTime } from '../../utils/time';
import type { User } from '../../types/user';

const PAGE = 8;

export function Users() {
  const me = useCurrentUser();
  const { users, getTeam, saveUser } = useAppState();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<{mode: 'create' | 'invite' | 'edit';user?: User;} | null>(null);
  const [suspending, setSuspending] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(
    () =>
    users.
    filter((u) => (!role || u.role === role) && (!status || u.status === status)).
    filter((u) => !q.trim() || `${u.name} ${u.email} ${u.organization}`.toLowerCase().includes(q.trim().toLowerCase())).
    sort((a, b) => a.name.localeCompare(b.name)),
    [users, q, role, status]
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice((Math.min(page, pageCount) - 1) * PAGE, Math.min(page, pageCount) * PAGE);

  const toggleSuspend = async () => {
    if (!suspending) return;
    setBusy(true);
    const next = suspending.status === 'suspended' ? 'active' : 'suspended';
    const res = await saveUser({ ...suspending, status: next });
    setBusy(false);
    if (!res.ok) return toast.error('Change not saved', { description: res.error });
    toast.success(next === 'suspended' ? `${suspending.name} suspended` : `${suspending.name} reactivated`);
    setSuspending(null);
  };

  const actions = (u: User) =>
  <Popover
    align="end"
    label={`Actions for ${u.name}`}
    trigger={({ ref, toggle, open }) =>
    <Button ref={ref} size="icon-sm" variant="ghost" onClick={(e) => {e.stopPropagation();toggle();}} aria-expanded={open} aria-label={`Actions for ${u.name}`}>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
    }>
    
      {(close) =>
    <div role="menu" onClick={(e) => e.stopPropagation()}>
          <MenuItem icon={<PencilIcon />} onSelect={() => {close();setDialog({ mode: 'edit', user: u });}}>Edit user</MenuItem>
          {u.status === 'invited' && <MenuItem icon={<MailIcon />} onSelect={() => {close();toast.success(`Invitation resent to ${u.email}`);}}>Resend invitation</MenuItem>}
          {u.id !== me.id && u.status !== 'invited' &&
      <>
              <MenuSeparator />
              <MenuItem icon={u.status === 'suspended' ? <UserCheckIcon /> : <UserXIcon />} tone={u.status === 'suspended' ? 'default' : 'danger'} onSelect={() => {close();setSuspending(u);}}>
                {u.status === 'suspended' ? 'Reactivate' : 'Suspend user'}
              </MenuItem>
            </>
      }
        </div>
    }
    </Popover>;


  return (
    <PageContainer wide>
      <PageHeader
        title="Users & Teams"
        description="Manage who can access Cadence Support and what they can do."
        actions={
        <>
            <Button size="sm" onClick={() => setDialog({ mode: 'create' })}>Create user</Button>
            <Button size="sm" variant="primary" onClick={() => setDialog({ mode: 'invite' })} leadingIcon={<UserPlusIcon className="h-4 w-4" />}>Invite user</Button>
          </>
        } />
      
      <AdminTabs />

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
          <input type="search" value={q} onChange={(e) => {setQ(e.target.value);setPage(1);}} placeholder="Search name, email, organization" aria-label="Search users" className="h-8 w-full rounded-md border border-line-strong bg-surface pl-9 pr-3 text-[13px] shadow-card placeholder:text-ink-3 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15" />
        </div>
        <div className="flex gap-2">
          <Select aria-label="Filter by role" value={role} onChange={(e) => {setRole(e.target.value);setPage(1);}} className="h-8 text-[13px]">
            <option value="">All roles</option>
            <option value="admin">Administrators</option>
            <option value="agent">Support agents</option>
            <option value="requester">Customers</option>
          </Select>
          <Select aria-label="Filter by status" value={status} onChange={(e) => {setStatus(e.target.value);setPage(1);}} className="h-8 text-[13px]">
            <option value="">Any status</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="suspended">Suspended</option>
          </Select>
        </div>
        <p className="text-[12px] tabular-nums text-ink-3 sm:ml-auto">{filtered.length} users</p>
      </div>

      {filtered.length === 0 ?
      <div className="rounded-lg border border-line bg-surface">
          <EmptyState icon={<UsersIcon />} title="No users match" description="Try another name or clear the filters." action={<Button size="sm" onClick={() => {setQ('');setRole('');setStatus('');}}>Clear filters</Button>} />
        </div> :

      <>
          <div className="hidden overflow-x-auto rounded-lg border border-line bg-surface shadow-card md:block">
            <table className="w-full min-w-[760px] text-[13px]">
              <thead className="border-b border-line bg-subtle text-left text-[12px] text-ink-3">
                <tr>
                  <th scope="col" className="h-9 px-4 font-medium">User</th>
                  <th scope="col" className="px-3 font-medium">Role</th>
                  <th scope="col" className="px-3 font-medium">Team / Organization</th>
                  <th scope="col" className="px-3 font-medium">Status</th>
                  <th scope="col" className="hidden px-3 font-medium lg:table-cell">Created</th>
                  <th scope="col" className="px-3 font-medium">Last active</th>
                  <th scope="col" className="w-12 px-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) =>
              <tr key={u.id} onClick={() => navigate(`/admin/users/${u.id}`)} className="h-[52px] cursor-pointer border-b border-line last:border-b-0 hover:bg-subtle">
                    <td className="px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.name} id={u.id} size="md" />
                        <div className="min-w-0">
                          <Link to={`/admin/users/${u.id}`} onClick={(e) => e.stopPropagation()} className="block truncate font-medium text-ink hover:underline">{u.name}{u.id === me.id && <span className="ml-1.5 font-normal text-ink-3">(you)</span>}</Link>
                          <span className="block truncate text-[12px] text-ink-3">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 text-ink-2">{ROLE_LABEL[u.role]}</td>
                    <td className="max-w-[200px] truncate px-3 text-ink-2">{u.role === 'requester' ? u.organization : u.teamIds.map((t) => getTeam(t)?.name).join(', ') || '—'}</td>
                    <td className="px-3"><Badge tone={ACCOUNT_STATUS[u.status].tone}>{ACCOUNT_STATUS[u.status].label}</Badge></td>
                    <td className="hidden px-3 tabular-nums text-ink-3 lg:table-cell">{formatDate(u.createdAt)}</td>
                    <td className="px-3 tabular-nums text-ink-3">{u.lastActiveAt ? relativeTime(u.lastActiveAt) : 'Never'}</td>
                    <td className="px-3" onClick={(e) => e.stopPropagation()}>{actions(u)}</td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
          <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface md:hidden">
            {rows.map((u) =>
          <li key={u.id} className="flex items-center gap-3 px-4 py-3">
                <Link to={`/admin/users/${u.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar name={u.name} id={u.id} size="md" />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-ink">{u.name}</span>
                    <span className="block truncate text-[12px] text-ink-3">{ROLE_LABEL[u.role]} · {u.email}</span>
                  </span>
                </Link>
                <Badge tone={ACCOUNT_STATUS[u.status].tone}>{ACCOUNT_STATUS[u.status].label}</Badge>
              </li>
          )}
          </ul>
          <Pagination page={Math.min(page, pageCount)} pageCount={pageCount} total={filtered.length} pageSize={PAGE} onChange={setPage} noun="users" />
        </>
      }

      <UserFormDialog open={!!dialog} mode={dialog?.mode ?? 'create'} user={dialog?.user} onClose={() => setDialog(null)} />
      <Dialog
        open={!!suspending}
        onClose={() => setSuspending(null)}
        size="sm"
        role="alertdialog"
        title={suspending?.status === 'suspended' ? `Reactivate ${suspending?.name}?` : `Suspend ${suspending?.name}?`}
        description={suspending?.status === 'suspended' ? 'They’ll be able to sign in again with their existing password.' : 'They’ll be signed out everywhere and can’t sign in. Their tickets stay assigned until you reassign them.'}
        footer={
        <>
            <Button onClick={() => setSuspending(null)}>Cancel</Button>
            <Button variant={suspending?.status === 'suspended' ? 'primary' : 'danger'} loading={busy} onClick={toggleSuspend}>{suspending?.status === 'suspended' ? 'Reactivate' : 'Suspend user'}</Button>
          </>
        } />
      
    </PageContainer>);

}
