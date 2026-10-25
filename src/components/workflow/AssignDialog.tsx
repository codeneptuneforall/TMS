'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { SearchIcon, UserMinusIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/FormControls';
import { InlineAlert } from '../ui/States';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { isActive } from '../../utils/ticketMeta';
import { cn } from '../../utils/cn';

interface AssignDialogProps {
  open: boolean;
  ticketIds: string[];
  onClose: () => void;
}

export function AssignDialog({ open, ticketIds, onClose }: AssignDialogProps) {
  const { users, teams, tickets, assign, getUser, getTeam } = useAppState();
  const me = useCurrentUser();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targets = tickets.filter((t) => ticketIds.includes(t.id));
  const single = targets.length === 1 ? targets[0] : null;

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(undefined);
      setError(null);
    }
  }, [open]);

  const agents = useMemo(
    () => users.filter((u) => u.role !== 'requester' && u.status === 'active'),
    [users]
  );

  const load = (id: string) => tickets.filter((t) => t.assigneeId === id && isActive(t.status)).length;

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (id: string) => {
      const u = getUser(id);
      return !!u && (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    };
    const result = teams.
    filter((t) => t.active).
    map((team) => ({ id: team.id, name: team.name, members: team.memberIds.filter((m) => agents.some((a) => a.id === m) && match(m)) })).
    filter((g) => g.members.length > 0);
    const noTeam = agents.filter((a) => a.teamIds.length === 0 && match(a.id)).map((a) => a.id);
    if (noTeam.length) result.push({ id: 'none', name: 'No team', members: noTeam });
    return result;
  }, [teams, agents, query, getUser]);

  const selectedUser = selected ? getUser(selected) : undefined;
  const ticketTeam = single ? getTeam(single.teamId) : undefined;
  const willMoveTeam = selectedUser && ticketTeam && !ticketTeam.memberIds.includes(selectedUser.id) && selectedUser.teamIds.length > 0;
  const newTeam = willMoveTeam ? getTeam(selectedUser!.teamIds[0]) : undefined;

  const submit = async () => {
    if (selected === undefined) return;
    setSaving(true);
    setError(null);
    const teamId = selectedUser && selectedUser.teamIds.length > 0 ? targets.every((t) => t.teamId && selectedUser.teamIds.includes(t.teamId)) ? undefined : selectedUser.teamIds[0] : undefined;
    const res = await assign(ticketIds, selected, teamId);
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const label = selected === null ? 'Unassigned' : selected === me.id ? 'Assigned to you' : `Assigned to ${selectedUser?.name}`;
    toast.success(ticketIds.length > 1 ? `${label} · ${ticketIds.length} tickets` : `${label} · ${ticketIds[0]}`);
    onClose();
  };

  const canSelfAssign = me.role !== 'requester';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={ticketIds.length > 1 ? `Assign ${ticketIds.length} tickets` : 'Assign agent'}
      description={single ? <span><span className="ticket-id text-ink">{single.id}</span> · {single.subject}</span> : 'Each selected ticket will be assigned to the same agent.'}
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit} loading={saving} disabled={selected === undefined}>
            {selected === null ? 'Unassign' : 'Assign'}
          </Button>
        </>
      }>
      
      <div className="space-y-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search agents by name or email" className="pl-9" aria-label="Search agents" />
        </div>

        <div className="flex flex-wrap gap-2">
          {canSelfAssign &&
          <Button size="sm" onClick={() => setSelected(me.id)} className={cn(selected === me.id && 'border-accent ring-2 ring-accent/20')}>
              <Avatar name={me.name} id={me.id} size="xs" /> Assign to me
            </Button>
          }
          {targets.some((t) => t.assigneeId) &&
          <Button size="sm" onClick={() => setSelected(null)} leadingIcon={<UserMinusIcon className="h-3.5 w-3.5" />} className={cn(selected === null && 'border-accent ring-2 ring-accent/20')}>
              Unassign
            </Button>
          }
        </div>

        <div role="listbox" aria-label="Agents" className="max-h-72 overflow-y-auto rounded-lg border border-line scroll-thin">
          {groups.length === 0 && <p className="px-3 py-6 text-center text-[13px] text-ink-3">No agents match “{query}”.</p>}
          {groups.map((g) =>
          <div key={g.id}>
              <div className="sticky top-0 z-10 border-b border-line bg-subtle px-3 py-1.5 text-2xs font-medium text-ink-3">{g.name}</div>
              {g.members.map((id) => {
              const u = getUser(id)!;
              const isSel = selected === id;
              const isCurrent = single?.assigneeId === id;
              const count = load(id);
              return (
                <button
                  key={`${g.id}-${id}`}
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  onClick={() => setSelected(id)}
                  className={cn(
                    'flex w-full items-center gap-3 border-b border-line px-3 py-2 text-left last:border-b-0 transition-colors duration-100 focus-visible:outline-none focus-visible:bg-muted',
                    isSel ? 'bg-accent-soft' : 'hover:bg-subtle'
                  )}>
                  
                    <Avatar name={u.name} id={u.id} size="md" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
                        <span className="truncate">{u.name}</span>
                        {u.id === me.id && <span className="text-2xs font-normal text-ink-3">You</span>}
                        {isCurrent && <span className="rounded bg-muted px-1.5 text-2xs font-normal text-ink-2">Current</span>}
                      </span>
                      <span className="block truncate text-[12px] text-ink-3">{u.title}</span>
                    </span>
                    <span className="shrink-0 text-right text-[12px] tabular-nums text-ink-3">
                      <span className="font-medium text-ink-2">{count}</span> active
                    </span>
                    <CheckIcon className={cn('h-4 w-4 shrink-0 text-accent', !isSel && 'invisible')} aria-hidden />
                  </button>);

            })}
            </div>
          )}
        </div>

        {willMoveTeam && newTeam &&
        <p className="text-[12px] leading-5 text-ink-2">
            {selectedUser?.name} isn’t on {ticketTeam?.name}. The ticket will move to <span className="font-medium text-ink">{newTeam.name}</span>.
          </p>
        }
        {error && <InlineAlert>{error}</InlineAlert>}
      </div>
    </Dialog>);

}
