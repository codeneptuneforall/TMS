import type { AppNotification } from '../types/notification';

export const notifications: AppNotification[] = [
// Daniel (agent)
{ id: 'n-1', recipientId: 'u-daniel', kind: 'reply', title: 'Priya Shah replied', body: 'Any update on this? Our quarterly report is due Monday.', ticketId: 'TKT-001279', actorId: 'u-priya', createdAt: '2026-10-24T08:15:00', read: false },
{ id: 'n-2', recipientId: 'u-daniel', kind: 'assigned', title: 'Sofia Lindqvist assigned a ticket to you', body: 'Calendar sync stopped for Google Workspace users', ticketId: 'TKT-001282', actorId: 'u-sofia', createdAt: '2026-10-24T07:10:00', read: false },
{ id: 'n-3', recipientId: 'u-daniel', kind: 'sla', title: 'Response due soon', body: 'TKT-001282 has no first response yet. High priority target is 4 hours.', ticketId: 'TKT-001282', actorId: null, createdAt: '2026-10-24T09:30:00', read: false },
{ id: 'n-4', recipientId: 'u-daniel', kind: 'mention', title: 'Sofia Lindqvist mentioned you', body: '@Daniel could this be related to the SCIM issue on TKT-001284?', ticketId: 'TKT-001272', actorId: 'u-sofia', createdAt: '2026-10-24T08:52:00', read: true },
{ id: 'n-5', recipientId: 'u-daniel', kind: 'status', title: 'Elena Rossi confirmed the fix', body: 'Password reset emails not arriving — marked resolved.', ticketId: 'TKT-001276', actorId: 'u-elena', createdAt: '2026-10-23T12:00:00', read: true },
// Maya (admin)
{ id: 'n-6', recipientId: 'u-maya', kind: 'sla', title: 'Urgent ticket is unassigned and overdue', body: 'Webhook deliveries failing with 502 since 03:00 UTC', ticketId: 'TKT-001281', actorId: null, createdAt: '2026-10-24T07:20:00', read: false },
{ id: 'n-7', recipientId: 'u-maya', kind: 'mention', title: 'Kenji Watanabe mentioned you', body: 'Flagging in case we need customer comms for the SSO incident.', ticketId: 'TKT-001284', actorId: 'u-kenji', createdAt: '2026-10-24T09:41:00', read: false },
{ id: 'n-8', recipientId: 'u-maya', kind: 'status', title: 'Priority raised to Urgent', body: 'Mobile app crashes when opening shared availability links on Android 15', ticketId: 'TKT-001270', actorId: 'u-lucas', createdAt: '2026-10-24T06:05:00', read: true },
{ id: 'n-9', recipientId: 'u-maya', kind: 'system', title: 'Invitation not yet accepted', body: 'Grace Kim was invited 3 days ago and has not activated her account.', ticketId: null, actorId: null, createdAt: '2026-10-24T09:00:00', read: true },
// Priya (requester)
{ id: 'n-10', recipientId: 'u-priya', kind: 'reply', title: 'Kenji Watanabe replied', body: 'The override is live for a canary group of 10 users. Could you ask Nadia to sign in again…', ticketId: 'TKT-001284', actorId: 'u-kenji', createdAt: '2026-10-24T09:40:00', read: false },
{ id: 'n-11', recipientId: 'u-priya', kind: 'reply', title: 'We need your reply', body: 'Could you share the booking page URL and a screenshot of the availability settings?', ticketId: 'TKT-001267', actorId: 'u-daniel', createdAt: '2026-10-23T09:00:00', read: false },
{ id: 'n-12', recipientId: 'u-priya', kind: 'status', title: 'Your ticket was resolved', body: 'Embed widget not loading on Safari 18', ticketId: 'TKT-001261', actorId: 'u-daniel', createdAt: '2026-10-22T15:00:00', read: true }];
