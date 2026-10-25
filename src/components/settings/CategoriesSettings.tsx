'use client';
import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { SettingsSection } from '../ui/SubNav';
import { Input, Select } from '../ui/FormControls';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SettingsSaveBar } from './SettingsSaveBar';
import { useAppState } from '../../contexts/AppStateContext';
import { useSettingsDraft } from '../../hooks/useSettingsDraft';
import { uid } from '../../utils/cn';

export function CategoriesSettings() {
  const { categories, teams, tickets, saveCategories } = useAppState();
  const { draft, setDraft, dirty, reset, save, saving } = useSettingsDraft({ list: categories }, 'Categories saved');
  const [newName, setNewName] = useState('');

  const update = (id: string, patch: Partial<(typeof categories)[number]>) => setDraft((d) => ({ list: d.list.map((c) => c.id === id ? { ...c, ...patch } : c) }));
  const add = () => {
    if (newName.trim().length < 2) return;
    setDraft((d) => ({ list: [...d.list, { id: uid('c'), name: newName.trim(), description: '', defaultTeamId: 't-tier1', active: true }] }));
    setNewName('');
  };

  return (
    <SettingsSection
      title="Ticket categories"
      description="Categories help requesters describe their issue and decide which team a new ticket is routed to."
      footer={
      <SettingsSaveBar
        dirty={dirty}
        saving={saving}
        onReset={reset}
        onSave={() => save(async (v) => (await saveCategories(v.list)).ok)}
        confirm={{ title: 'Update ticket categories?', description: 'Routing changes apply to new tickets only. Archived categories are hidden from the create form but remain on existing tickets.' }} />

      }>
      
      <div className="-mx-5 overflow-x-auto">
        <table className="w-full min-w-[620px] text-[13px]">
          <thead className="border-y border-line bg-subtle text-left text-[12px] text-ink-3">
            <tr>
              <th scope="col" className="h-9 px-5 font-medium">Category</th>
              <th scope="col" className="px-3 font-medium">Routes to</th>
              <th scope="col" className="px-3 text-right font-medium">Tickets</th>
              <th scope="col" className="px-5 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {draft.list.map((c) =>
            <tr key={c.id} className="border-b border-line">
                <td className="px-5 py-2">
                  <Input aria-label={`Name for ${c.name}`} value={c.name} onChange={(e) => update(c.id, { name: e.target.value })} className="h-8 text-[13px]" disabled={!c.active} />
                </td>
                <td className="px-3">
                  <Select aria-label={`Default team for ${c.name}`} value={c.defaultTeamId} onChange={(e) => update(c.id, { defaultTeamId: e.target.value })} className="h-8 text-[13px]" disabled={!c.active}>
                    {teams.filter((t) => t.active).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </Select>
                </td>
                <td className="px-3 text-right tabular-nums text-ink-2">{tickets.filter((t) => t.categoryId === c.id).length}</td>
                <td className="px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!c.active && <Badge>Archived</Badge>}
                    <Button size="sm" variant="ghost" onClick={() => update(c.id, { active: !c.active })}>{c.active ? 'Archive' : 'Restore'}</Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={(e) => {e.preventDefault();add();}} className="mt-4 flex gap-2">
        <Input aria-label="New category name" placeholder="New category name" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-8 max-w-xs text-[13px]" />
        <Button size="sm" type="submit" disabled={newName.trim().length < 2} leadingIcon={<PlusIcon className="h-4 w-4" />}>Add category</Button>
      </form>
    </SettingsSection>);

}
