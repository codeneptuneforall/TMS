'use client';
import React from 'react';
import { Link } from '@/lib/router';
import { SettingsSection } from '../ui/SubNav';
import { Select } from '../ui/FormControls';
import { Switch } from '../ui/Switch';
import { Field } from '../ui/Field';
import { SettingsSaveBar } from './SettingsSaveBar';
import { useAppState } from '../../contexts/AppStateContext';
import { useSettingsDraft } from '../../hooks/useSettingsDraft';
import { cn } from '../../utils/cn';

const METHODS = [
{ id: 'manual', label: 'Manual', description: 'Tickets land in the team queue. Agents pick them up or a lead assigns them.' },
{ id: 'round_robin', label: 'Round robin', description: 'Rotate new tickets evenly across active team members.' },
{ id: 'load', label: 'Load-balanced', description: 'Assign to the team member with the fewest active tickets.' }];


export function AssignmentSettings() {
  const { categories, getTeam } = useAppState();
  const { draft, set, dirty, reset, save, saving } = useSettingsDraft({ method: 'manual', cap: '12', skipAway: true, unassignOnSuspend: true }, 'Assignment settings saved');

  return (
    <>
      <SettingsSection
        title="Assignment"
        description="How new tickets get an owner once they’re routed to a team."
        footer={
        <SettingsSaveBar
          dirty={dirty}
          saving={saving}
          onReset={reset}
          onSave={() => save()}
          confirm={{ title: 'Change assignment method?', description: 'This affects every new ticket across all teams. Existing assignments stay as they are.' }} />

        }>
        
        <fieldset>
          <legend className="sr-only">Assignment method</legend>
          <div className="grid gap-2 md:grid-cols-3">
            {METHODS.map((m) =>
            <label key={m.id} className={cn('flex cursor-pointer gap-3 rounded-md border px-3 py-3', draft.method === m.id ? 'border-accent bg-accent-soft' : 'border-line hover:bg-subtle')}>
                <input type="radio" name="method" checked={draft.method === m.id} onChange={() => set('method', m.id)} className="mt-0.5 h-4 w-4 accent-accent" />
                <span>
                  <span className="block text-[13px] font-medium text-ink">{m.label}</span>
                  <span className="mt-0.5 block text-[12px] leading-5 text-ink-3">{m.description}</span>
                </span>
              </label>
            )}
          </div>
        </fieldset>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field id="as-cap" label="Maximum active tickets per agent" helper={draft.method === 'manual' ? 'Only used by automatic methods.' : 'Agents at the limit are skipped.'}>
            <Select id="as-cap" value={draft.cap} onChange={(e) => set('cap', e.target.value)} disabled={draft.method === 'manual'} aria-describedby="as-cap-help">
              {['8', '12', '20', '30'].map((n) => <option key={n} value={n}>{n} tickets</option>)}
            </Select>
          </Field>
        </div>
        <div className="mt-2 divide-y divide-line">
          <Switch id="as-away" label="Skip agents marked as away" checked={draft.skipAway} onChange={(v) => set('skipAway', v)} disabled={draft.method === 'manual'} />
          <Switch id="as-suspend" label="Unassign tickets when a user is suspended" description="Returns their active tickets to the team queue." checked={draft.unassignOnSuspend} onChange={(v) => set('unassignOnSuspend', v)} />
        </div>
      </SettingsSection>

      <SettingsSection title="Routing by category" description="Which team receives a new ticket. Edit in Ticket categories.">
        <dl className="divide-y divide-line text-[13px]">
          {categories.filter((c) => c.active).map((c) =>
          <div key={c.id} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-ink">{c.name}</dt>
              <dd className="text-ink-2">{getTeam(c.defaultTeamId)?.name}</dd>
            </div>
          )}
        </dl>
        <Link to="/settings/categories" className="mt-3 inline-block text-[13px] font-medium text-accent-fg hover:underline">Edit routing →</Link>
      </SettingsSection>
    </>);

}
