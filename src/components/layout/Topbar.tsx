'use client';
import React from 'react';
import { useNavigate } from '@/lib/router';
import { MenuIcon, PlusIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlobalSearch } from './GlobalSearch';
import { NotificationMenu } from './NotificationMenu';
import { UserMenu } from './UserMenu';
import { LogoMark } from './Logo';

interface TopbarProps {
  onOpenNav: () => void;
  onRequestSignOut: () => void;
}

export function Topbar({ onOpenNav, onRequestSignOut }: TopbarProps) {
  const navigate = useNavigate();
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-surface px-3 sm:gap-3 sm:px-5">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="flex h-9 w-9 items-center justify-center rounded-md text-ink-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 lg:hidden">
        
        <MenuIcon className="h-5 w-5" />
      </button>
      <span className="sm:hidden">
        <LogoMark className="h-7 w-7" />
      </span>
      <div className="flex min-w-0 flex-1">
        <GlobalSearch />
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="primary" size="sm" onClick={() => navigate('/tickets/new')} leadingIcon={<PlusIcon className="h-4 w-4" />} className="hidden sm:inline-flex">
          New ticket
        </Button>
        <Button variant="primary" size="icon-sm" onClick={() => navigate('/tickets/new')} aria-label="New ticket" className="sm:hidden">
          <PlusIcon className="h-4 w-4" />
        </Button>
        <NotificationMenu />
        <UserMenu onRequestSignOut={onRequestSignOut} />
      </div>
    </header>);

}
