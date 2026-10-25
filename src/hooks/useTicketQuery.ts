'use client';
import { useEffect, useMemo, useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { matchesTicket } from '../components/layout/GlobalSearch';
import { PRIORITY_META, STATUS_ORDER } from '../utils/ticketMeta';
import type { Ticket, TicketPriority, TicketStatus } from '../types/ticket';

export interface TicketFilters {
  statuses: TicketStatus[];
  priorities: TicketPriority[];
  assignees: string[]; // user ids or 'unassigned'
  teams: string[];
}

export type FilterKey = keyof TicketFilters;
export type SortKey = 'id' | 'subject' | 'requester' | 'assignee' | 'priority' | 'status' | 'createdAt' | 'updatedAt' | 'dueAt';
export interface SortState {
  key: SortKey;
  dir: 'asc' | 'desc';
}

const EMPTY: TicketFilters = { statuses: [], priorities: [], assignees: [], teams: [] };

/** Client-side stand-in for GET /tickets?status=&priority=&assignee=&q=&sort=&page= */
export function useTicketQuery(base: Ticket[], resetKey: string, pageSize: number, initialSearch = '') {
  const { getUser } = useAppState();
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<TicketFilters>(EMPTY);
  const [sort, setSortState] = useState<SortState>({ key: 'updatedAt', dir: 'desc' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearch(initialSearch);
    setFilters(EMPTY);
    setPage(1);
  }, [resetKey, initialSearch]);

  useEffect(() => setPage(1), [search, filters]);

  const filtered = useMemo(() => {
    return base.filter((t) => {
      if (filters.statuses.length && !filters.statuses.includes(t.status)) return false;
      if (filters.priorities.length && !filters.priorities.includes(t.priority)) return false;
      if (filters.teams.length && !(t.teamId && filters.teams.includes(t.teamId))) return false;
      if (filters.assignees.length) {
        const key = t.assigneeId ?? 'unassigned';
        if (!filters.assignees.includes(key)) return false;
      }
      if (search.trim()) {
        const r = getUser(t.requesterId);
        if (!matchesTicket(t, search, r?.name, r?.email)) return false;
      }
      return true;
    });
  }, [base, filters, search, getUser]);

  const sorted = useMemo(() => {
    const dir = sort.dir === 'asc' ? 1 : -1;
    const value = (t: Ticket): string | number => {
      switch (sort.key) {
        case 'priority':
          return PRIORITY_META[t.priority].level;
        case 'status':
          return STATUS_ORDER.indexOf(t.status);
        case 'requester':
          return getUser(t.requesterId)?.name ?? '';
        case 'assignee':
          return getUser(t.assigneeId)?.name ?? '~';
        case 'dueAt':
          return t.dueAt ?? '9999';
        default:
          return t[sort.key];
      }
    };
    return [...filtered].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [filtered, sort, getUser]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const rows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggle = <K extends FilterKey,>(key: K, value: TicketFilters[K][number]) => {
    setFilters((f) => {
      const list = f[key] as string[];
      const next = list.includes(value as string) ? list.filter((v) => v !== value) : [...list, value as string];
      return { ...f, [key]: next };
    });
  };

  const clear = (key: FilterKey) => setFilters((f) => ({ ...f, [key]: [] }));
  const resetAll = () => {
    setFilters(EMPTY);
    setSearch('');
  };

  const setSort = (key: SortKey) =>
  setSortState((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'subject' || key === 'requester' || key === 'assignee' ? 'asc' : 'desc' });

  const activeCount = filters.statuses.length + filters.priorities.length + filters.assignees.length + filters.teams.length + (search.trim() ? 1 : 0);

  return {
    search,
    setSearch,
    filters,
    toggle,
    clear,
    resetAll,
    activeCount,
    sort,
    setSort,
    page: safePage,
    setPage,
    pageCount,
    pageSize,
    total: sorted.length,
    rows,
    all: sorted
  };
}

export type TicketQuery = ReturnType<typeof useTicketQuery>;
