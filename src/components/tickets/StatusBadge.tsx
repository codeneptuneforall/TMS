'use client';
import React from 'react';
import { Badge } from '../ui/Badge';
import { STATUS_META } from '../../utils/ticketMeta';
import type { TicketStatus } from '../../types/ticket';

export function StatusBadge({ status, className }: {status: TicketStatus;className?: string;}) {
  const meta = STATUS_META[status];
  return (
    <Badge tone={meta.tone} dot className={className}>
      {meta.label}
    </Badge>);

}
