import type { Category, SlaPolicy } from '../types/ticket';

export const categories: Category[] = [
{ id: 'c-access', name: 'Account & Access', description: 'Sign-in, SSO, passwords, and user roles.', defaultTeamId: 't-tier1', active: true },
{ id: 'c-billing', name: 'Billing', description: 'Invoices, payments, refunds, and plan changes.', defaultTeamId: 't-billing', active: true },
{ id: 'c-bug', name: 'Bug Report', description: 'Something in the product is not working as expected.', defaultTeamId: 't-escalations', active: true },
{ id: 'c-integration', name: 'Integrations & API', description: 'Calendar sync, webhooks, Zapier, and the REST API.', defaultTeamId: 't-escalations', active: true },
{ id: 'c-onboarding', name: 'Onboarding & Setup', description: 'Workspace setup, migrations, and training.', defaultTeamId: 't-onboarding', active: true },
{ id: 'c-feature', name: 'Feature Request', description: 'Ideas and product feedback.', defaultTeamId: 't-tier1', active: true },
{ id: 'c-general', name: 'General Question', description: 'Anything else.', defaultTeamId: 't-tier1', active: true },
{ id: 'c-legacy', name: 'Legacy Mobile App', description: 'Retired in favor of Bug Report.', defaultTeamId: 't-tier1', active: false }];


// Draft targets — shown as configuration, not as measured compliance.
export const slaPolicies: SlaPolicy[] = [
{ priority: 'urgent', firstResponseHours: 1, resolutionHours: 4 },
{ priority: 'high', firstResponseHours: 4, resolutionHours: 24 },
{ priority: 'medium', firstResponseHours: 8, resolutionHours: 72 },
{ priority: 'low', firstResponseHours: 24, resolutionHours: 120 }];
