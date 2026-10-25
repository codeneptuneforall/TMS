'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Field, describedBy } from '../ui/Field';
import { Input, Select, Textarea } from '../ui/FormControls';
import { Checkbox } from '../ui/Checkbox';
import { Avatar } from '../ui/Avatar';
import { Switch } from '../ui/Switch';
import { InlineAlert } from '../ui/States';
import { useAppState } from '../../contexts/AppStateContext';
import { uid } from '../../utils/cn';
import { nowIso } from '../../utils/time';
import type { Team } from '../../types/user';

export function TeamFormDialog({ open, onClose, team }: {open: boolean;onClose: () => void;team?: Team | null;}) {
  const { users, teams, saveTeam } = useAppState();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [leadId, setLeadId] = useState('');
  const [active, setActive] = useState(true);
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const agents = users.filter((u) => u.role !== 'requester' && u.status !== 'suspended');

  useEffect(() => {
    if (!open) return;
    setName(team?.name ?? '');
    setDescription(team?.description ?? '');
    setMemberIds(team?.memberIds ?? []);
    setLeadId(team?.leadId ?? '');
    setActive(team?.active ?? true);
    setAttempted(false);
    setError(null);
  }, [open, team]);

  const nameError = name.trim().length < 2 ? 'Enter a team name.' : teams.some((t) => t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== team?.id) ? 'A team with this name already exists.' : undefined;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (nameError) return;
    setSaving(true);
    const res = await saveTeam({
      id: team?.id ?? uid('t'),
      name: name.trim(),
      description: description.trim(),
      memberIds,
      leadId: leadId && memberIds.includes(leadId) ? leadId : null,
      active,
      createdAt: team?.createdAt ?? nowIso()
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    toast.success(team ? 'Team updated' : `${name.trim()} created`);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={team ? `Edit ${team.name}` : 'Create team'}
      description="Teams own queues. Tickets are routed to a team by category or manually."
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="team-form" loading={saving}>{team ? 'Save changes' : 'Create team'}</Button>
        </>
      }>
      
      <form id="team-form" onSubmit={submit} noValidate className="space-y-4">
        <Field id="tf-name" label="Team name" required error={attempted ? nameError : undefined}>
          <Input id="tf-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={attempted && !!nameError} aria-describedby={describedBy('tf-name', attempted ? nameError : undefined)} />
        </Field>
        <Field id="tf-desc" label="Description" optional>
          <Textarea id="tf-desc" rows={2} className="min-h-[64px]" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-ink">Members</legend>
          <div className="max-h-48 overflow-y-auto rounded-md border border-line scroll-thin">
            {agents.map((a) =>
            <label key={a.id} className="flex cursor-pointer items-center gap-2.5 border-b border-line px-3 py-2 last:border-b-0 hover:bg-subtle">
                <Checkbox checked={memberIds.includes(a.id)} onChange={() => setMemberIds((ids) => ids.includes(a.id) ? ids.filter((x) => x !== a.id) : [...ids, a.id])} />
                <Avatar name={a.name} id={a.id} size="sm" />
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{a.name}</span>
                <span className="text-[12px] text-ink-3">{a.status === 'invited' ? 'Invited' : a.title}</span>
              </label>
            )}
          </div>
        </fieldset>
        <Field id="tf-lead" label="Team lead" optional helper="Must be a member of the team.">
          <Select id="tf-lead" value={leadId} onChange={(e) => setLeadId(e.target.value)} aria-describedby="tf-lead-help">
            <option value="">No lead</option>
            {agents.filter((a) => memberIds.includes(a.id)).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </Field>
        <Switch id="tf-active" label="Active" description="Inactive teams can’t receive new tickets." checked={active} onChange={setActive} />
        {error && <InlineAlert>{error}</InlineAlert>}
      </form>
    </Dialog>);

}
