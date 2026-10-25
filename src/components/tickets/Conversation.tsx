'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronsUpDownIcon, MessagesSquareIcon } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { useCurrentUser } from '../../contexts/AppStateContext';
import type { Ticket } from '../../types/ticket';

const COLLAPSE_AFTER = 6;
const KEEP_TAIL = 3;

export function Conversation({ ticket }: {ticket: Ticket;}) {
  const user = useCurrentUser();
  const staff = user.role !== 'requester';
  const messages = staff ? ticket.messages : ticket.messages.filter((m) => m.visibility === 'public');
  const [expanded, setExpanded] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(messages.length);

  useEffect(() => setExpanded(false), [ticket.id]);

  useEffect(() => {
    if (messages.length > prevCount.current) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    prevCount.current = messages.length;
  }, [messages.length]);

  const collapsible = messages.length > COLLAPSE_AFTER && !expanded;
  const hidden = collapsible ? messages.length - KEEP_TAIL - 1 : 0;
  const visible = collapsible ? [messages[0], ...messages.slice(messages.length - KEEP_TAIL)] : messages;

  return (
    <div className="space-y-5">
      <MessageItem authorId={ticket.requesterId} body={ticket.description} createdAt={ticket.createdAt} visibility="public" attachments={ticket.attachments} isOriginal />

      {messages.length === 0 &&
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-line-strong px-4 py-4 text-[13px] text-ink-3">
          <MessagesSquareIcon className="h-4 w-4 shrink-0" aria-hidden />
          {staff ? 'No replies yet. Your first response starts the conversation with the requester.' : 'No replies yet. We’ll notify you by email when our team responds.'}
        </div>
      }

      {visible.map((m, i) =>
      <React.Fragment key={m.id}>
          {collapsible && i === 1 &&
        <div className="relative flex items-center justify-center py-1">
              <span className="absolute inset-x-0 top-1/2 h-px bg-line" aria-hidden />
              <button
            type="button"
            onClick={() => setExpanded(true)}
            className="relative inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1 text-[12px] font-medium text-ink-2 shadow-card hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
            
                <ChevronsUpDownIcon className="h-3.5 w-3.5" aria-hidden />
                Show {hidden} earlier {hidden === 1 ? 'message' : 'messages'}
              </button>
            </div>
        }
          <MessageItem authorId={m.authorId} body={m.body} createdAt={m.createdAt} visibility={m.visibility} attachments={m.attachments} />
        </React.Fragment>
      )}
      <div ref={endRef} />
    </div>);

}
