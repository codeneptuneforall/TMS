'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Field, describedBy } from '../ui/Field';
import { Input, Select } from '../ui/FormControls';
import { InlineAlert } from '../ui/States';
import { useAppState } from '../../contexts/AppStateContext';
import type { Ticket } from '../../types/ticket';

export function EditTicketDialog({ ticket, open, onClose }: {ticket: Ticket;open: boolean;onClose: () => void;}) {
  const { categories, updateTicket } = useAppState();
  const [subject, setSubject] = useState(ticket.subject);
  const [categoryId, setCategoryId] = useState(ticket.categoryId);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSubject(ticket.subject);
      setCategoryId(ticket.categoryId);
      setTouched(false);
      setError(null);
    }
  }, [open, ticket]);

  const subjectError = subject.trim().length < 8 ? 'Subject must be at least 8 characters.' : undefined;
  const dirty = subject.trim() !== ticket.subject || categoryId !== ticket.categoryId;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (subjectError) return;
    setSaving(true);
    const res = await updateTicket(ticket.id, { subject: subject.trim(), categoryId });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    toast.success('Ticket updated');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Edit ticket"
      description={<span className="ticket-id">{ticket.id}</span>}
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="edit-ticket" loading={saving} disabled={!dirty}>
            Save changes
          </Button>
        </>
      }>
      
      <form id="edit-ticket" onSubmit={submit} className="space-y-4" noValidate>
        <Field id="edit-subject" label="Subject" required error={touched ? subjectError : undefined} counter={`${subject.length}/150`}>
          <Input id="edit-subject" value={subject} maxLength={150} onChange={(e) => setSubject(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={touched && !!subjectError} aria-describedby={describedBy('edit-subject', touched ? subjectError : undefined)} />
        </Field>
        <Field id="edit-category" label="Category" required>
          <Select id="edit-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.filter((c) => c.active || c.id === ticket.categoryId).map((c) =>
            <option key={c.id} value={c.id}>{c.name}</option>
            )}
          </Select>
        </Field>
        {error && <InlineAlert>{error}</InlineAlert>}
      </form>
    </Dialog>);

}
