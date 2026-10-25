'use client';
import React, { useState } from 'react';
import { useParams } from '@/lib/router';
import { KeyRoundIcon, LaptopIcon, SlidersHorizontalIcon, SmartphoneIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageContainer, PageHeader } from '../components/ui/PageHeader';
import { SubNav, SettingsSection } from '../components/ui/SubNav';
import { Field, describedBy } from '../components/ui/Field';
import { Input, Select } from '../components/ui/FormControls';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { Avatar } from '../components/ui/Avatar';
import { Dialog } from '../components/ui/Dialog';
import { InlineAlert } from '../components/ui/States';
import { PasswordRequirements, passwordValid } from '../components/auth/PasswordRequirements';
import { useAppState, useCurrentUser } from '../contexts/AppStateContext';
import { NotFound } from './system/NotFound';

const ROLE_LABEL = { admin: 'Administrator', manager: 'Team Leader / Support Manager', agent: 'Support agent', requester: 'Customer' };

export function Account() {
  const { section = 'profile' } = useParams();
  if (!['profile', 'preferences', 'security'].includes(section)) return <NotFound inShell />;
  return (
    <PageContainer>
      <PageHeader title="Account" description="Manage your personal details, preferences, and sign-in security." />
      <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        <SubNav
          label="Account sections"
          items={[
          { to: '/account/profile', label: 'My profile', icon: <UserIcon /> },
          { to: '/account/preferences', label: 'Preferences', icon: <SlidersHorizontalIcon /> },
          { to: '/account/security', label: 'Password & sessions', icon: <KeyRoundIcon /> }]
          } />
        
        <div className="min-w-0 max-w-2xl space-y-5">
          {section === 'profile' && <ProfileSection />}
          {section === 'preferences' && <PreferencesSection />}
          {section === 'security' && <SecuritySection />}
        </div>
      </div>
    </PageContainer>);

}

function ProfileSection() {
  const user = useCurrentUser();
  const { saveUser, getTeam } = useAppState();
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameError = name.trim().length < 2 ? 'Enter your full name.' : undefined;
  const dirty = name !== user.name || title !== user.title;

  const save = async () => {
    if (nameError) return;
    setSaving(true);
    setError(null);
    const res = await saveUser({ ...user, name: name.trim(), title: title.trim() });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    toast.success('Profile saved');
  };

  return (
    <SettingsSection
      title="My profile"
      description="Shown to teammates and on ticket replies."
      footer={
      <>
          <Button onClick={() => {setName(user.name);setTitle(user.title);}} disabled={!dirty}>Discard</Button>
          <Button variant="primary" onClick={save} loading={saving} disabled={!dirty || !!nameError}>Save changes</Button>
        </>
      }>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar name={name || user.name} id={user.id} size="xl" />
          <div className="text-[13px]">
            <p className="font-medium text-ink">{ROLE_LABEL[user.role]}</p>
            <p className="text-ink-3">{user.role === 'requester' ? user.organization : user.teamIds.map((t) => getTeam(t)?.name).join(', ') || 'No team'}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pf-name" label="Full name" required error={nameError}>
            <Input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!nameError} aria-describedby={describedBy('pf-name', nameError)} />
          </Field>
          <Field id="pf-title" label="Job title" optional>
            <Input id="pf-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
        </div>
        <Field id="pf-email" label="Email" helper="Contact an administrator to change your sign-in email.">
          <Input id="pf-email" value={user.email} disabled readOnly aria-describedby="pf-email-help" />
        </Field>
        {error && <InlineAlert>{error}</InlineAlert>}
      </div>
    </SettingsSection>);

}

function PreferencesSection() {
  const user = useCurrentUser();
  const staff = user.role !== 'requester';
  const [prefs, setPrefs] = useState({ timezone: 'Europe/London', dateFormat: 'MMM d, yyyy', landing: '/overview', emailReplies: true, emailAssigned: true, emailDigest: false, desktop: staff });
  const set = <K extends keyof typeof prefs,>(k: K, v: (typeof prefs)[K]) => setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <>
      <SettingsSection title="Regional" description="How dates and times are displayed to you." footer={<Button variant="primary" onClick={() => toast.success('Preferences saved')}>Save preferences</Button>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pr-tz" label="Time zone">
            <Select id="pr-tz" value={prefs.timezone} onChange={(e) => set('timezone', e.target.value)}>
              <option value="Europe/London">London (GMT+1)</option>
              <option value="America/New_York">New York (GMT−4)</option>
              <option value="America/Los_Angeles">Los Angeles (GMT−7)</option>
              <option value="Asia/Singapore">Singapore (GMT+8)</option>
            </Select>
          </Field>
          <Field id="pr-date" label="Date format">
            <Select id="pr-date" value={prefs.dateFormat} onChange={(e) => set('dateFormat', e.target.value)}>
              <option value="MMM d, yyyy">Oct 24, 2026</option>
              <option value="d MMM yyyy">24 Oct 2026</option>
              <option value="yyyy-MM-dd">2026-10-24</option>
            </Select>
          </Field>
          {staff &&
          <Field id="pr-landing" label="Start page" className="sm:col-span-2" helper="Where Relay opens after you sign in.">
              <Select id="pr-landing" value={prefs.landing} onChange={(e) => set('landing', e.target.value)} aria-describedby="pr-landing-help">
                <option value="/overview">Overview</option>
                <option value="/queue/mine">My Tickets</option>
                <option value="/queue/unassigned">Unassigned</option>
              </Select>
            </Field>
          }
        </div>
      </SettingsSection>
      <SettingsSection title="Email notifications" description="Choose what we email you about. In-app notifications are always on." footer={<Button variant="primary" onClick={() => toast.success('Notification preferences saved')}>Save preferences</Button>}>
        <div className="divide-y divide-line">
          <Switch id="pr-replies" label="Replies on my tickets" description={staff ? 'When a requester replies to a ticket you own.' : 'When our team replies to one of your requests.'} checked={prefs.emailReplies} onChange={(v) => set('emailReplies', v)} />
          {staff && <Switch id="pr-assigned" label="Assignments" description="When a ticket is assigned to you or your team." checked={prefs.emailAssigned} onChange={(v) => set('emailAssigned', v)} />}
          <Switch id="pr-digest" label="Daily summary" description="A morning digest of open tickets and pending replies." checked={prefs.emailDigest} onChange={(v) => set('emailDigest', v)} />
          {staff && <Switch id="pr-desktop" label="Desktop alerts for urgent tickets" description="Browser notifications while Relay is open." checked={prefs.desktop} onChange={(v) => set('desktop', v)} />}
        </div>
      </SettingsSection>
    </>);

}

