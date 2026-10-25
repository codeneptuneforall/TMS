'use client';
import React from 'react';
import { LockIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { AttachmentCard } from './AttachmentCard';
import { useAppState } from '../../contexts/AppStateContext';
import { formatDateTime, relativeTime } from '../../utils/time';
import { cn } from '../../utils/cn';
import type { Attachment, MessageVisibility } from '../../types/ticket';

interface MessageItemProps {
  authorId: string;
  body: string;
  createdAt: string;
  visibility: MessageVisibility;
  attachments: Attachment[];
  isOriginal?: boolean;
}

export function MessageItem({ authorId, body, createdAt, visibility, attachments, isOriginal }: MessageItemProps) {
  const { getUser } = useAppState();
  const author = getUser(authorId);
  const internal = visibility === 'internal';
  const roleLabel = author?.role === 'requester' ? author.organization : 'Support';

  return (
    <article
      aria-label={internal ? `Internal note from ${author?.name}` : `Message from ${author?.name}`}
      className={cn('relative flex gap-3', internal ? 'rounded-lg border border-warning/30 bg-warning-soft px-3 py-3 sm:px-4' : 'px-0 py-1')}>
      
      <Avatar name={author?.name ?? 'Unknown'} id={authorId} size="md" className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[13px] font-semibold text-ink">{author?.name ?? 'Deleted user'}</span>
          <span className={cn('text-[12px]', author?.role === 'requester' ? 'text-ink-3' : 'text-accent-fg')}>{roleLabel}</span>
          {internal &&
          <span className="inline-flex items-center gap-1 rounded bg-warning/15 px-1.5 py-px text-2xs font-semibold text-warning-fg">
              <LockIcon className="h-3 w-3" aria-hidden />
              Internal note · staff only
            </span>
          }
          {isOriginal && <span className="text-[12px] text-ink-3">opened this ticket</span>}
          <time dateTime={createdAt} title={formatDateTime(createdAt)} className="ml-auto text-[12px] tabular-nums text-ink-3">
            {relativeTime(createdAt)}
          </time>
        </header>
        <div className="mt-1.5 whitespace-pre-wrap break-words text-[14px] leading-6 text-ink">{body}</div>
        {attachments.length > 0 &&
        <div className="mt-3 flex flex-wrap gap-2">
            {attachments.map((a) =>
          <AttachmentCard key={a.id} attachment={a} />
          )}
          </div>
        }
      </div>
    </article>);

}
