'use client';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from '@/lib/router';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Field, describedBy } from '../../components/ui/Field';
import { Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { InlineAlert } from '../../components/ui/States';
import { useAppState } from '../../contexts/AppStateContext';

const DEMO_ACCOUNTS = [
{ email: 'maya@relaydesk.io', role: 'Administrator' },
{ email: 'daniel@relaydesk.io', role: 'Support agent' },
{ email: 'priya.shah@lumenhealth.com', role: 'Customer' }];


export function SignIn() {
  const { signIn, simulateErrors } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as {from?: string;} | null)?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailError = !email.trim() ? 'Enter your work email.' : !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email address.' : undefined;
  const passwordError = password.length < 8 ? 'Password must be at least 8 characters.' : undefined;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    setError(null);
    if (emailError || passwordError) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    setLoading(false);
    if (simulateErrors) return setError('We couldn’t reach Relay. Check your connection and try again.');
    const res = await signIn(email);
    if (!res.ok) return setError(res.error);
    navigate(from && from !== '/signin' ? from : '/overview', { replace: true });
  };

  return (
    <AuthLayout
      title="Sign in to Relay"
      description="Use your work email to access Cadence Support."
      footer={
      <div className="mx-auto max-w-[400px] rounded-lg border border-dashed border-line-strong px-4 py-3 text-left">
          <p className="text-[12px] font-medium text-ink-2">Prototype accounts · any password with 8+ characters</p>
          <ul className="mt-1.5 space-y-1">
            {DEMO_ACCOUNTS.map((a) =>
          <li key={a.email}>
                <button type="button" onClick={() => {setEmail(a.email);setPassword('prototype');}} className="flex w-full justify-between gap-3 rounded text-[12px] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
                  <span className="truncate text-ink-2">{a.email}</span>
                  <span className="shrink-0">{a.role}</span>
                </button>
              </li>
          )}
          </ul>
        </div>
      }>
      
      <form onSubmit={submit} noValidate className="space-y-4">
        {error && <InlineAlert>{error}</InlineAlert>}
        <Field id="email" label="Email" error={attempted ? emailError : undefined}>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={attempted && !!emailError} aria-describedby={describedBy('email', attempted ? emailError : undefined)} />
        </Field>
        <Field id="password" label="Password" error={attempted ? passwordError : undefined}>
          <div className="relative">
            <Input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" aria-invalid={attempted && !!passwordError} aria-describedby={describedBy('password', attempted ? passwordError : undefined)} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-ink-3 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
              {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13px] text-ink-2">
            <Checkbox defaultChecked /> Keep me signed in
          </label>
          <Link to="/forgot-password" className="text-[13px] font-medium text-accent-fg hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>);

}
