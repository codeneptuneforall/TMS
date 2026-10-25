'use client';
import React, { useState } from 'react';
import { Link } from '@/lib/router';
import { MailCheckIcon } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Field, describedBy } from '../../components/ui/Field';
import { Input } from '../../components/ui/FormControls';
import { Button, ButtonLink } from '../../components/ui/Button';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const error = !/^\S+@\S+\.\S+$/.test(email) ? 'Enter the email address on your account.' : undefined;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (error) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout title="Check your inbox" footer={<Link to="/signin" className="font-medium text-ink-2 hover:text-ink">Back to sign in</Link>}>
        <div className="-mt-2 space-y-4" role="status">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent-fg">
            <MailCheckIcon className="h-5 w-5" aria-hidden />
          </div>
          <p className="text-[14px] leading-6 text-ink-2">
            If an account exists for <span className="font-medium text-ink">{email}</span>, you’ll receive a reset link within a few minutes. The link expires in 30 minutes.
          </p>
          <div className="flex flex-col gap-2">
            <ButtonLink to="/reset-password" variant="primary" className="w-full">Open reset link (prototype)</ButtonLink>
            <Button variant="ghost" onClick={() => setSent(false)} className="w-full">Use a different email</Button>
          </div>
        </div>
      </AuthLayout>);

  }

  return (
    <AuthLayout title="Reset your password" description="Enter your work email and we’ll send you a link to choose a new password." footer={<Link to="/signin" className="font-medium text-ink-2 hover:text-ink">Back to sign in</Link>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field id="fp-email" label="Email" error={attempted ? error : undefined}>
          <Input id="fp-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={attempted && !!error} aria-describedby={describedBy('fp-email', attempted ? error : undefined)} />
        </Field>
        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Send reset link</Button>
      </form>
    </AuthLayout>);

}
