'use client';
import React, { useState } from 'react';
import { CheckIcon, MailIcon } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordRequirements, passwordValid } from '../../components/auth/PasswordRequirements';
import { Field, describedBy } from '../../components/ui/Field';
import { Input } from '../../components/ui/FormControls';
import { Button, ButtonLink } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

type Step = 'form' | 'verify' | 'active';

export function AcceptInvite() {
  const [name, setName] = useState('Grace Kim');
  const [password, setPassword] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('form');

  const nameError = name.trim().length < 2 ? 'Enter your full name.' : undefined;
  const pwError = !passwordValid(password) ? 'Password doesn’t meet the requirements below.' : undefined;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (nameError || pwError) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setStep('verify');
  };

  if (step === 'verify') {
    return (
      <AuthLayout title="Verify your email" description={<>We sent a 6-digit code to <span className="font-medium text-ink">grace@relaydesk.io</span>.</>}>
        <form onSubmit={(e) => {e.preventDefault();setStep('active');}} className="space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent-fg"><MailIcon className="h-5 w-5" aria-hidden /></div>
          <Field id="code" label="Verification code" helper="For this prototype, any 6 digits work.">
            <Input id="code" inputMode="numeric" maxLength={6} defaultValue="482913" className="ticket-id tracking-[0.4em]" aria-describedby="code-help" />
          </Field>
          <Button type="submit" variant="primary" size="lg" className="w-full">Verify and activate</Button>
        </form>
      </AuthLayout>);

  }

  if (step === 'active') {
    return (
      <AuthLayout title="Your account is active" description="Welcome to Cadence Support. An administrator has added you to Customer Onboarding.">
        <div className="space-y-4" role="status">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-soft text-success-fg"><CheckIcon className="h-5 w-5" aria-hidden /></div>
          <ButtonLink to="/signin" variant="primary" className="w-full">Continue to sign in</ButtonLink>
        </div>
      </AuthLayout>);

  }

  return (
    <AuthLayout title="Join Cadence Support" description="Set up your account to start working on tickets.">
      <div className="mb-5 flex items-center gap-3 rounded-md bg-subtle px-3 py-2.5">
        <Avatar name="Maya Okafor" id="u-maya" size="md" />
        <p className="text-[13px] leading-5 text-ink-2">
          <span className="font-medium text-ink">Maya Okafor</span> invited you as a <span className="font-medium text-ink">Support agent</span> on Customer Onboarding.
        </p>
      </div>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field id="inv-email" label="Email">
          <Input id="inv-email" value="grace@relaydesk.io" disabled readOnly />
        </Field>
        <Field id="inv-name" label="Full name" error={attempted ? nameError : undefined}>
          <Input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={attempted && !!nameError} aria-describedby={describedBy('inv-name', attempted ? nameError : undefined)} />
        </Field>
        <Field id="inv-password" label="Create password" error={attempted ? pwError : undefined}>
          <Input id="inv-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={attempted && !!pwError} aria-describedby="inv-rules" />
        </Field>
        <PasswordRequirements password={password} id="inv-rules" />
        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Accept invitation</Button>
        <p className="text-center text-[12px] text-ink-3">This invitation expires on Oct 28, 2026.</p>
      </form>
    </AuthLayout>);

}
