import {
  ArchiveIcon,
  BarChart3Icon,
  CircleCheckBigIcon,
  CircleDashedIcon,
  ClockIcon,
  InboxIcon,
  LayoutGridIcon,
  SettingsIcon,
  TicketIcon,
  UsersIcon,
  UsersRoundIcon,
  type LucideIcon } from
'lucide-react';
import type { Role } from '../types/user';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
  matchPrefix?: string;
  count?: 'mine' | 'unassigned';
}

export interface NavSection {
  title: string | null;
  items: NavItem[];
}

export const navigation: NavSection[] = [
{
  title: null,
  items: [
  { to: '/overview', label: 'Overview', icon: LayoutGridIcon, roles: ['admin', 'agent', 'requester'] },
  { to: '/queue/mine', label: 'My Tickets', icon: InboxIcon, roles: ['admin', 'agent', 'requester'], count: 'mine' },
  { to: '/queue/all', label: 'All Tickets', icon: TicketIcon, roles: ['admin', 'agent'] },
  { to: '/queue/unassigned', label: 'Unassigned', icon: CircleDashedIcon, roles: ['admin', 'agent'], count: 'unassigned' },
  { to: '/queue/team', label: 'Team Queue', icon: UsersRoundIcon, roles: ['admin', 'agent'] },
  { to: '/queue/resolved', label: 'Resolved', icon: CircleCheckBigIcon, roles: ['admin', 'agent', 'requester'] }]

},
{
  title: 'Views',
  items: [
  { to: '/queue/pending', label: 'Pending', icon: ClockIcon, roles: ['admin', 'agent'] },
  { to: '/queue/closed', label: 'Closed', icon: ArchiveIcon, roles: ['admin', 'agent'] }]

},
{
  title: 'Workspace',
  items: [
  { to: '/reports', label: 'Reports', icon: BarChart3Icon, roles: ['admin', 'agent'] },
  { to: '/admin/users', label: 'Users & Teams', icon: UsersIcon, roles: ['admin'], matchPrefix: '/admin' },
  { to: '/settings/general', label: 'Settings', icon: SettingsIcon, roles: ['admin'], matchPrefix: '/settings' }]

}];


export const queueViewMeta = {
  all: { title: 'All Tickets', staff: 'Every ticket within your scope.', requester: 'Every request you have submitted.' },
  mine: { title: 'My Tickets', staff: 'Tickets assigned to you.', requester: 'Requests you have submitted.' },
  unassigned: { title: 'Unassigned', staff: 'Active tickets without an owner. Pick one up or assign it.', requester: '' },
  team: { title: 'Team Queue', staff: 'Tickets routed to your teams.', requester: '' },
  pending: { title: 'Pending', staff: 'Paused while waiting on a requester or third party.', requester: '' },
  resolved: { title: 'Resolved', staff: 'Solved tickets that can still be reopened.', requester: 'Requests our team has resolved. Reopen one if the problem returns.' },
  closed: { title: 'Closed', staff: 'Archived, read-only tickets.', requester: '' },
  search: { title: 'Search results', staff: 'Matches across tickets you can access.', requester: 'Matches across your requests.' }
} as const;
