'use client';
import React from 'react';
import { Link } from '@/lib/router';
import { ShieldOffIcon } from 'lucide-react';
import { SystemFrame } from './NotFound';

interface UnauthorizedProps {
  inShell?: boolean;
  description?: string;
}

export function Unauthorized({ inShell, description = 'Your role doesn’t include access to this page. If you think this is a mistake, ask a workspace administrator to update your permissions.' }: UnauthorizedProps) {
  return (
    <SystemFrame
      inShell={inShell}
      code="403"
      icon={<ShieldOffIcon className="h-5 w-5" />}
      title="You don’t have permission to view this"
      description={description}
      actions={
      <>
          <Link to="/overview" className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1">
            Back to overview
          </Link>
          {!inShell &&
        <Link to="/signin" className="inline-flex h-9 items-center rounded-md border border-line-strong bg-surface px-3.5 text-sm font-medium text-ink hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
              Switch account
            </Link>
        }
        </>
      } />);


}
