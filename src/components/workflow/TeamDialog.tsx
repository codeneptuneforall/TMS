'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { InlineAlert } from '../ui/States';
import { useAppState } from '../../contexts/AppStateContext';
import { cn } from '../../utils/cn';
import { isActive } from '../../utils/ticketMeta';

interface TeamDialogProps {
  open: boolean;
  ticketIds: string[];
  onClose: () => void;
}

export function TeamDialog({ open, ticketIds, onClose }: TeamDialogProps) {
  const { teams, tickets, setTeam, getUser } = useAppState();
  const targets = tickets.filter((t) => ticketIds.includes(t.id));
  const current = targets.length === 1 ? targets[0].teamId : null;
  const [selected, setSelected] = useState<string | null>(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelected(current);
      setError(null);
    }
  }, [open, current]);

  const team = teams.find((t) => t.id === selected);
  const losesAssignee = targets.filter((t) => t.assigneeId && team && !team.memberIds.includes(t.assigneeId));

  const submit = async () => {
    if (!selected) return;
    setSaving(true);
    const res = await setTeam(ticketIds, selected);
    setSaving(false);
    if (!res.ok) return setError(res.error);
    toast.success(`Moved to ${team?.name}`);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Change team"
      description="Routing a ticket to another team makes it visible in that team’s queue."
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit} loading={saving} disabled={!selected || selected === current}>
            Move ticket{ticketIds.length > 1 ? 's' : ''}
          </Button>
        </>
      }>
      
      <fieldset className="space-y-2">
        <legend className="sr-only">Team</legend>
        {teams.map((t) => {
          const active = tickets.filter((x) => x.teamId === t.id && isActive(x.status)).length;
          return (
            <label
              key={t.id}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-100',
                !t.active && 'cursor-not-allowed opacity-60',
                selected === t.id ? 'border-accent bg-accent-soft' : 'border-line hover:bg-subtle'
              )}>
              
              <input
                type="radio"
                name="team"
                value={t.id}
                checked={selected === t.id}
                disabled={!t.active}
                onChange={() => setSelected(t.id)}
                className="mt-0.5 h-4 w-4 accent-accent" />
              
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
                  {t.name}
                  {t.id === current && <span className="rounded bg-muted px-1.5 text-2xs font-normal text-ink-2">Current</span>}
                  {!t.active && <span className="text-2xs font-normal text-ink-3">Inactive</span>}
                </span>
                <span className="mt-0.5 block text-[12px] text-ink-3">
                  {t.memberIds.length} members · {active} active tickets
                </span>
              </span>
            </label>);

        })}
      </fieldset>
      {losesAssignee.length > 0 && team &&
      <div className="mt-3">
          <InlineAlert tone="warning">
            {losesAssignee.length === 1 ?
          `${getUser(losesAssignee[0].assigneeId)?.name} isn’t on ${team.name}, so the ticket will become unassigned.` :
          `${losesAssignee.length} tickets will become unassigned because their agents aren’t on ${team.name}.`}
          </InlineAlert>
        </div>
      }
      {error && <div className="mt-3"><InlineAlert>{error}</InlineAlert></div>}
    </Dialog>);

}
