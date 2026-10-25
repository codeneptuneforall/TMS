'use client';
import React, { forwardRef } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const controlClass =
'w-full rounded-md border border-line-strong bg-surface text-sm text-ink placeholder:text-ink-3 shadow-card ' +
'transition-[border-color,box-shadow] duration-150 ease-out focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15 ' +
'disabled:cursor-not-allowed disabled:bg-muted disabled:text-ink-3 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
{ className, ...rest },
ref)
{
  return <input ref={ref} className={cn(controlClass, 'h-9 px-3', className)} {...rest} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
{ className, ...rest },
ref)
{
  return <textarea ref={ref} className={cn(controlClass, 'min-h-[96px] px-3 py-2 leading-6', className)} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select(
{ className, children, ...rest },
ref)
{
  return (
    <div className="relative">
      <select ref={ref} className={cn(controlClass, 'h-9 appearance-none pl-3 pr-9', className)} {...rest}>
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
    </div>);

});
