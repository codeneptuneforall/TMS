'use client';
import React from 'react';
import { useNavigate } from '@/lib/router';
import { KeyRoundIcon, LogOutIcon, SlidersHorizontalIcon, UserIcon } from 'lucide-react';
import { Popover } from '../ui/Popover';
import { MenuItem, MenuSeparator } from '../ui/Menu';
import { Avatar } from '../ui/Avatar';
import { useCurrentUser } from '../../contexts/AppStateContext';

export function UserMenu({ onRequestSignOut }: {onRequestSignOut: () => void;}) {
  const user = useCurrentUser();
  const navigate = useNavigate();

  return (
    <Popover
      align="end"
      label="Account"
      className="w-60"
      trigger={({ ref, toggle, open }) =>
      <button
        ref={ref}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2">
        
          <Avatar name={user.name} id={user.id} size="md" />
        </button>
      }>
      
      {(close) => {
        const go = (path: string) => {
          close();
          navigate(path);
        };
        return (
          <div role="menu">
            <div className="px-2 py-2">
              <p className="truncate text-[13px] font-medium text-ink">{user.name}</p>
              <p className="truncate text-[12px] text-ink-3">{user.email}</p>
            </div>
            <MenuSeparator />
            <MenuItem icon={<UserIcon />} onSelect={() => go('/account/profile')}>
              My profile
            </MenuItem>
            <MenuItem icon={<SlidersHorizontalIcon />} onSelect={() => go('/account/preferences')}>
              Preferences
            </MenuItem>
            <MenuItem icon={<KeyRoundIcon />} onSelect={() => go('/account/security')}>
              Password & sessions
            </MenuItem>
            <MenuSeparator />
            <MenuItem
              icon={<LogOutIcon />}
              onSelect={() => {
                close();
                onRequestSignOut();
              }}>
              
              Sign out
            </MenuItem>
          </div>);

      }}
    </Popover>);

}
