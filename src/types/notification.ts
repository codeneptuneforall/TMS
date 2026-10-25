export type NotificationKind = 'assigned' | 'reply' | 'mention' | 'status' | 'sla' | 'system';

export interface AppNotification {
  id: string;
  recipientId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  ticketId: string | null;
  actorId: string | null;
  createdAt: string;
  read: boolean;
}

export interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  category: 'ticket' | 'user' | 'team' | 'settings' | 'security';
  target: string;
  createdAt: string;
  ip: string;
}
