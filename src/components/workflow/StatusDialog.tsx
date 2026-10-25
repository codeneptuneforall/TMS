'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { Select, Textarea } from '../ui/FormControls';
import { InlineAlert } from '../ui/States';
import { StatusBadge } from '../tickets/StatusBadge';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { allowedTransitions, isReopen, PENDING_REASON_LABEL, STATUS_META, STATUS_ORDER } from '../../utils/ticketMeta';
import { cn } from '../../utils/cn';
import type { PendingReason, TicketStatus } from '../../types/ticket';

interface StatusDialogProps {
  open: boolean;
  ticketIds: string[];
  target: TicketStatus | null;
  onClose: () => void;
}

export function StatusDialog({ open, ticketIds, target, onClose }: StatusDialogProps) {
  const { tickets, setStatus, getUser } = useAppState();
  const me = useCurrentUser();
  const [status, setStatusValue] = useState<TicketStatus | ''>(target ?? '');
  const [note, setNote] = useState('');
  const [reason, setReason] = useState<PendingReason>('requester');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStatusValue(target ?? '');
      setNote('');
      setReason('requester');
      setError(null);
    }
  }, [open, target]);

  const targets = tickets.filter((t) => ticketIds.includes(t.id));
  const single = targets.length === 1 ? targets[0] : null;
  const valid = status ? targets.filter((t) => allowedTransitions(t.status, me.role).includes(status)) : [];
  const skipped = targets.length - valid.length;
  const reopening = !!status && !!single && isReopen(single.status, status);
  const requester = single ? getUser(single.requesterId) : undefined;
  const isRequester = me.role === 'requester';

  const copy = (() => {
    if (!status) return { title: `Update status for ${targets.length} tickets`, body: '', cta: 'Update status', danger: false };
    if (reopening) return { title: 'Reopen this ticket?', body: isRequester ? 'Our team will be notified and the ticket returns to the support queue.' : 'The ticket returns to Open and reappears in the team queue. The assignee is kept.', cta: 'Reopen ticket', danger: false };
    if (status === 'resolved')
    return {
      title: single ? isRequester ? 'Mark this request as resolved?' : 'Resolve this ticket?' : `Resolve ${valid.length} tickets?`,
      body: isRequester ?
      'Let us know the problem is fixed. You can reopen it within 7 days if it comes back.' :
      `${single ? requester?.name ?? 'The requester' : 'Each requester'} will be notified and can reopen within 7 days. Resolved tickets close automatically after that.`,
      cta: isRequester ? 'Mark as resolved' : 'Resolve',
      danger: false
    };
    if (status === 'closed')
    return {
      title: single ? 'Close this ticket?' : `Close ${valid.length} tickets?`,
      body: 'Closed tickets become read-only. No further replies are accepted, and the requester must open a new ticket for follow-up questions.',
      cta: 'Close ticket',
      danger: true
    };
    if (status === 'pending')
    return { title: single ? 'Set ticket to Pending' : `Set ${valid.length} tickets to Pending`, body: 'Pending pauses the SLA clock. Say who you are waiting on so teammates know the next step.', cta: 'Set to Pending', danger: false };
    return { title: `Move to ${STATUS_META[status].label}`, body: STATUS_META[status].description, cta: 'Update status', danger: false };
  })();

  const submit = async () => {
    if (!status || valid.length === 0) return;
    setSaving(true);
    setError(null);
    const res = await setStatus(valid.map((t) => t.id), status, { note: single ? note : undefined, pendingReason: reason });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    toast.success(
      valid.length > 1 ? `${valid.length} tickets moved to ${STATUS_META[status].label}` : reopening ? `${valid[0].id} reopened` : `${valid[0].id} is now ${STATUS_META[status].label}`
    );
    onClose();
  };

  const showNote = single && (status === 'resolved' || reopening) && !isRequester;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      role={copy.danger ? 'alertdialog' : 'dialog'}
      size="sm"
      title={copy.title}
      description={copy.body || undefined}
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant={copy.danger ? 'danger' : 'primary'} onClick={submit} loading={saving} disabled={!status || valid.length === 0}>
            {copy.cta}
          </Button>
        </>
      }>
      
      <div className="space-y-4">
        {single && status &&
        <div className="flex items-center gap-2 rounded-md bg-subtle px-3 py-2 text-[13px]">
            <span className="ticket-id text-ink-2">{single.id}</span>
            <span className="ml-auto flex items-center gap-2">
              <StatusBadge status={single.status} />
              <span aria-hidden className="text-ink-3">→</span>
              <span className="sr-only">to</span>
              <StatusBadge status={status} />
            </span>
          </div>
        }

        {!target &&
        <Field id="bulk-status" label="New status" required>
            <Select id="bulk-status" value={status} onChange={(e) => setStatusValue(e.target.value as TicketStatus)}>
              <option value="" disabled>
                Choose a status
              </option>
              {STATUS_ORDER.map((s) =>
            <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
            )}
            </Select>
          </Field>
        }

        {status === 'pending' &&
        <fieldset>
            <legend className="mb-1.5 text-[13px] font-medium text-ink">Waiting on</legend>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PENDING_REASON_LABEL) as PendingReason[]).map((r) =>
            <label key={r} className={cn('flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-[13px]', reason === r ? 'border-accent bg-accent-soft text-ink' : 'border-line text-ink-2 hover:bg-subtle')}>
                  <input type="radio" name="pending-reason" checked={reason === r} onChange={() => setReason(r)} className="h-4 w-4 accent-accent" />
                  {r === 'requester' ? 'Requester' : 'Third party'}
                </label>
            )}
            </div>
          </fieldset>
        }

        {showNote &&
        <Field id="status-note" label={reopening ? 'Reason for reopening' : 'Resolution message'} optional helper={reopening ? 'Posted as a public reply.' : `Sent to ${requester?.name} as a public reply.`}>
            <Textarea id="status-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="min-h-[80px]" placeholder={reopening ? 'What still needs attention?' : 'Summarize the fix for the requester'} />
          </Field>
        }

        {status && skipped > 0 &&
        <InlineAlert tone="warning">
            {skipped} of {targets.length} tickets can’t move to {STATUS_META[status].label} from their current status and will be skipped.
          </InlineAlert>
        }
        {error && <InlineAlert>{error}</InlineAlert>}
      </div>
    </Dialog>);

}
