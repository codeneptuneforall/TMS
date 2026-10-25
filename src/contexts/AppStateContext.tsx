'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_USER_BY_ROLE } from '../data/users';
import { uid } from '../utils/cn';
import { addHoursIso, nowIso } from '../utils/time';

import type {
  ActivityEvent,
  ActivityKind,
  Attachment,
  Category,
  Message,
  MessageVisibility,
  NewTicketInput,
  PendingReason,
  Ticket,
  TicketPriority,
  TicketStatus } from
'../types/ticket';
import type { Role, Team, User } from '../types/user';
import type { AppNotification } from '../types/notification';

export type Density = 'comfortable' | 'compact';
export type Result<T = undefined> = {ok: true;data: T;} | {ok: false;error: string;};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface AppStateValue {
  currentUser: User | null;
  users: User[];
  teams: Team[];
  categories: Category[];
  tickets: Ticket[];
  notifications: AppNotification[];
  density: Density;
  simulateErrors: boolean;
  signIn: (email: string) => Promise<Result<User>>;
  signOut: () => void;
  getUser: (id: string | null | undefined) => User | undefined;
  getTeam: (id: string | null | undefined) => Team | undefined;
  getCategory: (id: string | null | undefined) => Category | undefined;
  getTicket: (id: string | undefined) => Ticket | undefined;
  setStatus: (ids: string[], status: TicketStatus, opts?: {note?: string;pendingReason?: PendingReason;}) => Promise<Result>;
  setPriority: (ids: string[], priority: TicketPriority) => Promise<Result>;
  assign: (ids: string[], assigneeId: string | null, teamId?: string | null) => Promise<Result>;
  setTeam: (ids: string[], teamId: string) => Promise<Result>;
  updateTicket: (id: string, patch: Partial<Pick<Ticket, 'subject' | 'categoryId' | 'tags'>>) => Promise<Result>;
  addMessage: (id: string, input: {body: string;visibility: MessageVisibility;attachments: Attachment[];}) => Promise<Result<Message>>;
  createTicket: (input: NewTicketInput) => Promise<Result<Ticket>>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  saveUser: (user: User) => Promise<Result>;
  saveTeam: (team: Team) => Promise<Result>;
  saveCategories: (next: Category[]) => Promise<Result>;
}

const AppStateContext = createContext<AppStateValue | null>(null);

const NETWORK_ERROR = "We couldn't reach the server. Check your connection and try again.";

interface ProviderProps {
  role: Role;
  density: Density;
  simulateErrors: boolean;
  children: React.ReactNode;
}

