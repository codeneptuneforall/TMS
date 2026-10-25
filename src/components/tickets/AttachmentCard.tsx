'use client';
import React, { useState } from 'react';
import { DownloadIcon, FileIcon, FileJsonIcon, FileSpreadsheetIcon, FileTextIcon, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { formatBytes } from '../../utils/time';
import { imagePreviews, textPreviews } from '../../data/attachmentPreviews';
import type { Attachment } from '../../types/ticket';

export function fileIcon(mime: string, className = 'h-4 w-4') {
  if (mime.startsWith('image/')) return <ImageIcon className={className} aria-hidden />;
  if (mime.includes('csv') || mime.includes('excel') || mime.includes('sheet')) return <FileSpreadsheetIcon className={className} aria-hidden />;
  if (mime.includes('json')) return <FileJsonIcon className={className} aria-hidden />;
  if (mime.includes('pdf') || mime.startsWith('text/')) return <FileTextIcon className={className} aria-hidden />;
  return <FileIcon className={className} aria-hidden />;
}

export function AttachmentCard({ attachment }: {attachment: Attachment;}) {
  const [open, setOpen] = useState(false);
  const isImage = attachment.mime.startsWith('image/');
  const imageSrc = isImage ? imagePreviews[attachment.id] ?? imagePreviews.default : null;
  const text = textPreviews[attachment.id];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full min-w-0 items-center gap-2.5 rounded-md border border-line bg-surface p-2 text-left transition-colors duration-150 hover:border-line-strong hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 sm:w-[240px]"
        aria-label={`Preview ${attachment.name}, ${formatBytes(attachment.size)}`}>
        
        {imageSrc ?
        <img src={imageSrc} alt="" className="h-9 w-12 shrink-0 rounded border border-line object-cover object-top" /> :

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted text-ink-2">{fileIcon(attachment.mime)}</span>
        }
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-ink">{attachment.name}</span>
          <span className="block text-[12px] tabular-nums text-ink-3">{formatBytes(attachment.size)}</span>
        </span>
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={attachment.name}
        description={`${formatBytes(attachment.size)} · ${attachment.mime}`}
        footer={
        <>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button
            variant="primary"
            leadingIcon={<DownloadIcon className="h-4 w-4" />}
            onClick={() => toast('Downloads are disabled in the prototype', { description: 'In production this streams the file from secure storage.' })}>
            
              Download
            </Button>
          </>
        }>
        
        {imageSrc ?
        <img src={imageSrc} alt={`Preview of ${attachment.name}`} className="w-full rounded-md border border-line" /> :
        text ?
        <pre className="ticket-id max-h-[50vh] overflow-auto whitespace-pre rounded-md border border-line bg-subtle p-3 text-[12px] leading-5 text-ink-2">{text}</pre> :

        <div className="flex flex-col items-center rounded-md border border-dashed border-line-strong bg-subtle px-6 py-12 text-center">
            <span className="mb-2 text-ink-3">{fileIcon(attachment.mime, 'h-6 w-6')}</span>
            <p className="text-[13px] font-medium text-ink">No inline preview for this file type</p>
            <p className="mt-0.5 text-[12px] text-ink-3">Download the file to open it.</p>
          </div>
        }
      </Dialog>
    </>);

}
