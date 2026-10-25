'use client';
import React, { useEffect, useRef, useState } from 'react';
import { LockIcon, PaperclipIcon, SendIcon, ArchiveIcon, GlobeIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button, ButtonLink } from '../ui/Button';
import { InlineAlert } from '../ui/States';
import { UploadList } from './UploadList';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { useAttachmentUploads } from '../../hooks/useAttachmentUploads';
import { allowedTransitions, STATUS_META } from '../../utils/ticketMeta';
import { cn } from '../../utils/cn';
import type { MessageVisibility, Ticket, TicketStatus } from '../../types/ticket';

type AfterSend = 'keep' | 'pending' | 'resolved';

export function ReplyComposer({ ticket }: {ticket: Ticket;}) {
  const user = useCurrentUser();
  const { addMessage, setStatus, getUser, simulateErrors } = useAppState();
  const { requestStatus } = useWorkflow();
  const staff = user.role !== 'requester';
  const [mode, setMode] = useState<MessageVisibility>('public');
  const [body, setBody] = useState('');
  const [after, setAfter] = useState<AfterSend>('keep');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploads = useAttachmentUploads(simulateErrors);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const requester = getUser(ticket.requesterId);

  useEffect(() => {
    setBody('');
    setMode('public');
    setAfter('keep');
    setError(null);
    uploads.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket.id]);

  if (ticket.status === 'closed') {
    return (
      <div className="border-t border-line bg-subtle px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ArchiveIcon className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
          <p className="flex-1 text-[13px] text-ink-2">This ticket is closed and no longer accepts replies.</p>
          {user.role === 'admin' && <Button size="sm" onClick={() => requestStatus([ticket.id], 'open')}>Reopen ticket</Button>}
          {user.role === 'requester' && <ButtonLink to="/tickets/new" size="sm">Create follow-up ticket</ButtonLink>}
        </div>
      </div>);

  }

  const internal = mode === 'internal';
  const transitions = allowedTransitions(ticket.status, user.role);
  const afterOptions = (['pending', 'resolved'] as TicketStatus[]).filter((s) => transitions.includes(s));
  const canSend = body.trim().length > 0 && !uploads.uploading && !sending;

  const send = async () => {
    if (!canSend) return;
    setSending(true);
    setError(null);
    const res = await addMessage(ticket.id, { body: body.trim(), visibility: mode, attachments: uploads.attachments });
    if (!res.ok) {
      setSending(false);
      setError(res.error);
      return;
    }
    if (staff && !internal && after !== 'keep') {
      await setStatus([ticket.id], after, { pendingReason: 'requester' });
    }
    setSending(false);
    setBody('');
    setAfter('keep');
    uploads.reset();
    toast.success(internal ? 'Internal note added' : staff ? `Reply sent to ${requester?.name}` : 'Reply sent', {
      description: staff && !internal && after !== 'keep' ? `Status changed to ${STATUS_META[after].label}.` : undefined
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="border-t border-line bg-surface px-3 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto max-w-3xl space-y-2">
        <div
          className={cn(
            'rounded-lg border transition-[border-color,box-shadow,background-color] duration-150',
            internal ? 'border-warning/50 bg-warning-soft focus-within:ring-[3px] focus-within:ring-warning/15' : 'border-line-strong bg-surface focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/15'
          )}>
          
          {staff &&
          <div className="flex items-center gap-1 px-2 pt-2" role="tablist" aria-label="Message type">
              {(['public', 'internal'] as MessageVisibility[]).map((m) =>
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                textRef.current?.focus();
              }}
              className={cn(
                'inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
                mode === m ? m === 'internal' ? 'bg-warning/15 text-warning-fg' : 'bg-muted text-ink' : 'text-ink-3 hover:text-ink'
              )}>
              
                  {m === 'internal' ? <LockIcon className="h-3.5 w-3.5" aria-hidden /> : <GlobeIcon className="h-3.5 w-3.5" aria-hidden />}
                  {m === 'internal' ? 'Internal note' : 'Public reply'}
                </button>
            )}
              <span className={cn('ml-auto hidden text-[12px] sm:block', internal ? 'text-warning-fg' : 'text-ink-3')}>
                {internal ? 'Only visible to staff' : `Visible to ${requester?.name}`}
              </span>
            </div>
          }
          <label htmlFor="reply-body" className="sr-only">
            {internal ? 'Internal note' : 'Reply'}
          </label>
          <textarea
            id="reply-body"
            ref={textRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={onKeyDown}
            rows={3}
            disabled={sending}
            placeholder={internal ? 'Add a private note for your team…' : staff ? `Reply to ${requester?.name}…` : ticket.status === 'resolved' ? 'Replying will reopen this ticket…' : 'Write a reply…'}
            className="block max-h-60 min-h-[76px] w-full resize-y bg-transparent px-3 py-2.5 text-[14px] leading-6 text-ink placeholder:text-ink-3 focus:outline-none disabled:opacity-60" />
          
          {uploads.items.length > 0 &&
          <div className="px-3 pb-2">
              <UploadList items={uploads.items} onRetry={uploads.retry} onRemove={uploads.remove} />
            </div>
          }
          <div className="flex flex-wrap items-center gap-2 px-2 pb-2">
            <input
              ref={fileRef}
              type="file"
              multiple
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(e) => {
                if (e.target.files) uploads.add(e.target.files);
                e.target.value = '';
              }} />
            
            <Button size="icon-sm" variant="ghost" onClick={() => fileRef.current?.click()} aria-label="Attach files (max 10 MB each)" title="Attach files (max 10 MB each)">
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <span className="hidden text-2xs text-ink-3 md:inline">Ctrl ↵ to send</span>
            <div className="ml-auto flex items-center gap-2">
              {staff && !internal && afterOptions.length > 0 &&
              <select
                aria-label="Status after sending"
                value={after}
                onChange={(e) => setAfter(e.target.value as AfterSend)}
                className="h-8 rounded-md border border-line-strong bg-surface pl-2 pr-7 text-[12px] text-ink-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20">
                
                  <option value="keep">Keep as {STATUS_META[ticket.status].label}</option>
                  {afterOptions.map((s) =>
                <option key={s} value={s}>
                      Then set {STATUS_META[s].label}
                    </option>
                )}
                </select>
              }
              <Button
                size="sm"
                variant={internal ? 'secondary' : 'primary'}
                onClick={send}
                disabled={!canSend}
                loading={sending}
                leadingIcon={!sending ? internal ? <LockIcon className="h-3.5 w-3.5" /> : <SendIcon className="h-3.5 w-3.5" /> : undefined}>
                
                {sending ? 'Sending…' : internal ? 'Add note' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
        {uploads.uploading && <p className="text-[12px] text-ink-3">Sending is available once uploads finish.</p>}
        {error &&
        <InlineAlert
          action={
          <button type="button" onClick={send} className="shrink-0 text-[13px] font-semibold underline underline-offset-2">
                Retry
              </button>
          }>
          
            Your {internal ? 'note' : 'reply'} wasn’t sent — {error} Your draft has been kept.
          </InlineAlert>
        }
      </div>
    </div>);

}
