'use client';
import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { SettingsSection } from '../ui/SubNav';
import { Select } from '../ui/FormControls';
import { Switch } from '../ui/Switch';
import { Field } from '../ui/Field';
import { StatusBadge } from '../tickets/StatusBadge';
import { SettingsSaveBar } from './SettingsSaveBar';
import { useSettingsDraft } from '../../hooks/useSettingsDraft';
import { allowedTransitions, STATUS_META, STATUS_ORDER } from '../../utils/ticketMeta';

export function WorkflowSettings() {
  const { draft, set, dirty, reset, save, saving } = useSettingsDraft(
    { autoCloseDays: '7', reopenDays: '7', requireNote: false, pendingPauses: true, requesterReplyReopens: true },
    'Workflow settings saved'
  );

  return (
    <>
      <SettingsSection title="Ticket lifecycle" description="The default path is Open → In Progress → Pending → Resolved → Closed.">
        <ol className="space-y-2">
          {STATUS_ORDER.map((s) => {
            const next = allowedTransitions(s, 'agent');
            return (
              <li key={s} className="grid items-start gap-2 rounded-md border border-line px-3 py-2.5 sm:grid-cols-[130px_1fr_auto] sm:items-center sm:gap-4">
                <StatusBadge status={s} />
                <p className="text-[13px] text-ink-2">{STATUS_META[s].description}</p>
                <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-3">
                  <ArrowRightIcon className="h-3.5 w-3.5" aria-label="Can move to" />
                  {next.length ? next.map((n) => <span key={n} className="rounded bg-muted px-1.5 py-0.5 text-ink-2">{STATUS_META[n].label}</span>) : <span>Admins only</span>}
                </div>
              </li>);

          })}
        </ol>
        <p className="mt-3 text-[12px] text-ink-3">Status names are fixed in this version. The server rejects transitions outside this map.</p>
      </SettingsSection>

      <SettingsSection
        title="Automation"
        description="Rules that change ticket status without an agent."
        footer={
        <SettingsSaveBar
          dirty={dirty}
          saving={saving}
          onReset={reset}
          onSave={() => save()}
          confirm={{ title: 'Update workflow rules?', description: 'These rules run on every ticket, including ones already resolved. Tickets older than the new auto-close window will close on the next run.' }} />

        }>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="wf-close" label="Auto-close resolved tickets after" helper="Closed tickets become read-only.">
            <Select id="wf-close" value={draft.autoCloseDays} onChange={(e) => set('autoCloseDays', e.target.value)} aria-describedby="wf-close-help">
              {['3', '7', '14', '30'].map((d) => <option key={d} value={d}>{d} days</option>)}
            </Select>
          </Field>
          <Field id="wf-reopen" label="Requesters can reopen within">
            <Select id="wf-reopen" value={draft.reopenDays} onChange={(e) => set('reopenDays', e.target.value)}>
              {['3', '7', '14'].map((d) => <option key={d} value={d}>{d} days of resolution</option>)}
            </Select>
          </Field>
        </div>
        <div className="mt-2 divide-y divide-line">
          <Switch id="wf-reply" label="Requester reply moves Pending tickets back to In Progress" description="Keeps tickets from stalling after the requester answers." checked={draft.requesterReplyReopens} onChange={(v) => set('requesterReplyReopens', v)} />
          <Switch id="wf-pause" label="Pending pauses the SLA clock" description="Recommended. Time spent waiting on requesters or third parties isn’t counted." checked={draft.pendingPauses} onChange={(v) => set('pendingPauses', v)} />
          <Switch id="wf-note" label="Require a resolution message" description="Agents must write a public summary when resolving." checked={draft.requireNote} onChange={(v) => set('requireNote', v)} />
        </div>
      </SettingsSection>
    </>);

}
