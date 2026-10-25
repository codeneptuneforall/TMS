'use client';
import React, { useMemo } from 'react';
import { Link } from '@/lib/router';
import { CircleCheckBigIcon, MessagesSquareIcon, PlusIcon, ReplyIcon, TicketIcon } from 'lucide-react';
import { Panel } from './Panel';
import { TicketMiniList } from './TicketMiniList';
import { ButtonLink } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { EmptyState } from '../ui/States';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { awaitingRequester, lastPublicMessage } from '../../utils/permissions';
import { relativeTime } from '../../utils/time';
import { isActive } from '../../utils/ticketMeta';

export function RequesterDashboard() {
  const user = useCurrentUser();
  const { tickets, getUser } = useAppState();

  const data = useMemo(() => {
    const mine = tickets.filter((t) => t.requesterId === user.id);
    const conversations = mine.
    map((t) => ({ ticket: t, last: lastPublicMessage(t) })).
    filter((c) => c.last && c.last.authorId !== user.id).
    sort((a, b) => b.last!.createdAt.localeCompare(a.last!.createdAt)).
    slice(0, 4);
    return {
      open: mine.filter((t) => isActive(t.status) && !awaitingRequester(t)),
      needsReply: mine.filter(awaitingRequester),
      resolved: mine.filter((t) => t.status === 'resolved').slice(0, 4),
      conversations
    };
  }, [tickets, user.id]);

  return (
    <div className="space-y-5">
      {data.needsReply.length > 0 &&
      <section aria-labelledby="needs-reply" className="overflow-hidden rounded-lg border border-warning/30 bg-warning-soft">
          <h2 id="needs-reply" className="flex items-center gap-2 px-4 pt-3.5 text-[14px] font-semibold text-warning-fg sm:px-5">
            <ReplyIcon className="h-4 w-4" aria-hidden />
            {data.needsReply.length === 1 ? 'Our team needs your reply' : `Our team needs your reply on ${data.needsReply.length} tickets`}
          </h2>
          <ul className="mt-2 divide-y divide-warning/20 border-t border-warning/20">
            {data.needsReply.map((t) => {
            const last = lastPublicMessage(t);
            return (
              <li key={t.id}>
                  <Link to={`/tickets/${t.id}`} className="flex flex-col gap-1 px-4 py-3 hover:bg-warning/10 focus-visible:bg-warning/10 focus-visible:outline-none sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-ink">{t.subject}</span>
                      {last && <span className="mt-0.5 block truncate text-[12px] text-ink-2">{getUser(last.authorId)?.name}: “{last.body}”</span>}
                    </span>
                    <span className="shrink-0 text-[12px] font-medium text-warning-fg">Reply now →</span>
                  </Link>
                </li>);

          })}
          </ul>
        </section>
      }

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Panel title="Open requests" description="Our team is working on these." action={{ label: 'All my tickets', to: '/queue/mine' }}>
            <TicketMiniList
              tickets={data.open}
              subline={(t) => t.assigneeId ? `${getUser(t.assigneeId)?.name} is handling this` : 'In the queue — an agent will pick it up soon'}
              empty={{ icon: <TicketIcon />, title: 'No open requests', description: 'Need help with something? Create a ticket and we’ll get on it.' }} />
            
          </Panel>
          <Panel title="Recent conversations" description="Latest replies from our support team.">
            {data.conversations.length === 0 ?
            <EmptyState compact icon={<MessagesSquareIcon />} title="No replies yet" description="When an agent replies, you’ll see it here and by email." /> :

            <ul className="divide-y divide-line border-t border-line">
                {data.conversations.map(({ ticket, last }) => {
                const author = getUser(last!.authorId);
                return (
                  <li key={ticket.id}>
                      <Link to={`/tickets/${ticket.id}`} className="flex gap-3 px-4 py-3 hover:bg-subtle focus-visible:bg-muted focus-visible:outline-none sm:px-5">
                        <Avatar name={author?.name ?? '?'} id={author?.id} size="md" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline gap-2">
                            <span className="truncate text-[13px] font-medium text-ink">{author?.name}</span>
                            <span className="ticket-id shrink-0 text-2xs text-ink-3">{ticket.id}</span>
                            <span className="ml-auto shrink-0 text-[12px] tabular-nums text-ink-3">{relativeTime(last!.createdAt)}</span>
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-[13px] leading-5 text-ink-2">{last!.body}</span>
                        </span>
                      </Link>
                    </li>);

              })}
              </ul>
            }
          </Panel>
        </div>
        <div className="space-y-5">
          <section className="rounded-lg border border-line bg-surface p-5 shadow-card">
            <h2 className="text-[14px] font-semibold text-ink">Something else going on?</h2>
            <p className="mt-1 text-[13px] leading-5 text-ink-3">Describe the issue and attach screenshots or logs. Most tickets get a first reply within a few hours.</p>
            <ButtonLink to="/tickets/new" variant="primary" className="mt-4 w-full" leadingIcon={<PlusIcon className="h-4 w-4" />}>
              Create ticket
            </ButtonLink>
          </section>
          <Panel title="Recently resolved" action={{ label: 'View all', to: '/queue/resolved' }}>
            <TicketMiniList tickets={data.resolved} empty={{ icon: <CircleCheckBigIcon />, title: 'Nothing resolved yet' }} />
          </Panel>
        </div>
      </div>
    </div>);

}
