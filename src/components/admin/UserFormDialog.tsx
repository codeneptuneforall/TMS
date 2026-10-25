'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Field, describedBy } from '../ui/Field';
import { Input } from '../ui/FormControls';
import { Checkbox } from '../ui/Checkbox';
import { InlineAlert } from '../ui/States';
import { useAppState } from '../../contexts/AppStateContext';
import { ROLE_LABEL } from './AdminTabs';
import { uid, cn } from '../../utils/cn';
import { nowIso } from '../../utils/time';
import type { Role, User } from '../../types/user';

const ROLE_HELP: Record<Role, string> = {
  admin: 'Full access, including users, teams, reports, and settings.',
  manager: 'Supervises support agents, manages team tickets, and handles escalated issues.',
  agent: 'Works tickets for their teams. Can reply, add notes, and update workflow.',
  requester: 'Creates tickets and sees only their own requests.'
};

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
  mode: 'create' | 'invite' | 'edit';
}

export function UserFormDialog({ open, onClose, user, mode }: UserFormDialogProps) {
  const { teams, users, saveUser } = useAppState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('agent');
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [organization, setOrganization] = useState('');
  const [title, setTitle] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setRole(user?.role ?? 'agent');
    setTeamIds(user?.teamIds ?? []);
    setOrganization(user?.organization ?? 'Cadence');
    setTitle(user?.title ?? '');
    setAttempted(false);
    setError(null);
  }, [open, user]);

  const errors = {
    name: mode !== 'invite' && name.trim().length < 2 ? 'Enter a full name.' : undefined,
    email: !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email address.' : users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== user?.id) ? 'A user with this email already exists.' : undefined
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (errors.name || errors.email) return;
    setSaving(true);
    const payload: User = {
      id: user?.id ?? uid('u'),
      name: name.trim() || email.split('@')[0],
      email: email.trim().toLowerCase(),
      role,
      teamIds: role === 'requester' ? [] : teamIds,
      status: user?.status ?? (mode === 'invite' ? 'invited' : 'active'),
      title: title.trim(),
      organization: role === 'requester' ? organization.trim() || 'Customer' : 'Cadence',
      createdAt: user?.createdAt ?? nowIso(),
      lastActiveAt: user?.lastActiveAt ?? null
    };
    const res = await saveUser(payload);
    setSaving(false);
    if (!res.ok) return setError(res.error);
    toast.success(mode === 'invite' ? `Invitation sent to ${payload.email}` : mode === 'create' ? `${payload.name} added` : 'User updated');
    onClose();
  };

  const titleText = mode === 'invite' ? 'Invite user' : mode === 'create' ? 'Create user' : `Edit ${user?.name}`;
  const desc = mode === 'invite' ? 'They’ll receive an email to set a password and activate their account.' : mode === 'create' ? 'The user is created as active and receives a temporary password by email.' : undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={titleText}
      description={desc}
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="user-form" loading={saving}>{mode === 'invite' ? 'Send invitation' : mode === 'create' ? 'Create user' : 'Save changes'}</Button>
        </>
      }>
      
      <form id="user-form" onSubmit={submit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="uf-email" label="Email" required error={attempted ? errors.email : undefined} className={mode === 'invite' ? 'sm:col-span-2' : undefined}>
            <Input id="uf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={attempted && !!errors.email} aria-describedby={describedBy('uf-email', attempted ? errors.email : undefined)} />
          </Field>
          {mode !== 'invite' &&
          <Field id="uf-name" label="Full name" required error={attempted ? errors.name : undefined}>
              <Input id="uf-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={attempted && !!errors.name} aria-describedby={describedBy('uf-name', attempted ? errors.name : undefined)} />
            </Field>
          }
        </div>

        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-ink">Role</legend>
          <div className="space-y-2">
            {(Object.keys(ROLE_LABEL) as Role[]).map((r) =>
            <label key={r} className={cn('flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5', role === r ? 'border-accent bg-accent-soft' : 'border-line hover:bg-subtle')}>
                <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} className="mt-0.5 h-4 w-4 accent-accent" />
                <span>
                  <span className="block text-[13px] font-medium text-ink">{ROLE_LABEL[r]}</span>
                  <span className="block text-[12px] text-ink-3">{ROLE_HELP[r]}</span>
                </span>
              </label>
            )}
          </div>
        </fieldset>

        {role === 'requester' ?
        <Field id="uf-org" label="Organization">
            <Input id="uf-org" value={organization} onChange={(e) => setOrganization(e.target.value)} />
          </Field> :

        <fieldset>
            <legend className="mb-1.5 text-[13px] font-medium text-ink">Teams <span className="font-normal text-ink-3">Optional</span></legend>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {teams.filter((t) => t.active).map((t) =>
            <label key={t.id} className="flex items-center gap-2 rounded-md px-1 py-1 text-[13px] text-ink">
                  <Checkbox checked={teamIds.includes(t.id)} onChange={() => setTeamIds((ids) => ids.includes(t.id) ? ids.filter((x) => x !== t.id) : [...ids, t.id])} />
                  {t.name}
                </label>
            )}
            </div>
          </fieldset>
        }

        {mode !== 'invite' &&
        <Field id="uf-title" label="Job title" optional>
            <Input id="uf-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
        }
        {mode === 'edit' && user?.role !== role &&
        <InlineAlert tone="warning">Changing role updates what {user?.name} can see immediately after their next request.</InlineAlert>
        }
        {error && <InlineAlert>{error}</InlineAlert>}
      </form>
    </Dialog>);

}
