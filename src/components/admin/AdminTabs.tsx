'use client';

import React from 'react';
import { Link } from '@/lib/router';
import { usePathname } from 'next/navigation';
import { cn } from '../../utils/cn';
import { useAppState } from '../../contexts/AppStateContext';

export function AdminTabs() {
  const { users, teams } = useAppState();
  const pathname = usePathname() ?? '';
  const tabs = [
  { to: '/admin/users', label: 'Users', count: users.length },
  { to: '/admin/teams', label: 'Teams', count: teams.length },
  { to: '/admin/roles', label: 'Roles & permissions' }];

  return (
    <nav aria-label="Users and teams" className="mb-5 flex gap-5 overflow-x-auto border-b border-line">
      {tabs.map((t) => {
        const isActive = pathname === t.to || pathname.startsWith(t.to + '/');
        return (
      <Link
        key={t.to}
        to={t.to}
        className={cn(
          '-mb-px flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40',
          isActive ? 'border-ink text-ink' : 'border-transparent text-ink-3 hover:text-ink'
        )}>
        
          {t.label}
          {t.count !== undefined && <span className="rounded bg-muted px-1.5 text-2xs tabular-nums text-ink-2">{t.count}</span>}
        </Link>
        );
      })}
    </nav>);

}

export const ROLE_LABEL = { admin: 'Administrator', manager: 'Team Leader / Support Manager', agent: 'Support agent', requester: 'Customer' } as const;
export const ACCOUNT_STATUS = {
  active: { label: 'Active', tone: 'success' },
  invited: { label: 'Invited', tone: 'info' },
  suspended: { label: 'Suspended', tone: 'neutral' }
} as const;