function SecuritySection() {
  const { simulateErrors } = useAppState();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmSessions, setConfirmSessions] = useState(false);
  const [sessions, setSessions] = useState([
  { id: 's1', device: 'Chrome on macOS', where: 'London, UK', when: 'Active now', current: true, mobile: false },
  { id: 's2', device: 'Safari on iPhone', where: 'London, UK', when: '2 hours ago', current: false, mobile: true },
  { id: 's3', device: 'Firefox on Windows', where: 'Manchester, UK', when: '3 days ago', current: false, mobile: false }]
  );

  const errors = {
    current: !current ? 'Enter your current password.' : undefined,
    next: !passwordValid(next) ? 'New password doesn’t meet the requirements.' : next === current ? 'Choose a password you haven’t used here.' : undefined,
    confirm: confirm !== next ? 'Passwords don’t match.' : undefined
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    setError(null);
    if (errors.current || errors.next || errors.confirm) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 450));
    setSaving(false);
    if (simulateErrors) return setError('We couldn’t update your password. Try again in a moment.');
    setCurrent('');
    setNext('');
    setConfirm('');
    setAttempted(false);
    toast.success('Password changed');
  };

  return (
    <>
      <form onSubmit={submit} noValidate>
        <SettingsSection title="Change password" description="You’ll stay signed in on this device." footer={<Button type="submit" variant="primary" loading={saving}>Update password</Button>}>
          <div className="space-y-4">
            <Field id="cp-current" label="Current password" required error={attempted ? errors.current : undefined}>
              <Input id="cp-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} aria-invalid={attempted && !!errors.current} aria-describedby={describedBy('cp-current', attempted ? errors.current : undefined)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="cp-new" label="New password" required error={attempted ? errors.next : undefined}>
                <Input id="cp-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} aria-invalid={attempted && !!errors.next} aria-describedby="cp-rules" />
              </Field>
              <Field id="cp-confirm" label="Confirm new password" required error={attempted ? errors.confirm : undefined}>
                <Input id="cp-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-invalid={attempted && !!errors.confirm} aria-describedby={describedBy('cp-confirm', attempted ? errors.confirm : undefined)} />
              </Field>
            </div>
            <PasswordRequirements password={next} id="cp-rules" />
            {error && <InlineAlert>{error}</InlineAlert>}
          </div>
        </SettingsSection>
      </form>

      <SettingsSection
        title="Active sessions"
        description="Devices currently signed in to your account."
        footer={<Button onClick={() => setConfirmSessions(true)} disabled={sessions.length <= 1}>Sign out other sessions</Button>}>
        
        <ul className="divide-y divide-line">
          {sessions.map((s) =>
          <li key={s.id} className="flex items-center gap-3 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-ink-2">{s.mobile ? <SmartphoneIcon className="h-4 w-4" aria-hidden /> : <LaptopIcon className="h-4 w-4" aria-hidden />}</span>
              <div className="min-w-0 flex-1 text-[13px]">
                <p className="font-medium text-ink">{s.device} {s.current && <span className="ml-1.5 rounded bg-success-soft px-1.5 py-px text-2xs font-medium text-success-fg">This device</span>}</p>
                <p className="text-ink-3">{s.where} · {s.when}</p>
              </div>
            </li>
          )}
        </ul>
      </SettingsSection>

      <Dialog
        open={confirmSessions}
        onClose={() => setConfirmSessions(false)}
        size="sm"
        role="alertdialog"
        title="Sign out other sessions?"
        description={`${sessions.length - 1} other devices will be signed out immediately and will need to sign in again.`}
        footer={
        <>
            <Button onClick={() => setConfirmSessions(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => {setSessions((s) => s.filter((x) => x.current));setConfirmSessions(false);toast.success('Other sessions signed out');}}>Sign out others</Button>
          </>
        } />
      
    </>);

}
