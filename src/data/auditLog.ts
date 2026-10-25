import type { AuditEntry } from '../types/notification';

export const auditLog: AuditEntry[] = [
{ id: 'al-1', actorId: 'u-maya', action: 'Reassigned ticket to Technical Escalations', category: 'ticket', target: 'TKT-001284', createdAt: '2026-10-24T07:15:00', ip: '83.44.120.17' },
{ id: 'al-2', actorId: 'u-kenji', action: 'Raised priority from High to Urgent', category: 'ticket', target: 'TKT-001284', createdAt: '2026-10-24T07:20:00', ip: '91.204.12.88' },
{ id: 'al-3', actorId: 'u-lucas', action: 'Assigned ticket to Kenji Watanabe', category: 'ticket', target: 'TKT-001270', createdAt: '2026-10-24T06:05:00', ip: '91.204.12.90' },
{ id: 'al-4', actorId: 'u-maya', action: 'Updated SLA target for High priority', category: 'settings', target: 'Priorities', createdAt: '2026-10-23T16:12:00', ip: '83.44.120.17' },
{ id: 'al-5', actorId: 'u-maya', action: 'Invited user', category: 'user', target: 'grace@relaydesk.io', createdAt: '2026-10-21T11:00:00', ip: '83.44.120.17' },
{ id: 'al-6', actorId: 'u-maya', action: 'Deactivated team', category: 'team', target: 'Security Response', createdAt: '2026-10-20T10:30:00', ip: '83.44.120.17' },
{ id: 'al-7', actorId: 'u-maya', action: 'Suspended user', category: 'user', target: 'leo@relaydesk.io', createdAt: '2026-09-30T16:05:00', ip: '83.44.120.17' },
{ id: 'al-8', actorId: 'u-maya', action: 'Changed session timeout from 12h to 8h', category: 'security', target: 'Security policy', createdAt: '2026-09-28T09:40:00', ip: '83.44.120.17' },
{ id: 'al-9', actorId: 'u-amara', action: 'Archived category', category: 'settings', target: 'Legacy Mobile App', createdAt: '2026-09-22T14:00:00', ip: '77.12.9.201' },
{ id: 'al-10', actorId: 'u-maya', action: 'Required two-factor authentication for staff', category: 'security', target: 'Security policy', createdAt: '2026-09-15T08:20:00', ip: '83.44.120.17' }];
