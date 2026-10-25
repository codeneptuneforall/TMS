'use client';
import React from 'react';
import { SettingsSection } from '../ui/SubNav';
import { Switch } from '../ui/Switch';
import { SettingsSaveBar } from './SettingsSaveBar';
import { useSettingsDraft } from '../../hooks/useSettingsDraft';

export function NotificationSettings() {
  const { draft, set, dirty, reset, save, saving } = useSettingsDraft(
    { confirm: true, agentReply: true, resolved: true, satisfaction: false, unassignedUrgent: true, slaWarning: true, assignedEmail: true, mentions: true },
    'Notification defaults saved'
  );
  const footer = <SettingsSaveBar dirty={dirty} saving={saving} onReset={reset} onSave={() => save()} />;
  return (
    <>
      <SettingsSection title="Requester emails" description="Sent to customers about their own tickets.">
        <div className="divide-y divide-line">
          <Switch id="n-confirm" label="Ticket received confirmation" description="Includes the ticket ID and a link to follow progress." checked={draft.confirm} onChange={(v) => set('confirm', v)} />
          <Switch id="n-reply" label="Agent replied" checked={draft.agentReply} onChange={(v) => set('agentReply', v)} />
          <Switch id="n-resolved" label="Ticket resolved" description="Explains how to reopen if the problem returns." checked={draft.resolved} onChange={(v) => set('resolved', v)} />
          <Switch id="n-csat" label="Satisfaction survey after closing" checked={draft.satisfaction} onChange={(v) => set('satisfaction', v)} />
        </div>
      </SettingsSection>
      <SettingsSection title="Staff alerts" description="Defaults for agents. Each person can adjust their own email preferences." footer={footer}>
        <div className="divide-y divide-line">
          <Switch id="n-assigned" label="Ticket assigned to me" checked={draft.assignedEmail} onChange={(v) => set('assignedEmail', v)} />
          <Switch id="n-mentions" label="Mentions in internal notes" checked={draft.mentions} onChange={(v) => set('mentions', v)} />
          <Switch id="n-urgent" label="Urgent ticket unassigned for 15 minutes" description="Sent to team leads and administrators." checked={draft.unassignedUrgent} onChange={(v) => set('unassignedUrgent', v)} />
          <Switch id="n-sla" label="Resolution due within 2 hours" checked={draft.slaWarning} onChange={(v) => set('slaWarning', v)} />
        </div>
      </SettingsSection>
    </>);

}