export function AppStateProvider({ role, density, simulateErrors, children }: ProviderProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(DEFAULT_USER_BY_ROLE[role]);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setCurrentUserId(DEFAULT_USER_BY_ROLE[role]);
  }, [role]);

  const apiFetch = useCallback(async (path: string, init?: RequestInit) => {
    if (simulateErrors) throw new Error(NETWORK_ERROR);
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed (${res.status})`);
    }
    return res.json();
  }, [simulateErrors]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [u, t, c, tk, n] = await Promise.all([
          apiFetch('/users'),
          apiFetch('/teams'),
          apiFetch('/categories'),
          apiFetch('/tickets'),
          apiFetch('/notifications'),
        ]);
        if (cancelled) return;
        setUsers(u);
        setTeams(t);
        setCategories(c);
        setTickets(tk);
        setNotifications(n);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { cancelled = true; };
  }, [apiFetch]);

  const currentUser = useMemo(() => users.find((u) => u.id === currentUserId) ?? null, [users, currentUserId]);

  const request = useCallback(async (): Promise<string | null> => {
    if (simulateErrors) return NETWORK_ERROR;
    return null;
  }, [simulateErrors]);

  const signIn = useCallback(
    async (email: string): Promise<Result<User>> => {
      try {
        const user = await apiFetch('/auth/signin', { method: 'POST', body: JSON.stringify({ email }) });
        setCurrentUserId(user.id);
        return { ok: true, data: user };
      } catch (e: any) {
        return { ok: false, error: e?.message || 'Sign in failed' };
      }
    },
    [apiFetch]
  );

  const signOut = useCallback(() => setCurrentUserId(null), []);

  const getUser = useCallback((id: string | null | undefined) => id ? users.find((u) => u.id === id) : undefined, [users]);
  const getTeam = useCallback((id: string | null | undefined) => id ? teams.find((t) => t.id === id) : undefined, [teams]);
  const getCategory = useCallback((id: string | null | undefined) => id ? categories.find((c) => c.id === id) : undefined, [categories]);
  const getTicket = useCallback((id: string | undefined) => tickets.find((t) => t.id === id), [tickets]);

  const refreshTickets = useCallback(async () => {
    const tk = await apiFetch('/tickets');
    setTickets(tk);
  }, [apiFetch]);

  const setStatus: AppStateValue['setStatus'] = useCallback(
    async (ids, status, opts) => {
      const err = await request();
      if (err) return { ok: false, error: err };
      try {
        await Promise.all(ids.map((id) =>
          apiFetch(`/tickets/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, note: opts?.note, pendingReason: opts?.pendingReason, actorId: currentUserId }),
          })
        ));
        await refreshTickets();
        return { ok: true, data: undefined };
      } catch (e: any) {
        return { ok: false, error: e?.message || NETWORK_ERROR };
      }
    },
    [request, apiFetch, currentUserId, refreshTickets]
  );

  const setPriority: AppStateValue['setPriority'] = useCallback(
    async (ids, priority) => {
      const err = await request();
      if (err) return { ok: false, error: err };
      try {
        await Promise.all(ids.map((id) =>
          apiFetch(`/tickets/${id}/priority`, {
            method: 'PATCH',
            body: JSON.stringify({ priority, actorId: currentUserId }),
          })
        ));
        await refreshTickets();
        return { ok: true, data: undefined };
      } catch (e: any) {
        return { ok: false, error: e?.message || NETWORK_ERROR };
      }
    },
    [request, apiFetch, currentUserId, refreshTickets]
  );

  const assign: AppStateValue['assign'] = useCallback(
    async (ids, assigneeId, teamId) => {
      const err = await request();
      if (err) return { ok: false, error: err };
      try {
        await Promise.all(ids.map((id) =>
          apiFetch(`/tickets/${id}/assign`, {
            method: 'PATCH',
            body: JSON.stringify({ assigneeId, teamId, actorId: currentUserId }),
          })
        ));
        await refreshTickets();
        return { ok: true, data: undefined };
      } catch (e: any) {
        return { ok: false, error: e?.message || NETWORK_ERROR };
      }
    },
    [request, apiFetch, currentUserId, refreshTickets]
  );

  const setTeam: AppStateValue['setTeam'] = useCallback(
    async (ids, teamId) => {
      const err = await request();
      if (err) return { ok: false, error: err };
      try {
        await Promise.all(ids.map((id) =>
          apiFetch(`/tickets/${id}/team`, {
            method: 'PATCH',
            body: JSON.stringify({ teamId, actorId: currentUserId }),
          })
        ));
        await refreshTickets();
        return { ok: true, data: undefined };
      } catch (e: any) {
        return { ok: false, error: e?.message || NETWORK_ERROR };
      }
    },
    [request, apiFetch, currentUserId, refreshTickets]
  );

  const updateTicket: AppStateValue['updateTicket'] = useCallback(
    async (id, patch) => {
      const err = await request();
      if (err) return { ok: false, error: err };
      try {
        await apiFetch(`/tickets/${id}/details`, {
          method: 'PATCH',
          body: JSON.stringify({ subject: patch.subject, categoryId: patch.categoryId, tags: patch.tags, actorId: currentUserId }),
        });
        await refreshTickets();
        return { ok: true, data: undefined };
      } catch (e: any) {
        return { ok: false, error: e?.message || NETWORK_ERROR };
      }
    },
    [request, apiFetch, currentUserId, refreshTickets]
  );

  const addMessage: AppStateValue['addMessage'] = useCallback(
    async (id, input) => {
      const err = await request();
      if (err) return { ok: false, error: err };
      try {
        const ticket = tickets.find((t) => t.id === id);
        const res = await apiFetch(`/tickets/${id}/messages`, {
          method: 'POST',
          body: JSON.stringify({ body: input.body, visibility: input.visibility, attachments: input.attachments, actorId: currentUserId, requesterId: ticket?.requesterId }),
        });
        await refreshTickets();
        return { ok: true, data: res.data };
      } catch (e: any) {
        return { ok: false, error: e?.message || NETWORK_ERROR };
      }
    },
    [request, apiFetch, currentUserId, tickets, refreshTickets]
  );

  const createTicket: AppStateValue['createTicket'] = useCallback(
    async (input) => {
      const err = await request();
      if (err) return { ok: false, error: err };
      try {
        const ticket = await apiFetch('/tickets', {
          method: 'POST',
          body: JSON.stringify(input),
        });
        setTickets((prev) => [ticket, ...prev]);
        return { ok: true, data: ticket };
      } catch (e: any) {
        return { ok: false, error: e?.message || NETWORK_ERROR };
      }
    },
    [request, apiFetch]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    apiFetch(`/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {});
  }, [apiFetch]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => n.recipientId === currentUserId ? { ...n, read: true } : n));
    apiFetch(`/notifications/read-all?recipientId=${currentUserId}`, { method: 'PATCH' }).catch(() => {});
  }, [apiFetch, currentUserId]);

  const saveUser: AppStateValue['saveUser'] = useCallback(
    async (user) => {
      const err = await request();
      if (err) return { ok: false, error: err };
      try {
        const saved = await apiFetch(`/users/${user.id}`, { method: 'PUT', body: JSON.stringify(user) });
        setUsers((prev) => prev.some((u) => u.id === user.id) ? prev.map((u) => u.id === user.id ? saved : u) : [...prev, saved]);
        const t = await apiFetch('/teams');
        setTeams(t);
        return { ok: true, data: undefined };
      } catch (e: any) {
        return { ok: false, error: e?.message || NETWORK_ERROR };
      }
    },
    [request, apiFetch]
  );

  const saveTeam: AppStateValue['saveTeam'] = useCallback(
    async (team) => {
      const err = await request();
      if (err) return { ok: false, error: err };
      try {
        const saved = await apiFetch(`/teams/${team.id}`, { method: 'PUT', body: JSON.stringify(team) });
        setTeams((prev) => prev.some((t) => t.id === team.id) ? prev.map((t) => t.id === team.id ? saved : t) : [...prev, saved]);
        const u = await apiFetch('/users');
        setUsers(u);
        return { ok: true, data: undefined };
      } catch (e: any) {
        return { ok: false, error: e?.message || NETWORK_ERROR };
      }
    },
    [request, apiFetch]
  );

  const saveCategories: AppStateValue['saveCategories'] = useCallback(
    async (next) => {
      const err = await request();
      if (err) return { ok: false, error: err };
      try {
        const saved = await apiFetch('/categories', { method: 'PUT', body: JSON.stringify(next) });
        setCategories(saved);
        return { ok: true, data: undefined };
      } catch (e: any) {
        return { ok: false, error: e?.message || NETWORK_ERROR };
      }
    },
    [request, apiFetch]
  );

  const myNotifications = useMemo(
    () => notifications.filter((n) => n.recipientId === currentUserId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [notifications, currentUserId]
  );

  const value: AppStateValue = {
    currentUser,
    users,
    teams,
    categories,
    tickets,
    notifications: myNotifications,
    density,
    simulateErrors,
    signIn: signIn as any,
    signOut,
    getUser,
    getTeam,
    getCategory,
    getTicket,
    setStatus,
    setPriority,
    assign,
    setTeam,
    updateTicket,
    addMessage,
    createTicket,
    markNotificationRead,
    markAllNotificationsRead,
    saveUser,
    saveTeam,
    saveCategories
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}

export function useCurrentUser(): User {
  const { currentUser } = useAppState();
  if (!currentUser) throw new Error('No signed-in user');
  return currentUser;
}
