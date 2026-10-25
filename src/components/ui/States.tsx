'use client';
import React from 'react';
import { AlertTriangleIcon, RotateCwIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({ icon, title, description, action, className, compact }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', compact ? 'px-4 py-8' : 'px-6 py-16', className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-ink-3 shadow-card [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-[13px] leading-5 text-ink-3">{description}</p>}
      {action && <div className="mt-4 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>);

}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this content. Check your connection and try again.",
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div role="alert" className={cn('flex flex-col items-center px-6 py-16 text-center', className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-danger-soft text-danger-fg">
        <AlertTriangleIcon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-[13px] leading-5 text-ink-3">{description}</p>
      {onRetry &&
      <Button className="mt-4" size="sm" onClick={onRetry} leadingIcon={<RotateCwIcon className="h-3.5 w-3.5" />}>
          Try again
        </Button>
      }
    </div>);

}

export function Skeleton({ className }: {className?: string;}) {
  return <div className={cn('animate-pulse rounded bg-muted', className)} aria-hidden />;
}

export function InlineAlert({ tone = 'danger', children, action }: {tone?: 'danger' | 'warning' | 'info';children: React.ReactNode;action?: React.ReactNode;}) {
  const tones = {
    danger: 'border-danger/25 bg-danger-soft text-danger-fg',
    warning: 'border-warning/30 bg-warning-soft text-warning-fg',
    info: 'border-info/25 bg-info-soft text-info-fg'
  };
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn('flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-[13px] leading-5', tones[tone])}>
      <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
      {action}
    </div>);

}
