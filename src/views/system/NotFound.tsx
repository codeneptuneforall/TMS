'use client';
import React from 'react';
import { Link } from '@/lib/router';
import { CompassIcon } from 'lucide-react';
import { LogoMark } from '../../components/layout/Logo';

interface SystemPageProps {
  inShell?: boolean;
  title?: string;
  description?: string;
}

export function NotFound({ inShell, title = 'Page not found', description = 'The page you’re looking for doesn’t exist or may have moved.' }: SystemPageProps) {
  return (
    <SystemFrame inShell={inShell} code="404" icon={<CompassIcon className="h-5 w-5" />} title={title} description={description} />);

}

export function SystemFrame({
  inShell,
  code,
  icon,
  title,
  description,
  actions







}: {inShell?: boolean;code: string;icon: React.ReactNode;title: string;description: string;actions?: React.ReactNode;}) {
  const body =
  <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-surface text-ink-2 shadow-card">{icon}</div>
      <p className="ticket-id text-[12px] text-ink-3">Error {code}</p>
      <h1 className="mt-1 text-xl font-semibold tracking-[-0.01em] text-ink">{title}</h1>
      <p className="mt-2 text-[14px] leading-6 text-ink-2">{description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {actions ??
      <Link to="/overview" className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1">
            Back to overview
          </Link>
      }
      </div>
    </div>;

  if (inShell) return <div className="flex min-h-full items-center py-20">{body}</div>;
  return (
    <div className="flex min-h-full w-full flex-col bg-canvas">
      <div className="px-6 py-5">
        <LogoMark />
      </div>
      <div className="flex flex-1 items-center pb-24">{body}</div>
    </div>);

}
