'use client';
import React from 'react';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const passwordRules = [
{ id: 'len', label: 'At least 12 characters', test: (p: string) => p.length >= 12 },
{ id: 'case', label: 'Upper and lowercase letters', test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
{ id: 'num', label: 'At least one number', test: (p: string) => /\d/.test(p) }];


export const passwordValid = (p: string) => passwordRules.every((r) => r.test(p));

export function PasswordRequirements({ password, id }: {password: string;id: string;}) {
  return (
    <ul id={id} className="space-y-1" aria-label="Password requirements">
      {passwordRules.map((r) => {
        const ok = r.test(password);
        return (
          <li key={r.id} className={cn('flex items-center gap-2 text-[12px]', ok ? 'text-success-fg' : 'text-ink-3')}>
            {ok ? <CheckIcon className="h-3.5 w-3.5" aria-hidden /> : <MinusIcon className="h-3.5 w-3.5" aria-hidden />}
            {r.label}
            <span className="sr-only">{ok ? ' — met' : ' — not met'}</span>
          </li>);

      })}
    </ul>);

}
