'use client';
import React from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  helper?: React.ReactNode;
  error?: string;
  counter?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Label + control + helper/error. Controls should set aria-describedby={describedBy(id, …)}. */
export function Field({ id, label, required, optional, helper, error, counter, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-ink">
          {label}
          {required &&
          <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          }
          {required && <span className="sr-only"> (required)</span>}
          {optional && <span className="ml-1.5 font-normal text-ink-3">Optional</span>}
        </label>
        {counter && <span className="text-2xs tabular-nums text-ink-3">{counter}</span>}
      </div>
      {children}
      {error ?
      <p id={`${id}-error`} className="flex items-center gap-1.5 text-[12px] text-danger-fg">
          <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p> :
      helper ?
      <p id={`${id}-help`} className="text-[12px] leading-5 text-ink-3">
          {helper}
        </p> :
      null}
    </div>);

}

export function describedBy(id: string, error?: string, helper?: unknown): string | undefined {
  if (error) return `${id}-error`;
  if (helper) return `${id}-help`;
  return undefined;
}
