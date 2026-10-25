'use client';
import React from 'react';
import { AlertCircleIcon, CheckCircle2Icon, RotateCwIcon, XIcon } from 'lucide-react';
import { fileIcon } from './AttachmentCard';
import { formatBytes } from '../../utils/time';
import { cn } from '../../utils/cn';
import type { UploadItem } from '../../hooks/useAttachmentUploads';

interface UploadListProps {
  items: UploadItem[];
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

export function UploadList({ items, onRetry, onRemove }: UploadListProps) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Attachments">
      {items.map((i) =>
      <li
        key={i.id}
        className={cn(
          'relative flex w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-md border bg-surface py-1.5 pl-2 pr-1 sm:w-[260px]',
          i.status === 'failed' ? 'border-danger/40' : 'border-line'
        )}>
        
          <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded', i.status === 'failed' ? 'bg-danger-soft text-danger-fg' : 'bg-muted text-ink-2')}>
            {i.status === 'failed' ? <AlertCircleIcon className="h-4 w-4" aria-hidden /> : fileIcon(i.mime)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium text-ink">{i.name}</span>
            <span className={cn('block truncate text-2xs', i.status === 'failed' ? 'text-danger-fg' : 'text-ink-3')} aria-live="polite">
              {i.status === 'failed' ? i.error : i.status === 'uploading' ? `Uploading… ${i.progress}%` : formatBytes(i.size)}
            </span>
          </span>
          {i.status === 'done' && <CheckCircle2Icon className="h-4 w-4 shrink-0 text-success" aria-label="Uploaded" />}
          {i.status === 'failed' && i.retryable &&
        <button type="button" onClick={() => onRetry(i.id)} aria-label={`Retry uploading ${i.name}`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-ink-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
              <RotateCwIcon className="h-3.5 w-3.5" />
            </button>
        }
          <button type="button" onClick={() => onRemove(i.id)} aria-label={`Remove ${i.name}`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-ink-3 hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
            <XIcon className="h-3.5 w-3.5" />
          </button>
          {i.status === 'uploading' &&
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-muted" aria-hidden>
              <span className="block h-full bg-accent transition-[width] duration-150 ease-out" style={{ width: `${i.progress}%` }} />
            </span>
        }
        </li>
      )}
    </ul>);

}
