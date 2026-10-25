import type { Ticket } from '../types/ticket';

// Prototype data — fictional tickets. Dashboard, queue, and report numbers are all derived from this list.
export const tickets: Ticket[] = [
{
  id: 'TKT-001284',
  subject: 'SSO login loop after enabling Okta SCIM provisioning — users redirected back to the sign-in page indefinitely',
  description:
  'Since we enabled SCIM provisioning in Okta this morning, most of our staff cannot sign in to Cadence. After authenticating in Okta they land back on the Cadence sign-in page, and clicking "Continue with SSO" starts the loop again.\n\nThis affects roughly 140 users across three clinics. Our scheduling coordinators start their first shift at 10:00 and rely on Cadence to manage patient appointments.',
  requesterId: 'u-priya',
  assigneeId: 'u-kenji',
  teamId: 't-escalations',
  categoryId: 'c-access',
  priority: 'urgent',
  status: 'in_progress',
  createdAt: '2026-10-24T07:12:00',
  updatedAt: '2026-10-24T09:41:00',
  dueAt: '2026-10-24T11:12:00',
  tags: ['sso', 'okta', 'outage'],
  attachments: [{ id: 'f-1', name: 'okta-app-settings.png', size: 482113, mime: 'image/png' }],
  messages: [
  { id: 'm-1a', authorId: 'u-kenji', visibility: 'public', body: "Hi Priya, thanks for the detailed report — I'm picking this up now.\n\nCould you share a HAR capture of the redirect loop from one affected user? That will show us exactly where the session is being dropped.", createdAt: '2026-10-24T07:31:00', attachments: [] },
  { id: 'm-1b', authorId: 'u-kenji', visibility: 'internal', body: 'Same pattern as TKT-001198 — SCIM provisioning rewrote the NameID format to persistent. Checking with Lucas before we suggest anything on their side.', createdAt: '2026-10-24T07:34:00', attachments: [] },
  { id: 'm-1c', authorId: 'u-priya', visibility: 'public', body: "Attached the HAR file from Nadia's browser and a screenshot of our Okta app settings. About 140 users are affected, including all of our scheduling coordinators.", createdAt: '2026-10-24T07:52:00', attachments: [{ id: 'f-2', name: 'cadence-signin-loop.har', size: 3984211, mime: 'application/json' }, { id: 'f-3', name: 'okta-provisioning-tab.png', size: 391022, mime: 'image/png' }] },
  { id: 'm-1d', authorId: 'u-lucas', visibility: 'internal', body: "Confirmed: NameID format mismatch. Two options — they flip 'Use email as identifier' in Okta, or we apply a server-side mapping override. I'd prefer the override so they don't need a change window.", createdAt: '2026-10-24T08:10:00', attachments: [] },
  { id: 'm-1e', authorId: 'u-kenji', visibility: 'public', body: "Thanks Priya — the HAR file confirmed the cause. Okta is now sending a different user identifier than Cadence expects.\n\nWe're applying a configuration override on our side, so no changes are needed in Okta. I'll update you within the hour.", createdAt: '2026-10-24T08:25:00', attachments: [] },
  { id: 'm-1f', authorId: 'u-priya', visibility: 'public', body: 'That is great news. Is there anything we should tell users in the meantime? Several have clinics starting at 10.', createdAt: '2026-10-24T09:02:00', attachments: [] },
  { id: 'm-1g', authorId: 'u-kenji', visibility: 'public', body: 'The override is live for a canary group of 10 users. Could you ask Nadia to sign in again from a private browser window and confirm it works?\n\nIn the meantime, users can sign in with their Cadence password as a fallback.', createdAt: '2026-10-24T09:40:00', attachments: [] },
  { id: 'm-1h', authorId: 'u-kenji', visibility: 'internal', body: 'Canary looks clean in the auth logs. Rolling to all 140 users once Priya confirms. Maya — flagging in case we need customer comms.', createdAt: '2026-10-24T09:41:00', attachments: [] }],

  activity: [
  { id: 'a-1a', kind: 'team', actorId: 'u-maya', createdAt: '2026-10-24T07:15:00', from: 't-tier1', to: 't-escalations' },
  { id: 'a-1b', kind: 'assigned', actorId: 'u-maya', createdAt: '2026-10-24T07:15:00', from: null, to: 'u-kenji' },
  { id: 'a-1c', kind: 'priority', actorId: 'u-kenji', createdAt: '2026-10-24T07:20:00', from: 'high', to: 'urgent' },
  { id: 'a-1d', kind: 'status', actorId: 'u-kenji', createdAt: '2026-10-24T07:31:00', from: 'open', to: 'in_progress' }]

},
{
  id: 'TKT-001283',
  subject: 'Invoice INV-20931 charged twice in October',
  description: 'Our corporate card was charged twice for invoice INV-20931 ($4,860.00) on October 1st. I have attached the invoice and our bank statement showing both transactions. Please refund the duplicate charge.',
  requesterId: 'u-tom', assigneeId: null, teamId: 't-billing', categoryId: 'c-billing', priority: 'high', status: 'open',
  createdAt: '2026-10-24T08:55:00', updatedAt: '2026-10-24T08:55:00', dueAt: '2026-10-24T12:55:00', tags: ['refund'],
  attachments: [{ id: 'f-4', name: 'INV-20931.pdf', size: 128400, mime: 'application/pdf' }, { id: 'f-5', name: 'bank-statement-oct.png', size: 845210, mime: 'image/png' }],
  messages: [], activity: []
},
{
  id: 'TKT-001282',
  subject: 'Calendar sync stopped for Google Workspace users',
  description: "Since yesterday afternoon, new bookings aren't appearing in our team's Google Calendars. Outlook users seem fine. We have 12 people on Google Workspace.",
  requesterId: 'u-elena', assigneeId: 'u-daniel', teamId: 't-tier1', categoryId: 'c-integration', priority: 'high', status: 'open',
  createdAt: '2026-10-24T06:30:00', updatedAt: '2026-10-24T07:10:00', dueAt: '2026-10-24T10:30:00', tags: ['google', 'calendar-sync'],
  attachments: [], messages: [],
  activity: [{ id: 'a-3a', kind: 'assigned', actorId: 'u-sofia', createdAt: '2026-10-24T07:10:00', from: null, to: 'u-daniel' }]
},
{
  id: 'TKT-001281',
  subject: 'Webhook deliveries failing with 502 since 03:00 UTC',
  description: 'All webhook deliveries to our endpoint have returned 502 since roughly 03:00 UTC. Our endpoint is healthy and responds to manual requests. The delivery log shows "upstream connect error". This blocks our booking reconciliation job.',
  requesterId: 'u-marcus', assigneeId: null, teamId: 't-escalations', categoryId: 'c-integration', priority: 'urgent', status: 'open',
  createdAt: '2026-10-24T03:20:00', updatedAt: '2026-10-24T03:20:00', dueAt: '2026-10-24T07:20:00', tags: ['webhooks', 'api'],
  attachments: [], messages: [], activity: []
},
{
  id: 'TKT-001280',
  subject: 'Request to add 25 seats to our Enterprise plan',
  description: 'We are onboarding our new Riverside clinic next month and need 25 additional seats on our Enterprise plan. Please send a quote.',
  requesterId: 'u-nadia', assigneeId: 'u-amara', teamId: 't-billing', categoryId: 'c-billing', priority: 'medium', status: 'pending', pendingReason: 'requester',
  createdAt: '2026-10-23T15:00:00', updatedAt: '2026-10-23T17:30:00', dueAt: null, tags: ['seats', 'expansion'],
  attachments: [],
  messages: [{ id: 'm-5a', authorId: 'u-amara', visibility: 'public', body: "Hi Nadia, happy to help. I've attached a quote for 25 seats prorated to your renewal date. Once your purchasing team issues a PO, reply here and I'll apply the seats the same day.", createdAt: '2026-10-23T17:30:00', attachments: [{ id: 'f-6', name: 'Quote-Q-1182-Lumen.pdf', size: 96400, mime: 'application/pdf' }] }],
  activity: [{ id: 'a-5a', kind: 'status', actorId: 'u-amara', createdAt: '2026-10-23T17:30:00', from: 'in_progress', to: 'pending' }]
},
{
  id: 'TKT-001279',
  subject: 'Export to CSV cuts off rows after 10,000 records',
  description: 'When I export the appointment history report for Q3, the CSV stops at exactly 10,000 rows. The report shows 14,212 appointments in the app.',
  requesterId: 'u-priya', assigneeId: 'u-daniel', teamId: 't-tier1', categoryId: 'c-bug', priority: 'medium', status: 'in_progress',
  createdAt: '2026-10-23T11:00:00', updatedAt: '2026-10-24T08:15:00', dueAt: '2026-10-26T11:00:00', tags: ['export', 'reports'],
  attachments: [{ id: 'f-7', name: 'q3-appointments-export.csv', size: 1843000, mime: 'text/csv' }],
  messages: [
  { id: 'm-6a', authorId: 'u-daniel', visibility: 'public', body: "Thanks Priya, I can reproduce this on our side with a large test workspace. I'm working with our engineers and will share a workaround shortly.", createdAt: '2026-10-23T11:40:00', attachments: [] },
  { id: 'm-6b', authorId: 'u-daniel', visibility: 'internal', body: 'Reproduced on 10.4.2. The export worker caps pagination at 10k. Filed ENG-4471 with Escalations; a workaround is splitting the export by month.', createdAt: '2026-10-23T12:05:00', attachments: [] },
  { id: 'm-6c', authorId: 'u-priya', visibility: 'public', body: 'Any update on this? Our quarterly report is due Monday.', createdAt: '2026-10-24T08:15:00', attachments: [] }],

  activity: [{ id: 'a-6a', kind: 'status', actorId: 'u-daniel', createdAt: '2026-10-23T11:40:00', from: 'open', to: 'in_progress' }]
},
{
  id: 'TKT-001278',
  subject: 'How do I set up round-robin booking for my team?',
  description: 'We want incoming demo requests distributed evenly across our four schedulers. Is round-robin available on our plan?',
  requesterId: 'u-james', assigneeId: 'u-sofia', teamId: 't-tier1', categoryId: 'c-general', priority: 'low', status: 'pending', pendingReason: 'requester',
  createdAt: '2026-10-23T09:30:00', updatedAt: '2026-10-23T14:00:00', dueAt: null, tags: ['how-to'],
  attachments: [],
  messages: [{ id: 'm-7a', authorId: 'u-sofia', visibility: 'public', body: 'Round-robin is available on your plan. Could you confirm whether all four schedulers should receive bookings equally, or should some be weighted higher?', createdAt: '2026-10-23T14:00:00', attachments: [] }],
  activity: [{ id: 'a-7a', kind: 'status', actorId: 'u-sofia', createdAt: '2026-10-23T14:00:00', from: 'open', to: 'pending' }]
},
{
  id: 'TKT-001277',
  subject: 'Data migration from legacy scheduler — onboarding kickoff',
  description: "We're ready to migrate three years of booking history from our previous scheduling tool. Attached is a sample export and our proposed field mapping.",
  requesterId: 'u-tom', assigneeId: 'u-hannah', teamId: 't-onboarding', categoryId: 'c-onboarding', priority: 'medium', status: 'in_progress',
  createdAt: '2026-10-22T13:00:00', updatedAt: '2026-10-24T09:05:00', dueAt: '2026-10-25T13:00:00', tags: ['migration'],
  attachments: [{ id: 'f-8', name: 'legacy-export-sample.csv', size: 2420000, mime: 'text/csv' }, { id: 'f-9', name: 'field-mapping.xlsx', size: 48200, mime: 'application/vnd.ms-excel' }],
  messages: [
  { id: 'm-8a', authorId: 'u-hannah', visibility: 'public', body: "Thanks Tom — the mapping looks solid. Two fields need attention: 'resource_code' has no Cadence equivalent, and dates are in DD/MM/YYYY. I'll run a test import into a sandbox workspace tomorrow.", createdAt: '2026-10-23T10:15:00', attachments: [] },
  { id: 'm-8b', authorId: 'u-tom', visibility: 'public', body: "We can drop resource_code. Sandbox sounds good — please invite James as well.", createdAt: '2026-10-23T16:20:00', attachments: [] },
  { id: 'm-8c', authorId: 'u-hannah', visibility: 'public', body: 'Test import completed: 48,120 bookings, 0 errors. Sandbox invites are on their way to you and James.', createdAt: '2026-10-24T09:05:00', attachments: [{ id: 'f-10', name: 'import-report.pdf', size: 74200, mime: 'application/pdf' }] }],

  activity: [{ id: 'a-8a', kind: 'status', actorId: 'u-hannah', createdAt: '2026-10-23T10:15:00', from: 'open', to: 'in_progress' }]
},
{
  id: 'TKT-001276',
  subject: 'Password reset emails not arriving',
  description: 'Two of our team members requested password resets this morning and neither received the email, including in spam.',
  requesterId: 'u-elena', assigneeId: 'u-daniel', teamId: 't-tier1', categoryId: 'c-access', priority: 'high', status: 'resolved',
  createdAt: '2026-10-22T10:00:00', updatedAt: '2026-10-23T12:00:00', dueAt: '2026-10-22T14:00:00', tags: ['email-delivery'],
  attachments: [],
  messages: [
  { id: 'm-9a', authorId: 'u-daniel', visibility: 'public', body: "Hi Elena — your domain's SPF record doesn't include our sending domain, so your mail server rejects the messages. Adding 'include:mail.cadence.app' to your SPF record will fix it.", createdAt: '2026-10-22T11:20:00', attachments: [] },
  { id: 'm-9b', authorId: 'u-elena', visibility: 'public', body: "Added the record and reset emails are arriving now. Thanks!", createdAt: '2026-10-23T11:45:00', attachments: [] }],

  activity: [
  { id: 'a-9a', kind: 'status', actorId: 'u-daniel', createdAt: '2026-10-22T11:20:00', from: 'open', to: 'in_progress' },
  { id: 'a-9b', kind: 'resolved', actorId: 'u-daniel', createdAt: '2026-10-23T12:00:00', from: 'in_progress', to: 'resolved' }]

},
{
  id: 'TKT-001275',
  subject: 'Feature request: custom fields on booking forms',
  description: 'We need to collect a project code when clients book a session. Custom fields on booking forms would solve this.',
  requesterId: 'u-marcus', assigneeId: 'u-sofia', teamId: 't-tier1', categoryId: 'c-feature', priority: 'low', status: 'closed',
  createdAt: '2026-10-20T09:10:00', updatedAt: '2026-10-22T10:00:00', dueAt: null, tags: ['feedback'],
  attachments: [],
  messages: [{ id: 'm-10a', authorId: 'u-sofia', visibility: 'public', body: "Thanks Marcus — custom booking fields shipped in beta last week. I've enabled the beta for your workspace under Settings → Booking forms.", createdAt: '2026-10-20T15:00:00', attachments: [] }],
  activity: [
  { id: 'a-10a', kind: 'resolved', actorId: 'u-sofia', createdAt: '2026-10-20T15:00:00', from: 'open', to: 'resolved' },
  { id: 'a-10b', kind: 'closed', actorId: 'u-sofia', createdAt: '2026-10-22T10:00:00', from: 'resolved', to: 'closed' }]

},
{
  id: 'TKT-001274',
  subject: 'Timezone shown incorrectly on reminder emails for APAC attendees',
  description: 'Attendees in Singapore and Sydney receive reminder emails showing the appointment time in US Eastern instead of their local timezone.',
  requesterId: 'u-nadia', assigneeId: null, teamId: 't-tier1', categoryId: 'c-bug', priority: 'medium', status: 'open',
  createdAt: '2026-10-24T09:20:00', updatedAt: '2026-10-24T09:20:00', dueAt: '2026-10-24T17:20:00', tags: ['timezones', 'notifications'],
  attachments: [], messages: [], activity: []
},
{
  id: 'TKT-001273',
  subject: 'API rate limit increase for nightly batch job',
  description: 'Our nightly sync makes about 40,000 API calls between 01:00 and 02:00 UTC and is being throttled. Can we get a temporary limit increase?',
  requesterId: 'u-marcus', assigneeId: 'u-lucas', teamId: 't-escalations', categoryId: 'c-integration', priority: 'medium', status: 'pending', pendingReason: 'third_party',
  createdAt: '2026-10-22T08:00:00', updatedAt: '2026-10-23T10:00:00', dueAt: null, tags: ['api', 'rate-limits'],
  attachments: [],
  messages: [
  { id: 'm-12a', authorId: 'u-lucas', visibility: 'public', body: "We've requested a limit increase from our platform team. Approval usually takes one to two business days — I'll update you as soon as it's applied.", createdAt: '2026-10-23T10:00:00', attachments: [] },
  { id: 'm-12b', authorId: 'u-lucas', visibility: 'internal', body: 'Platform ticket PLAT-902 filed. Requested 60k/hour for the 01:00–03:00 UTC window.', createdAt: '2026-10-23T10:02:00', attachments: [] }],

  activity: [{ id: 'a-12a', kind: 'status', actorId: 'u-lucas', createdAt: '2026-10-23T10:00:00', from: 'in_progress', to: 'pending' }]
},
{
  id: 'TKT-001272',
  subject: 'Unable to remove former employee from admin role',
  description: 'A former employee still has admin access. When I try to change their role, I get "You must have at least one owner". There are two other owners on the account.',
  requesterId: 'u-priya', assigneeId: 'u-sofia', teamId: 't-tier1', categoryId: 'c-access', priority: 'high', status: 'in_progress',
  createdAt: '2026-10-23T16:40:00', updatedAt: '2026-10-24T08:50:00', dueAt: '2026-10-24T16:40:00', tags: ['roles', 'security'],
  attachments: [],
  messages: [
  { id: 'm-13a', authorId: 'u-sofia', visibility: 'public', body: "Thanks for flagging this, Priya. As a precaution I've suspended that user's sessions while we look into the role error.", createdAt: '2026-10-23T17:05:00', attachments: [] },
  { id: 'm-13b', authorId: 'u-sofia', visibility: 'internal', body: 'The two other owners were created via SCIM and are flagged as "pending verification", so the owner count check ignores them. Might be related to TKT-001284.', createdAt: '2026-10-24T08:50:00', attachments: [] }],

  activity: [{ id: 'a-13a', kind: 'status', actorId: 'u-sofia', createdAt: '2026-10-23T17:05:00', from: 'open', to: 'in_progress' }]
},
{
  id: 'TKT-001271',
  subject: 'Refund request for unused annual add-on',
  description: 'We purchased the SMS reminders add-on in error and have not used it. Requesting a refund.',
  requesterId: 'u-james', assigneeId: 'u-omar', teamId: 't-billing', categoryId: 'c-billing', priority: 'low', status: 'resolved',
  createdAt: '2026-10-21T10:00:00', updatedAt: '2026-10-23T09:30:00', dueAt: null, tags: ['refund'],
  attachments: [],
  messages: [{ id: 'm-14a', authorId: 'u-omar', visibility: 'public', body: 'The refund of $240.00 has been issued to your card ending in 4421 and should appear within 5–10 business days.', createdAt: '2026-10-23T09:30:00', attachments: [] }],
  activity: [{ id: 'a-14a', kind: 'resolved', actorId: 'u-omar', createdAt: '2026-10-23T09:30:00', from: 'in_progress', to: 'resolved' }]
},
{
  id: 'TKT-001270',
  subject: 'Mobile app crashes when opening shared availability links on Android 15',
  description: 'Clients on Android 15 report the Cadence app crashes immediately when they tap a shared availability link. Crash log attached from a Pixel 9.',
  requesterId: 'u-elena', assigneeId: 'u-kenji', teamId: 't-escalations', categoryId: 'c-bug', priority: 'urgent', status: 'in_progress',
  createdAt: '2026-10-24T05:45:00', updatedAt: '2026-10-24T09:30:00', dueAt: '2026-10-24T09:45:00', tags: ['android', 'crash'],
  attachments: [{ id: 'f-11', name: 'pixel9-crash.log', size: 18320, mime: 'text/plain' }],
  messages: [{ id: 'm-15a', authorId: 'u-kenji', visibility: 'public', body: "Thanks Elena — the crash log points to a deep-link handler issue introduced in 6.12. A hotfix (6.12.1) is in review with Google Play now.", createdAt: '2026-10-24T09:30:00', attachments: [] }],
  activity: [
  { id: 'a-15a', kind: 'assigned', actorId: 'u-lucas', createdAt: '2026-10-24T06:05:00', from: null, to: 'u-kenji' },
  { id: 'a-15b', kind: 'status', actorId: 'u-kenji', createdAt: '2026-10-24T06:20:00', from: 'open', to: 'in_progress' }]

},
{
  id: 'TKT-001269',
  subject: 'Onboarding call reschedule request',
  description: 'Could we move our second onboarding session from Thursday to the following Monday?',
  requesterId: 'u-nadia', assigneeId: 'u-hannah', teamId: 't-onboarding', categoryId: 'c-onboarding', priority: 'low', status: 'closed',
  createdAt: '2026-10-18T10:00:00', updatedAt: '2026-10-20T09:00:00', dueAt: null, tags: [],
  attachments: [],
  messages: [{ id: 'm-16a', authorId: 'u-hannah', visibility: 'public', body: 'Done — the session is now Monday at 14:00. Calendar invite updated.', createdAt: '2026-10-18T13:00:00', attachments: [] }],
  activity: [{ id: 'a-16a', kind: 'resolved', actorId: 'u-hannah', createdAt: '2026-10-18T13:00:00', from: 'open', to: 'resolved' }, { id: 'a-16b', kind: 'closed', actorId: 'u-hannah', createdAt: '2026-10-20T09:00:00', from: 'resolved', to: 'closed' }]
},
{
  id: 'TKT-001268',
  subject: 'Billing contact needs to be updated to finance@arcadiafreight.com',
  description: 'Please send all future invoices to finance@arcadiafreight.com instead of my personal address.',
  requesterId: 'u-tom', assigneeId: 'u-amara', teamId: 't-billing', categoryId: 'c-billing', priority: 'low', status: 'resolved',
  createdAt: '2026-10-21T14:00:00', updatedAt: '2026-10-22T09:15:00', dueAt: null, tags: [],
  attachments: [],
  messages: [{ id: 'm-17a', authorId: 'u-amara', visibility: 'public', body: 'Updated. Your next invoice on November 1st will go to finance@arcadiafreight.com.', createdAt: '2026-10-22T09:15:00', attachments: [] }],
  activity: [{ id: 'a-17a', kind: 'resolved', actorId: 'u-amara', createdAt: '2026-10-22T09:15:00', from: 'open', to: 'resolved' }]
},
{
  id: 'TKT-001267',
  subject: "Booking page shows 'No availability' despite open slots",
  description: "Our public booking page for the Eastside clinic says 'No availability' for the next two weeks, but the providers' calendars have plenty of open slots.",
  requesterId: 'u-priya', assigneeId: 'u-daniel', teamId: 't-tier1', categoryId: 'c-bug', priority: 'medium', status: 'pending', pendingReason: 'requester',
  createdAt: '2026-10-22T12:00:00', updatedAt: '2026-10-23T09:00:00', dueAt: null, tags: ['booking-page'],
  attachments: [],
  messages: [{ id: 'm-18a', authorId: 'u-daniel', visibility: 'public', body: 'Hi Priya — could you share the booking page URL and a screenshot of the availability settings for one of the Eastside providers? That will help me check for a conflicting buffer rule.', createdAt: '2026-10-23T09:00:00', attachments: [] }],
  activity: [{ id: 'a-18a', kind: 'status', actorId: 'u-daniel', createdAt: '2026-10-23T09:00:00', from: 'in_progress', to: 'pending' }]
},
{
  id: 'TKT-001266',
  subject: 'Zapier integration creating duplicate events',
  description: 'Each new booking creates two events in our CRM via Zapier.',
  requesterId: 'u-marcus', assigneeId: 'u-kenji', teamId: 't-escalations', categoryId: 'c-integration', priority: 'medium', status: 'resolved',
  createdAt: '2026-10-20T11:00:00', updatedAt: '2026-10-22T16:00:00', dueAt: null, tags: ['zapier'],
  attachments: [],
  messages: [{ id: 'm-19a', authorId: 'u-kenji', visibility: 'public', body: 'Your workspace had two active Zapier connections subscribed to the same trigger. I disabled the older one — new bookings now create a single event.', createdAt: '2026-10-22T16:00:00', attachments: [] }],
  activity: [{ id: 'a-19a', kind: 'resolved', actorId: 'u-kenji', createdAt: '2026-10-22T16:00:00', from: 'in_progress', to: 'resolved' }]
},
{
  id: 'TKT-001265',
  subject: 'Question about data retention for deleted bookings',
  description: 'How long are deleted bookings retained before they are permanently removed? Our compliance team needs this for an audit.',
  requesterId: 'u-elena', assigneeId: null, teamId: 't-tier1', categoryId: 'c-general', priority: 'low', status: 'open',
  createdAt: '2026-10-24T08:10:00', updatedAt: '2026-10-24T08:10:00', dueAt: '2026-10-25T08:10:00', tags: ['compliance'],
  attachments: [], messages: [], activity: []
},
{
  id: 'TKT-001264',
  subject: 'Set up sandbox workspace for QA team',
  description: 'We would like a sandbox workspace mirroring production settings for our QA team to test booking flows.',
  requesterId: 'u-james', assigneeId: 'u-hannah', teamId: 't-onboarding', categoryId: 'c-onboarding', priority: 'medium', status: 'open',
  createdAt: '2026-10-23T10:00:00', updatedAt: '2026-10-23T13:00:00', dueAt: '2026-10-26T10:00:00', tags: ['sandbox'],
  attachments: [], messages: [],
  activity: [{ id: 'a-21a', kind: 'assigned', actorId: 'u-maya', createdAt: '2026-10-23T13:00:00', from: null, to: 'u-hannah' }]
},
{
  id: 'TKT-001263',
  subject: 'Audit log export missing IP addresses',
  description: 'The audit log CSV export has an empty ip_address column for all events after October 15th.',
  requesterId: 'u-nadia', assigneeId: 'u-lucas', teamId: 't-escalations', categoryId: 'c-bug', priority: 'high', status: 'in_progress',
  createdAt: '2026-10-23T08:00:00', updatedAt: '2026-10-24T07:00:00', dueAt: '2026-10-24T08:00:00', tags: ['audit-log', 'security'],
  attachments: [],
  messages: [{ id: 'm-22a', authorId: 'u-lucas', visibility: 'public', body: "Confirmed — a logging change on October 15th dropped the IP field from exports. The data is still stored; we're preparing a fix and a backfilled export for you.", createdAt: '2026-10-24T07:00:00', attachments: [] }],
  activity: [{ id: 'a-22a', kind: 'status', actorId: 'u-lucas', createdAt: '2026-10-23T09:10:00', from: 'open', to: 'in_progress' }]
},
{
  id: 'TKT-001262',
  subject: 'Cancel trial workspace created by mistake',
  description: 'One of our team members accidentally started a separate trial workspace. Please cancel it.',
  requesterId: 'u-tom', assigneeId: 'u-omar', teamId: 't-billing', categoryId: 'c-billing', priority: 'low', status: 'closed',
  createdAt: '2026-10-17T09:00:00', updatedAt: '2026-10-19T09:00:00', dueAt: null, tags: [],
  attachments: [], messages: [],
  activity: [{ id: 'a-23a', kind: 'resolved', actorId: 'u-omar', createdAt: '2026-10-17T11:00:00', from: 'open', to: 'resolved' }, { id: 'a-23b', kind: 'closed', actorId: 'u-omar', createdAt: '2026-10-19T09:00:00', from: 'resolved', to: 'closed' }]
},
{
  id: 'TKT-001261',
  subject: 'Embed widget not loading on Safari 18',
  description: 'The booking widget embedded on our website shows a blank frame in Safari 18. Chrome and Firefox work.',
  requesterId: 'u-priya', assigneeId: 'u-daniel', teamId: 't-tier1', categoryId: 'c-bug', priority: 'medium', status: 'resolved',
  createdAt: '2026-10-19T10:00:00', updatedAt: '2026-10-22T15:00:00', dueAt: null, tags: ['embed', 'safari'],
  attachments: [],
  messages: [
  { id: 'm-24a', authorId: 'u-daniel', visibility: 'public', body: 'This was caused by stricter third-party cookie handling in Safari 18. The fix shipped in release 10.4.1 — could you confirm the widget loads now?', createdAt: '2026-10-21T16:00:00', attachments: [] },
  { id: 'm-24b', authorId: 'u-priya', visibility: 'public', body: 'Confirmed working on Safari. Thank you!', createdAt: '2026-10-22T14:40:00', attachments: [] }],

  activity: [{ id: 'a-24a', kind: 'resolved', actorId: 'u-daniel', createdAt: '2026-10-22T15:00:00', from: 'in_progress', to: 'resolved' }]
},
{
  id: 'TKT-001260',
  subject: 'Request for HIPAA BAA documentation',
  description: 'Our compliance officer needs a signed Business Associate Agreement before we expand Cadence to additional clinics.',
  requesterId: 'u-nadia', assigneeId: 'u-sofia', teamId: 't-tier1', categoryId: 'c-general', priority: 'medium', status: 'closed',
  createdAt: '2026-10-15T10:00:00', updatedAt: '2026-10-18T10:00:00', dueAt: null, tags: ['compliance'],
  attachments: [],
  messages: [{ id: 'm-25a', authorId: 'u-sofia', visibility: 'public', body: 'The countersigned BAA is attached. A copy is also available under Settings → Compliance.', createdAt: '2026-10-16T11:00:00', attachments: [{ id: 'f-12', name: 'Cadence-BAA-LumenHealth.pdf', size: 210400, mime: 'application/pdf' }] }],
  activity: [{ id: 'a-25a', kind: 'resolved', actorId: 'u-sofia', createdAt: '2026-10-16T11:00:00', from: 'open', to: 'resolved' }, { id: 'a-25b', kind: 'closed', actorId: 'u-sofia', createdAt: '2026-10-18T10:00:00', from: 'resolved', to: 'closed' }]
},
{
  id: 'TKT-001259',
  subject: 'Duplicate contacts created after CRM sync',
  description: 'After connecting our CRM, each client appears twice in Cadence contacts.',
  requesterId: 'u-marcus', assigneeId: 'u-daniel', teamId: 't-tier1', categoryId: 'c-integration', priority: 'medium', status: 'resolved',
  createdAt: '2026-10-18T09:00:00', updatedAt: '2026-10-21T10:00:00', dueAt: null, tags: ['crm'],
  attachments: [],
  messages: [{ id: 'm-26a', authorId: 'u-daniel', visibility: 'public', body: "I've merged 312 duplicate contacts and switched the sync to match on email address, so new duplicates won't be created.", createdAt: '2026-10-21T10:00:00', attachments: [] }],
  activity: [{ id: 'a-26a', kind: 'resolved', actorId: 'u-daniel', createdAt: '2026-10-21T10:00:00', from: 'in_progress', to: 'resolved' }]
}];
