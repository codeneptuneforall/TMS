'use client';
import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from '@/lib/router';
import { CheckIcon, PaperclipIcon, UploadCloudIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PageContainer, PageHeader } from '../components/ui/PageHeader';
import { Field, describedBy } from '../components/ui/Field';
import { Input, Select, Textarea } from '../components/ui/FormControls';
import { Button, ButtonLink } from '../components/ui/Button';
import { InlineAlert } from '../components/ui/States';
import { Avatar } from '../components/ui/Avatar';
import { UploadList } from '../components/tickets/UploadList';
import { PriorityGlyph } from '../components/tickets/PriorityIndicator';
import { useAppState, useCurrentUser } from '../contexts/AppStateContext';
import { useAttachmentUploads } from '../hooks/useAttachmentUploads';
import { slaPolicies } from '../data/categories';
import { PRIORITY_META, PRIORITY_ORDER } from '../utils/ticketMeta';
import { formatHours } from '../utils/time';
import { cn } from '../utils/cn';
import type { Ticket, TicketPriority } from '../types/ticket';

type FieldKey = 'requesterId' | 'subject' | 'description' | 'categoryId';

export function CreateTicket() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const { users, categories, teams, createTicket, simulateErrors, getTeam, getUser, getCategory } = useAppState();
  const staff = user.role !== 'requester';

  const [requesterId, setRequesterId] = useState(staff ? '' : user.id);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [teamId, setTeamId] = useState('');
  const [teamTouched, setTeamTouched] = useState(false);
  const [assigneeId, setAssigneeId] = useState('');
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [created, setCreated] = useState<Ticket | null>(null);
  const uploads = useAttachmentUploads(simulateErrors);
  const fileRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const requesters = users.filter((u) => u.role === 'requester' && u.status === 'active');
  const team = getTeam(teamId);
  const teamMembers = team ? team.memberIds.map((id) => getUser(id)).filter((u) => u && u.status === 'active') : [];
  const sla = slaPolicies.find((p) => p.priority === priority);

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!requesterId) e.requesterId = 'Choose who this ticket is for.';
    if (subject.trim().length < 8) e.subject = subject.trim() ? 'Use at least 8 characters so the team can triage quickly.' : 'Add a short subject.';
    if (description.trim().length < 20) e.description = description.trim() ? 'Add a bit more detail — at least 20 characters.' : 'Describe the problem or request.';
    if (!categoryId) e.categoryId = 'Choose a category.';
    return e;
  }, [requesterId, subject, description, categoryId]);

  const show = (k: FieldKey) => attempted || touched[k] ? errors[k] : undefined;
  const blur = (k: FieldKey) => () => setTouched((t) => ({ ...t, [k]: true }));

  const onCategory = (id: string) => {
    setCategoryId(id);
    if (!teamTouched) {
      setTeamId(getCategory(id)?.defaultTeamId ?? '');
      setAssigneeId('');
    }
  };

  const reset = () => {
    setRequesterId(staff ? '' : user.id);
    setSubject('');
    setDescription('');
    setCategoryId('');
    setPriority('medium');
    setTeamId('');
    setTeamTouched(false);
    setAssigneeId('');
    setTouched({});
    setAttempted(false);
    setSubmitError(null);
    setCreated(null);
    uploads.reset();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    setSubmitError(null);
    if (Object.keys(errors).length > 0) {
      window.setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }
    setSubmitting(true);
    const res = await createTicket({
      subject,
      description,
      requesterId,
      categoryId,
      priority,
      teamId: teamId || getCategory(categoryId)?.defaultTeamId || null,
      assigneeId: staff && assigneeId ? assigneeId : null,
      attachments: uploads.attachments
    });
    setSubmitting(false);
    if (!res.ok) {
      setSubmitError(res.error);
      return;
    }
    setCreated(res.data);
    toast.success(`${res.data.id} created`);
  };

  if (created) {
    return (
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto mt-6 max-w-lg rounded-xl border border-line bg-surface p-6 text-center shadow-card sm:p-8"
          role="status">
          
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-success-soft text-success-fg">
            <CheckIcon className="h-5 w-5" aria-hidden />
          </div>
          <h1 className="text-lg font-semibold text-ink">Ticket created</h1>
          <p className="mt-1 text-[14px] text-ink-2">
            <span className="ticket-id text-ink">{created.id}</span> · {created.subject}
          </p>
          <p className="mt-3 text-[13px] leading-5 text-ink-3">
            {staff ?
            `Routed to ${getTeam(created.teamId)?.name ?? 'the triage queue'}${created.assigneeId ? ` and assigned to ${getUser(created.assigneeId)?.name}` : ' and waiting for an owner'}.` :
            'We’ve emailed you a confirmation. You’ll be notified when an agent replies.'}
          </p>
          <div className="mt-6 flex flex-col-reverse justify-center gap-2 sm:flex-row">
            <Button onClick={reset}>Create another</Button>
            <Button variant="primary" onClick={() => navigate(`/tickets/${created.id}`)}>View ticket</Button>
          </div>
        </motion.div>
      </PageContainer>);

  }

  const errorList = Object.entries(errors) as [FieldKey, string][];
  const ids: Record<FieldKey, string> = { requesterId: 'ct-requester', subject: 'ct-subject', description: 'ct-description', categoryId: 'ct-category' };

  return (
    <PageContainer>
      <PageHeader
        title="New ticket"
        breadcrumbs={[{ label: staff ? 'Tickets' : 'My Tickets', to: staff ? '/queue/all' : '/queue/mine' }, { label: 'New ticket' }]}
        description={staff ? 'Log a request on behalf of a customer.' : 'Tell us what’s going on and we’ll route it to the right team.'} />
      

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <form onSubmit={submit} noValidate className="rounded-xl border border-line bg-surface shadow-card">
          <div className="space-y-5 p-5 sm:p-6">
            {attempted && errorList.length > 0 &&
            <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-md border border-danger/25 bg-danger-soft px-4 py-3 outline-none">
                <p className="text-[13px] font-semibold text-danger-fg">Please fix {errorList.length} {errorList.length === 1 ? 'field' : 'fields'} before submitting</p>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[13px] text-danger-fg">
                  {errorList.map(([k, msg]) =>
                <li key={k}>
                      <a href={`#${ids[k]}`} onClick={(e) => {e.preventDefault();document.getElementById(ids[k])?.focus();}} className="underline underline-offset-2">{msg}</a>
                    </li>
                )}
                </ul>
              </div>
            }

            {staff ?
            <Field id="ct-requester" label="Requester" required error={show('requesterId')}>
                <Select id="ct-requester" value={requesterId} onChange={(e) => setRequesterId(e.target.value)} onBlur={blur('requesterId')} aria-invalid={!!show('requesterId')} aria-describedby={describedBy('ct-requester', show('requesterId'))}>
                  <option value="">Select a customer</option>
                  {requesters.map((r) =>
                <option key={r.id} value={r.id}>{r.name} — {r.organization}</option>
                )}
                </Select>
              </Field> :

            <div className="flex items-center gap-3 rounded-md bg-subtle px-3 py-2.5">
                <Avatar name={user.name} id={user.id} size="md" />
                <div className="min-w-0 text-[13px]">
                  <p className="font-medium text-ink">Submitting as {user.name}</p>
                  <p className="truncate text-ink-3">{user.email} · {user.organization}</p>
                </div>
              </div>
            }

            <Field id="ct-subject" label="Subject" required error={show('subject')} counter={`${subject.length}/150`} helper="A one-line summary, e.g. “Calendar sync stopped for Google users”.">
              <Input id="ct-subject" value={subject} maxLength={150} onChange={(e) => setSubject(e.target.value)} onBlur={blur('subject')} aria-invalid={!!show('subject')} aria-describedby={describedBy('ct-subject', show('subject'), true)} />
            </Field>

            <Field id="ct-description" label="Description" required error={show('description')} helper="Include what you expected, what happened instead, and how many people are affected.">
              <Textarea id="ct-description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} onBlur={blur('description')} aria-invalid={!!show('description')} aria-describedby={describedBy('ct-description', show('description'), true)} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="ct-category" label="Category" required error={show('categoryId')}>
                <Select id="ct-category" value={categoryId} onChange={(e) => onCategory(e.target.value)} onBlur={blur('categoryId')} aria-invalid={!!show('categoryId')} aria-describedby={describedBy('ct-category', show('categoryId'))}>
                  <option value="">Select a category</option>
                  {categories.filter((c) => c.active).map((c) =>
                  <option key={c.id} value={c.id}>{c.name}</option>
                  )}
                </Select>
              </Field>

              <fieldset className="space-y-1.5">
                <legend className="text-[13px] font-medium text-ink">Priority</legend>
                <div className="grid grid-cols-4 gap-1 rounded-md border border-line-strong bg-subtle p-0.5">
                  {[...PRIORITY_ORDER].reverse().map((p) =>
                  <label key={p} className={cn('flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded text-[12px] font-medium transition-colors duration-150 focus-within:ring-2 focus-within:ring-accent/50', priority === p ? 'bg-surface text-ink shadow-card ring-1 ring-line' : 'text-ink-3 hover:text-ink')}>
                      <input type="radio" name="priority" value={p} checked={priority === p} onChange={() => setPriority(p)} className="sr-only" />
                      <PriorityGlyph priority={p} />
                      {PRIORITY_META[p].label}
                    </label>
                  )}
                </div>
                <p className="text-[12px] text-ink-3">{PRIORITY_META[priority].description}{!staff && ' Our team may adjust this after review.'}</p>
              </fieldset>
            </div>

            {staff &&
            <div className="grid gap-5 sm:grid-cols-2">
                <Field id="ct-team" label="Team" optional helper={!teamTouched && categoryId ? 'Set automatically from the category.' : undefined}>
                  <Select id="ct-team" value={teamId} onChange={(e) => {setTeamId(e.target.value);setTeamTouched(true);setAssigneeId('');}}>
                    <option value="">Route by category</option>
                    {teams.filter((t) => t.active).map((t) =>
                  <option key={t.id} value={t.id}>{t.name}</option>
                  )}
                  </Select>
                </Field>
                <Field id="ct-assignee" label="Assignee" optional helper={!team ? 'Choose a team first.' : undefined}>
                  <Select id="ct-assignee" value={assigneeId} disabled={!team} onChange={(e) => setAssigneeId(e.target.value)}>
                    <option value="">Leave unassigned</option>
                    {teamMembers.map((m) => m &&
                  <option key={m.id} value={m.id}>{m.id === user.id ? `${m.name} (you)` : m.name}</option>
                  )}
                  </Select>
                </Field>
              </div>
            }

            <div className="space-y-1.5">
              <span className="text-[13px] font-medium text-ink">Attachments <span className="ml-1 font-normal text-ink-3">Optional</span></span>
              <div
                onDragOver={(e) => {e.preventDefault();setDragging(true);}}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {e.preventDefault();setDragging(false);uploads.add(e.dataTransfer.files);}}
                className={cn('flex flex-col items-center justify-center rounded-md border border-dashed px-4 py-5 text-center transition-colors duration-150', dragging ? 'border-accent bg-accent-soft' : 'border-line-strong bg-subtle')}>
                
                <UploadCloudIcon className="mb-1.5 h-5 w-5 text-ink-3" aria-hidden />
                <p className="text-[13px] text-ink-2">
                  Drag files here or{' '}
                  <button type="button" onClick={() => fileRef.current?.click()} className="font-medium text-accent-fg underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">browse</button>
                </p>
                <p className="mt-0.5 text-[12px] text-ink-3">Screenshots, logs, or documents · up to 10 MB each</p>
                <input ref={fileRef} type="file" multiple className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => {if (e.target.files) uploads.add(e.target.files);e.target.value = '';}} />
              </div>
              <UploadList items={uploads.items} onRetry={uploads.retry} onRemove={uploads.remove} />
            </div>

            {submitError && <InlineAlert>We couldn’t create the ticket — {submitError} Everything you entered is still here.</InlineAlert>}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-line bg-subtle px-5 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <span className="mr-auto hidden items-center gap-1.5 text-[12px] text-ink-3 sm:flex">
              <PaperclipIcon className="h-3.5 w-3.5" aria-hidden /> {uploads.attachments.length} attached
            </span>
            <ButtonLink to={staff ? '/queue/all' : '/overview'}>Cancel</ButtonLink>
            <Button type="submit" variant="primary" loading={submitting} disabled={uploads.uploading}>
              {submitting ? 'Creating…' : 'Create ticket'}
            </Button>
          </div>
        </form>

        <aside className="space-y-6 lg:pt-1">
          {staff ?
          <section aria-labelledby="routing-heading">
              <h2 id="routing-heading" className="text-[13px] font-semibold text-ink">Routing preview</h2>
              <dl className="mt-3 divide-y divide-line border-y border-line text-[13px]">
                <div className="flex justify-between gap-3 py-2.5"><dt className="text-ink-3">Requester</dt><dd className="truncate text-ink">{getUser(requesterId)?.name ?? '—'}</dd></div>
                <div className="flex justify-between gap-3 py-2.5"><dt className="text-ink-3">Team</dt><dd className="truncate text-ink">{team?.name ?? (categoryId ? getTeam(getCategory(categoryId)?.defaultTeamId)?.name : '—')}</dd></div>
                <div className="flex justify-between gap-3 py-2.5"><dt className="text-ink-3">Owner</dt><dd className="truncate text-ink">{getUser(assigneeId)?.name ?? 'Unassigned'}</dd></div>
                <div className="flex justify-between gap-3 py-2.5"><dt className="text-ink-3">Initial status</dt><dd className="text-ink">Open</dd></div>
                <div className="flex justify-between gap-3 py-2.5"><dt className="text-ink-3">Resolution target</dt><dd className="tabular-nums text-ink">{sla ? formatHours(sla.resolutionHours) : '—'}</dd></div>
              </dl>
              <p className="mt-2 text-[12px] leading-5 text-ink-3">Targets come from the draft SLA policy in Settings → Priorities.</p>
            </section> :

          <section aria-labelledby="next-heading">
              <h2 id="next-heading" className="text-[13px] font-semibold text-ink">What happens next</h2>
              <ol className="mt-3 space-y-4">
                {[
              ['We route your ticket', 'Based on the category, it goes to the right support team.'],
              ['An agent picks it up', sla ? `For ${PRIORITY_META[priority].label.toLowerCase()} priority, expect a first reply within ${formatHours(sla.firstResponseHours)}.` : ''],
              ['You’ll get updates by email', 'Reply from the ticket page or directly from the email.']].
              map(([title, body], i) =>
              <li key={title} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-[12px] font-semibold tabular-nums text-ink-2">{i + 1}</span>
                    <div>
                      <p className="text-[13px] font-medium text-ink">{title}</p>
                      <p className="mt-0.5 text-[12px] leading-5 text-ink-3">{body}</p>
                    </div>
                  </li>
              )}
              </ol>
            </section>
          }
        </aside>
      </div>
    </PageContainer>);

}
