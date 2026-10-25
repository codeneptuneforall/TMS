export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type PendingReason = 'requester' | 'third_party';
export type MessageVisibility = 'public' | 'internal';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  mime: string;
}

export interface Message {
  id: string;
  authorId: string;
  visibility: MessageVisibility;
  body: string;
  createdAt: string;
  attachments: Attachment[];
}

export type ActivityKind =
'assigned' |
'team' |
'status' |
'priority' |
'reply' |
'note' |
'resolved' |
'reopened' |
'closed' |
'edited';

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  actorId: string;
  createdAt: string;
  from?: string | null;
  to?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  defaultTeamId: string;
  active: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  requesterId: string;
  assigneeId: string | null;
  teamId: string | null;
  categoryId: string;
  priority: TicketPriority;
  status: TicketStatus;
  pendingReason?: PendingReason;
  createdAt: string;
  updatedAt: string;
  dueAt: string | null;
  tags: string[];
  attachments: Attachment[];
  messages: Message[];
  activity: ActivityEvent[];
}

export interface NewTicketInput {
  subject: string;
  description: string;
  requesterId: string;
  categoryId: string;
  priority: TicketPriority;
  teamId: string | null;
  assigneeId: string | null;
  attachments: Attachment[];
}

export interface SlaPolicy {
  priority: TicketPriority;
  firstResponseHours: number;
  resolutionHours: number;
}
