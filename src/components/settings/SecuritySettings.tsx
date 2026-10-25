'use client';
import React from 'react';
import { SettingsSection } from '../ui/SubNav';
import { Field } from '../ui/Field';
import { Input, Select } from '../ui/FormControls';
import { Switch } from '../ui/Switch';
import { SettingsSaveBar } from './SettingsSaveBar';
import { useSettingsDraft } from '../../hooks/useSettingsDraft';

export function SecuritySettings() {
  const { draft, set, dirty, reset, save, saving } = useSettingsDraft(
    { timeout: '8', idle: '60', twoFactor: true, minLength: '12', domains: 'relaydesk.io', allowRequesterSignup: false },
    'Security settings saved'
  );
  return (
    <SettingsSection
      title="Security & sessions"
      description="Sign-in requirements for everyone in this workspace."
      footer={
      <SettingsSaveBar
        dirty={dirty}
        saving={saving}
        onReset={reset}
        onSave={() => save()}
        confirm={{ title: 'Apply new security policy?', description: 'Users who don’t meet the new requirements will be asked to update their password or set up two-factor authentication at next sign-in.' }} />

      }>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="s-timeout" label="Maximum session length">
          <Select id="s-timeout" value={draft.timeout} onChange={(e) => set('timeout', e.target.value)}>
            {['4', '8', '12', '24'].map((h) => <option key={h} value={h}>{h} hours</option>)}
          </Select>
        </Field>
        <Field id="s-idle" label="Sign out after inactivity">
          <Select id="s-idle" value={draft.idle} onChange={(e) => set('idle', e.target.value)}>
            {['15', '30', '60', '120'].map((m) => <option key={m} value={m}>{m} minutes</option>)}
          </Select>
        </Field>
        <Field id="s-min" label="Minimum password length">
          <Select id="s-min" value={draft.minLength} onChange={(e) => set('minLength', e.target.value)}>
            {['10', '12', '14', '16'].map((n) => <option key={n} value={n}>{n} characters</option>)}
          </Select>
        </Field>
        <Field id="s-domains" label="Allowed staff email domains" helper="Comma-separated. Invitations to other domains are blocked.">
          <Input id="s-domains" value={draft.domains} onChange={(e) => set('domains', e.target.value)} aria-describedby="s-domains-help" />
        </Field>
      </div>
      <div className="mt-2 divide-y divide-line">
        <Switch id="s-2fa" label="Require two-factor authentication for staff" description="Administrators and agents must use an authenticator app." checked={draft.twoFactor} onChange={(v) => set('twoFactor', v)} />
        <Switch id="s-signup" label="Allow customers to self-register" description="When off, customers need an invitation or an email-created ticket." checked={draft.allowRequesterSignup} onChange={(v) => set('allowRequesterSignup', v)} />
      </div>
    </SettingsSection>);

}
