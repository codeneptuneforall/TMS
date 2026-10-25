'use client';
import React from 'react';
import { Link, useNavigate } from '@/lib/router';
import { usePathname } from 'next/navigation';
import { ChevronsUpDownIcon, LogOutIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, SettingsIcon } from 'lucide-react';
import { navigation } from '../../data/navigation';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';
import { Popover } from '../ui/Popover';
import { MenuItem, MenuLabel, MenuSeparator } from '../ui/Menu';
import { ticketsForView } from '../../utils/permissions';
import { isActive } from '../../utils/ticketMeta';
import { cn } from '../../utils/cn';
import { Logo } from './Logo';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onRequestSignOut: () => void;
}

const ROLE_LABEL = { admin: 'Administrator', agent: 'Support agent', requester: 'Customer' };

export function Sidebar({ collapsed, onToggleCollapse, onRequestSignOut }: SidebarProps) {
  const user = useCurrentUser();
  const { tickets } = useAppState();
  const pathname = usePathname() ?? '';
  const navigate = useNavigate();

  const counts = {
    mine: ticketsForView('mine', user, tickets).filter((t) => isActive(t.status)).length,
    unassigned: ticketsForView('unassigned', user, tickets).length
  };

  const workspaceName = user.role === 'requester' ? `${user.organization} · Help Center` : 'Cadence Support';

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className={cn('flex h-14 shrink-0 items-center border-b border-line', collapsed ? 'justify-center px-2' : 'px-4')}>
        <Logo compact={collapsed} />
      </div>

      {!collapsed &&
      <div className="px-3 pt-3">
          <Popover
          label="Workspace"
          trigger={({ ref, toggle, open }) =>
          <button
            ref={ref}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-haspopup="menu"
            className="flex w-full items-center gap-2.5 rounded-md border border-line px-2.5 py-2 text-left transition-colors duration-150 hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
            
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-accent-soft text-[11px] font-semibold text-accent-fg">
                  {workspaceName[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-ink">{workspaceName}</span>
                  <span className="block text-2xs text-ink-3">{ROLE_LABEL[user.role]}</span>
                </span>
                <ChevronsUpDownIcon className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
              </button>
          }>
          
            {(close) =>
          <div role="menu" className="w-56">
                <MenuLabel>Workspaces</MenuLabel>
                <MenuItem onSelect={close} selected>
                  {workspaceName}
                </MenuItem>
                {user.role === 'admin' &&
            <>
                    <MenuSeparator />
                    <MenuItem
                icon={<SettingsIcon />}
                onSelect={() => {
                  close();
                  navigate('/settings/general');
                }}>
                
                      Workspace settings
                    </MenuItem>
                  </>
            }
              </div>
          }
          </Popover>
        </div>
      }

      <nav aria-label="Primary" className="scroll-thin min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {navigation.map((section, sIdx) => {
          const items = section.items.filter((i) => i.roles.includes(user.role));
          if (!items.length) return null;
          return (
            <div key={section.title ?? sIdx} className={cn(sIdx > 0 && 'mt-5')}>
              {section.title && !collapsed && <p className="mb-1 px-2 text-2xs font-medium text-ink-3">{section.title}</p>}
              {section.title && collapsed && <div className="mx-2 mb-2 h-px bg-line" aria-hidden />}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = item.matchPrefix ? pathname.startsWith(item.matchPrefix) : pathname === item.to;
                  const count = item.count ? counts[item.count] : 0;
                  const Icon = item.icon;
                  const link =
                  <Link
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    aria-label={collapsed ? item.label : undefined}
                    className={cn(
                      'group flex h-8 items-center gap-2.5 rounded-md text-[13px] font-medium transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
                      collapsed ? 'w-9 justify-center' : 'px-2',
                      active ? 'bg-muted text-ink' : 'text-ink-2 hover:bg-subtle hover:text-ink'
                    )}>
                    
                      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-ink' : 'text-ink-3 group-hover:text-ink-2')} aria-hidden />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && count > 0 &&
                    <span className={cn('rounded px-1.5 text-2xs tabular-nums', item.count === 'unassigned' ? 'bg-warning-soft text-warning-fg' : 'text-ink-3')}>
                          {count}
                        </span>
                    }
                    </Link>;

                  return (
                    <li key={item.to}>
                      {collapsed ?
                      <Tooltip content={count ? `${item.label} · ${count}` : item.label} side="right">
                          {link}
                        </Tooltip> :

                      link
                      }
                    </li>);

                })}
              </ul>
            </div>);

        })}
      </nav>

      <div className={cn('shrink-0 border-t border-line p-3', collapsed && 'flex flex-col items-center gap-2 px-2')}>
        {collapsed ?
        <>
            <Tooltip content="My profile" side="right">
              <Link to="/account/profile" aria-label="My profile" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
                <Avatar name={user.name} id={user.id} size="md" />
              </Link>
            </Tooltip>
            {onToggleCollapse &&
          <Tooltip content="Expand sidebar" side="right">
                <button type="button" onClick={onToggleCollapse} aria-label="Expand sidebar" className="flex h-8 w-8 items-center justify-center rounded-md text-ink-3 hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
                  <PanelLeftOpenIcon className="h-4 w-4" />
                </button>
              </Tooltip>
          }
          </> :

        <div className="flex items-center gap-2">
            <Link to="/account/profile" className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md p-1 hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
              <Avatar name={user.name} id={user.id} size="md" />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-ink">{user.name}</span>
                <span className="block truncate text-2xs text-ink-3">{user.email}</span>
              </span>
            </Link>
            <Tooltip content="Sign out">
              <button type="button" onClick={onRequestSignOut} aria-label="Sign out" className="flex h-8 w-8 items-center justify-center rounded-md text-ink-3 hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
                <LogOutIcon className="h-4 w-4" />
              </button>
            </Tooltip>
            {onToggleCollapse &&
          <Tooltip content="Collapse sidebar">
                <button type="button" onClick={onToggleCollapse} aria-label="Collapse sidebar" className="flex h-8 w-8 items-center justify-center rounded-md text-ink-3 hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
                  <PanelLeftCloseIcon className="h-4 w-4" />
                </button>
              </Tooltip>
          }
          </div>
        }
      </div>
    </div>);

}
