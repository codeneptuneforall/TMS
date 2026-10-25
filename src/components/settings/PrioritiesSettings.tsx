'use client';
import React from 'react';
import { SettingsSection } from '../ui/SubNav';
import { Select } from '../ui/FormControls';
import { Badge } from '../ui/Badge';
import { PriorityIndicator } from '../tickets/PriorityIndicator';
import { SettingsSaveBar } from './SettingsSaveBar';
import { useSettingsDraft } from '../../hooks/useSettingsDraft';
import { slaPolicies } from '../../data/categories';
import { PRIORITY_META } from '../../utils/ticketMeta';
import { formatHours } from '../../utils/time';

const RESPONSE = [1, 2, 4, 8, 24];
const RESOLUTION = [4, 8, 24, 48, 72, 120];

export function PrioritiesSettings() {
  const { draft, setDraft, dirty, reset, save, saving } = useSettingsDraft({ list: slaPolicies }, 'SLA targets saved');
  const update = (i: number, key: 'firstResponseHours' | 'resolutionHours', v: number) =>
  setDraft((d) => ({ list: d.list.map((p, idx) => idx === i ? { ...p, [key]: v } : p) }));

  return (
    <SettingsSection
      title="Priorities & SLA targets"
      description="Targets set the due date shown on new tickets. They are a draft policy and aren’t reported as compliance yet."
      footer={
      <SettingsSaveBar
        dirty={dirty}
        saving={saving}
        onReset={reset}
        onSave={() => save()}
        confirm={{ title: 'Change SLA targets?', description: 'New targets apply to tickets created from now on. Due dates on existing tickets won’t change.' }} />

      }>
      
      <div className="mb-3"><Badge tone="warning">Draft policy</Badge></div>
      <div className="-mx-5 overflow-x-auto">
        <table className="w-full min-w-[620px] text-[13px]">
          <thead className="border-y border-line bg-subtle text-left text-[12px] text-ink-3">
            <tr>
              <th scope="col" className="h-9 px-5 font-medium">Priority</th>
              <th scope="col" className="px-3 font-medium">Meaning</th>
              <th scope="col" className="w-[150px] px-3 font-medium">First response</th>
              <th scope="col" className="w-[150px] px-5 font-medium">Resolution</th>
            </tr>
          </thead>
          <tbody>
            {draft.list.map((p, i) =>
            <tr key={p.priority} className="border-b border-line">
                <td className="px-5 py-2.5"><PriorityIndicator priority={p.priority} /></td>
                <td className="px-3 text-[12px] text-ink-3">{PRIORITY_META[p.priority].description}</td>
                <td className="px-3">
                  <Select aria-label={`First response target for ${PRIORITY_META[p.priority].label}`} value={p.firstResponseHours} onChange={(e) => update(i, 'firstResponseHours', Number(e.target.value))} className="h-8 text-[13px]">
                    {RESPONSE.map((h) => <option key={h} value={h}>{formatHours(h)}</option>)}
                  </Select>
                </td>
                <td className="px-5">
                  <Select aria-label={`Resolution target for ${PRIORITY_META[p.priority].label}`} value={p.resolutionHours} onChange={(e) => update(i, 'resolutionHours', Number(e.target.value))} className="h-8 text-[13px]">
                    {RESOLUTION.map((h) => <option key={h} value={h}>{formatHours(h)}</option>)}
                  </Select>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-ink-3">Priority levels are fixed so reporting stays comparable over time. Business hours from General settings apply.</p>
    </SettingsSection>);

}
