'use client';
import React, { useState } from 'react';
import { Link, useSearchParams } from '@/lib/router';
import { CheckIcon, LinkIcon } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordRequirements, passwordValid } from '../../components/auth/PasswordRequirements';
import { Field, describedBy } from '../../components/ui/Field';
import { Input } from '../../components/ui/FormControls';
import { Button, ButtonLink } from '../../components/ui/Button';

export function ResetPassword() {
  const [params] = useSearchParams();
  const expired = params.get('state') === 'expired';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const pwError = !passwordValid(password) ? 'Password doesn’t meet the requirements below.' : undefined;
  const confirmError = confirm !== password ? 'Passwords don’t match.' : undefined;

  if (expired) {
    return (
      <AuthLayout title="This link has expired" description="Reset links are valid for 30 minutes and can only be used once.">
        <div className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-soft text-warning-fg"><LinkIcon className="h-5 w-5" aria-hidden /></div>
          <ButtonLink to="/forgot-password" variant="primary" className="w-full">Request a new link</ButtonLink>
        </div>
      </AuthLayout>);

  }

  if (done) {
    return (
      <AuthLayout title="Password updated" description="You’ve been signed out of other devices for security.">
        <div className="space-y-4" role="status">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-soft text-success-fg"><CheckIcon className="h-5 w-5" aria-hidden /></div>
          <ButtonLink to="/signin" variant="primary" className="w-full">Continue to sign in</ButtonLink>
        </div>
      </AuthLayout>);

  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (pwError || confirmError) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setDone(true);
  };

  return (
    <AuthLayout title="Choose a new password" description="Make it unique — you’ll use it to sign in to Relay." footer={<Link to="/reset-password?state=expired" className="hover:text-ink">Preview expired-link state</Link>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field id="rp-password" label="New password" error={attempted ? pwError : undefined}>
          <Input id="rp-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={attempted && !!pwError} aria-describedby={`${describedBy('rp-password', attempted ? pwError : undefined) ?? ''} rp-rules`.trim()} />
        </Field>
        <PasswordRequirements password={password} id="rp-rules" />
        <Field id="rp-confirm" label="Confirm password" error={attempted ? confirmError : undefined}>
          <Input id="rp-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-invalid={attempted && !!confirmError} aria-describedby={describedBy('rp-confirm', attempted ? confirmError : undefined)} />
        </Field>
        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Update password</Button>
      </form>
    </AuthLayout>);

}
