import type { Team } from '../types/user';

export const teams: Team[] = [
{ id: 't-tier1', name: 'Tier 1 Support', description: 'First line for account access, how-to questions, and general product issues.', leadId: 'u-sofia', memberIds: ['u-sofia', 'u-daniel'], active: true, createdAt: '2025-02-03T09:00:00' },
{ id: 't-escalations', name: 'Technical Escalations', description: 'Bugs, integrations, SSO, and API issues that need engineering-level investigation.', leadId: 'u-lucas', memberIds: ['u-lucas', 'u-kenji'], active: true, createdAt: '2025-02-17T09:00:00' },
{ id: 't-billing', name: 'Billing & Accounts', description: 'Invoices, refunds, plan changes, and seat management.', leadId: 'u-amara', memberIds: ['u-amara', 'u-omar'], active: true, createdAt: '2025-03-11T09:00:00' },
{ id: 't-onboarding', name: 'Customer Onboarding', description: 'Workspace setup, data migration, and kickoff for new customers.', leadId: 'u-hannah', memberIds: ['u-hannah', 'u-grace'], active: true, createdAt: '2025-06-09T09:00:00' },
{ id: 't-security', name: 'Security Response', description: 'Reserved for security disclosures. Currently inactive while the process is redesigned.', leadId: null, memberIds: [], active: false, createdAt: '2026-05-02T09:00:00' }];
