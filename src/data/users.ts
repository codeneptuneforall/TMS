import type { User } from '../types/user';

// Prototype data — fictional people and organizations.
export const users: User[] = [
{ id: 'u-maya', name: 'Maya Okafor', email: 'maya@relaydesk.io', role: 'admin', teamIds: [], status: 'active', title: 'Head of Support Operations', organization: 'Cadence', createdAt: '2025-02-03T09:00:00', lastActiveAt: '2026-10-24T09:52:00' },
{ id: 'u-tl', name: 'Team Lead', email: 'tl@relaydesk.io', role: 'manager', teamIds: ['t-tier1'], status: 'active', title: 'Team Lead', organization: 'Cadence', createdAt: '2025-04-14T09:00:00', lastActiveAt: '2026-10-24T09:58:00' },
{ id: 'u-daniel', name: 'Daniel Reyes', email: 'daniel@relaydesk.io', role: 'agent', teamIds: ['t-tier1'], status: 'active', title: 'Support Specialist', organization: 'Cadence', createdAt: '2025-04-14T09:00:00', lastActiveAt: '2026-10-24T09:58:00' },
{ id: 'u-sofia', name: 'Sofia Lindqvist', email: 'sofia@relaydesk.io', role: 'agent', teamIds: ['t-tier1'], status: 'active', title: 'Senior Support Specialist', organization: 'Cadence', createdAt: '2025-03-02T09:00:00', lastActiveAt: '2026-10-24T09:31:00' },
{ id: 'u-kenji', name: 'Kenji Watanabe', email: 'kenji@relaydesk.io', role: 'agent', teamIds: ['t-escalations'], status: 'active', title: 'Support Engineer', organization: 'Cadence', createdAt: '2025-05-20T09:00:00', lastActiveAt: '2026-10-24T09:41:00' },
{ id: 'u-lucas', name: 'Lucas Ferreira', email: 'lucas@relaydesk.io', role: 'agent', teamIds: ['t-escalations'], status: 'active', title: 'Escalations Lead', organization: 'Cadence', createdAt: '2025-02-17T09:00:00', lastActiveAt: '2026-10-24T08:44:00' },
{ id: 'u-amara', name: 'Amara Nwosu', email: 'amara@relaydesk.io', role: 'agent', teamIds: ['t-billing'], status: 'active', title: 'Billing Lead', organization: 'Cadence', createdAt: '2025-03-11T09:00:00', lastActiveAt: '2026-10-24T09:12:00' },
{ id: 'u-omar', name: 'Omar Haddad', email: 'omar@relaydesk.io', role: 'agent', teamIds: ['t-billing'], status: 'active', title: 'Billing Specialist', organization: 'Cadence', createdAt: '2025-08-04T09:00:00', lastActiveAt: '2026-10-23T17:20:00' },
{ id: 'u-hannah', name: 'Hannah Brooks', email: 'hannah@relaydesk.io', role: 'agent', teamIds: ['t-onboarding'], status: 'active', title: 'Onboarding Manager', organization: 'Cadence', createdAt: '2025-06-09T09:00:00', lastActiveAt: '2026-10-24T09:05:00' },
{ id: 'u-grace', name: 'Grace Kim', email: 'grace@relaydesk.io', role: 'agent', teamIds: ['t-onboarding'], status: 'invited', title: 'Onboarding Specialist', organization: 'Cadence', createdAt: '2026-10-21T11:00:00', lastActiveAt: null },
{ id: 'u-leo', name: 'Leo Martins', email: 'leo@relaydesk.io', role: 'agent', teamIds: [], status: 'suspended', title: 'Support Specialist', organization: 'Cadence', createdAt: '2025-07-01T09:00:00', lastActiveAt: '2026-09-30T16:00:00' },
{ id: 'u-priya', name: 'Priya Shah', email: 'priya.shah@lumenhealth.com', role: 'requester', teamIds: [], status: 'active', title: 'IT Systems Manager', organization: 'Lumen Health', createdAt: '2025-09-12T09:00:00', lastActiveAt: '2026-10-24T09:02:00' },
{ id: 'u-nadia', name: 'Nadia Petrova', email: 'nadia.petrova@lumenhealth.com', role: 'requester', teamIds: [], status: 'active', title: 'Operations Coordinator', organization: 'Lumen Health', createdAt: '2025-09-12T10:00:00', lastActiveAt: '2026-10-24T09:20:00' },
{ id: 'u-tom', name: 'Tom Becker', email: 'tom.becker@arcadiafreight.com', role: 'requester', teamIds: [], status: 'active', title: 'Finance Director', organization: 'Arcadia Freight', createdAt: '2025-11-03T09:00:00', lastActiveAt: '2026-10-24T08:55:00' },
{ id: 'u-james', name: "James O'Connor", email: 'james.oconnor@arcadiafreight.com', role: 'requester', teamIds: [], status: 'active', title: 'Scheduling Administrator', organization: 'Arcadia Freight', createdAt: '2025-11-03T10:00:00', lastActiveAt: '2026-10-23T14:10:00' },
{ id: 'u-elena', name: 'Elena Rossi', email: 'elena@brightlinestudio.co', role: 'requester', teamIds: [], status: 'active', title: 'Studio Manager', organization: 'Brightline Studio', createdAt: '2026-01-19T09:00:00', lastActiveAt: '2026-10-24T08:10:00' },
{ id: 'u-marcus', name: 'Marcus Allen', email: 'marcus.allen@kestrelbank.com', role: 'requester', teamIds: [], status: 'active', title: 'Platform Engineer', organization: 'Kestrel Bank', createdAt: '2026-03-08T09:00:00', lastActiveAt: '2026-10-24T03:20:00' }];


export const DEFAULT_USER_BY_ROLE = {
  admin: 'u-maya',
  agent: 'u-daniel',
  requester: 'u-priya',
  manager: 'u-tl'
} as const;
