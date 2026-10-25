'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@/lib/router';
import { SearchIcon, CornerDownLeftIcon } from 'lucide-react';
import { useAppState, useCurrentUser } from '../../contexts/AppStateContext';
import { ticketsInScope } from '../../utils/permissions';
import { StatusBadge } from '../tickets/StatusBadge';
import { cn } from '../../utils/cn';
import type { Ticket } from '../../types/ticket';

export function matchesTicket(t: Ticket, q: string, requesterName = '', requesterEmail = ''): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const digits = s.replace(/^tkt-?0*/, '');
  return (
    t.id.toLowerCase().includes(s) ||
    digits.length > 0 && /^\d+$/.test(digits) && t.id.endsWith(digits) ||
    t.subject.toLowerCase().includes(s) ||
    requesterName.toLowerCase().includes(s) ||
    requesterEmail.toLowerCase().includes(s) ||
    t.tags.some((tag) => tag.includes(s)));

}

export function GlobalSearch() {
  const user = useCurrentUser();
  const { tickets, getUser } = useAppState();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return ticketsInScope(user, tickets).
    filter((t) => {
      const r = getUser(t.requesterId);
      return matchesTicket(t, q, r?.name, user.role === 'requester' ? '' : r?.email);
    }).
    slice(0, 6);
  }, [q, tickets, user, getUser]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, []);

  useEffect(() => setActive(0), [q]);

  const go = (path: string) => {
    setOpen(false);
    setQ('');
    inputRef.current?.blur();
    navigate(path);
  };

  const seeAll = () => go(`/queue/search?q=${encodeURIComponent(q.trim())}`);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const total = results.length + 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % total);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + total) % total);
    } else if (e.key === 'Enter' && q.trim()) {
      e.preventDefault();
      if (active < results.length) go(`/tickets/${results[active].id}`);else
      seeAll();
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showPanel = open && q.trim().length > 0;
  const placeholder = user.role === 'requester' ? 'Search your tickets' : 'Search by ticket ID, subject, or requester';

  return (
    <div ref={wrapRef} className="relative w-full max-w-md">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="global-search-results"
        aria-activedescendant={showPanel ? `gs-opt-${active}` : undefined}
        aria-label="Search tickets"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="h-9 w-full rounded-md border border-line bg-subtle pl-9 pr-9 text-[13px] text-ink placeholder:text-ink-3 transition-[border-color,background-color,box-shadow] duration-150 focus:border-accent focus:bg-surface focus:outline-none focus:ring-[3px] focus:ring-accent/15 [&::-webkit-search-cancel-button]:hidden" />
      
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-surface px-1.5 text-2xs text-ink-3 sm:block">/</kbd>

      {showPanel &&
      <div id="global-search-results" role="listbox" aria-label="Search results" className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-pop">
          {results.length === 0 && <p className="px-3 py-4 text-center text-[13px] text-ink-3">No tickets match “{q}”.</p>}
          {results.map((t, i) =>
        <button
          key={t.id}
          id={`gs-opt-${i}`}
          type="button"
          role="option"
          aria-selected={active === i}
          onMouseEnter={() => setActive(i)}
          onClick={() => go(`/tickets/${t.id}`)}
          className={cn('flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left', active === i && 'bg-muted')}>
          
              <span className="ticket-id w-[88px] shrink-0 text-[12px] text-ink-3">{t.id}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-ink">{t.subject}</span>
                <span className="block truncate text-[12px] text-ink-3">{getUser(t.requesterId)?.name}</span>
              </span>
              <StatusBadge status={t.status} className="hidden sm:inline-flex" />
            </button>
        )}
          <button
          id={`gs-opt-${results.length}`}
          type="button"
          role="option"
          aria-selected={active === results.length}
          onMouseEnter={() => setActive(results.length)}
          onClick={seeAll}
          className={cn('mt-1 flex w-full items-center justify-between rounded-md border-t border-line px-2.5 py-2 text-[13px] text-ink-2', active === results.length && 'bg-muted text-ink')}>
          
            See all results for “{q.trim()}”
            <CornerDownLeftIcon className="h-3.5 w-3.5 text-ink-3" aria-hidden />
          </button>
        </div>
      }
    </div>);

}
