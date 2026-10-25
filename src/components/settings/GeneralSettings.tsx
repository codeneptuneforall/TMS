'use client';
import React from 'react';
import { SettingsSection } from '../ui/SubNav';
import { Field } from '../ui/Field';
import { Input, Select } from '../ui/FormControls';
import { SettingsSaveBar } from './SettingsSaveBar';
import { useSettingsDraft } from '../../hooks/useSettingsDraft';

export function GeneralSettings() {
  const { draft, set, dirty, reset, save, saving } = useSettingsDraft(
    { name: 'Cadence Support', email: 'support@cadence.app', timezone: 'Europe/London', start: '08:00', end: '18:00', days: 'mon-fri', idPrefix: 'TKT' },
    'General settings saved'
  );
  return (
    <SettingsSection title="General" description="Workspace identity and business hours used for SLA calculations." footer={<SettingsSaveBar dirty={dirty} saving={saving} onReset={reset} onSave={() => save()} />}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="g-name" label="Workspace name" required>
          <Input id="g-name" value={draft.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field id="g-email" label="Support email" helper="Replies from requesters to this address create or update tickets.">
          <Input id="g-email" type="email" value={draft.email} onChange={(e) => set('email', e.target.value)} aria-describedby="g-email-help" />
        </Field>
        <Field id="g-tz" label="Workspace time zone">
          <Select id="g-tz" value={draft.timezone} onChange={(e) => set('timezone', e.target.value)}>
            <option value="Europe/London">London (GMT+1)</option>
            <option value="America/New_York">New York (GMT−4)</option>
            <option value="Asia/Singapore">Singapore (GMT+8)</option>
          </Select>
        </Field>
        <Field id="g-prefix" label="Ticket ID prefix" helper="Shown as TKT-001284. Existing tickets keep their IDs.">
          <Input id="g-prefix" value={draft.idPrefix} maxLength={5} onChange={(e) => set('idPrefix', e.target.value.toUpperCase())} className="ticket-id" aria-describedby="g-prefix-help" />
        </Field>
        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 text-[13px] font-medium text-ink">Business hours</legend>
          <div className="grid grid-cols-3 gap-2">
            <Select aria-label="Working days" value={draft.days} onChange={(e) => set('days', e.target.value)}>
              <option value="mon-fri">Mon – Fri</option>
              <option value="mon-sat">Mon – Sat</option>
              <option value="all">Every day</option>
            </Select>
            <Input aria-label="Start time" type="time" value={draft.start} onChange={(e) => set('start', e.target.value)} />
            <Input aria-label="End time" type="time" value={draft.end} onChange={(e) => set('end', e.target.value)} />
          </div>
          <p className="mt-1.5 text-[12px] text-ink-3">SLA timers only count down during business hours.</p>
        </fieldset>
      </div>
    </SettingsSection>);

}
