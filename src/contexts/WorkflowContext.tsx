'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { toast } from 'sonner';
import { AssignDialog } from '../components/workflow/AssignDialog';
import { TeamDialog } from '../components/workflow/TeamDialog';
import { StatusDialog } from '../components/workflow/StatusDialog';
import { useAppState } from './AppStateContext';
import { needsConfirmation, PRIORITY_META, STATUS_META } from '../utils/ticketMeta';
import type { TicketPriority, TicketStatus } from '../types/ticket';

interface WorkflowValue {
  openAssign: (ids: string[]) => void;
  openTeam: (ids: string[]) => void;
  requestStatus: (ids: string[], to?: TicketStatus) => void;
  changePriority: (ids: string[], priority: TicketPriority) => Promise<void>;
}

const WorkflowContext = createContext<WorkflowValue | null>(null);

type DialogState =
{kind: 'assign';ids: string[];} |
{kind: 'team';ids: string[];} |
{kind: 'status';ids: string[];target: TicketStatus | null;} |
null;

/** Centralizes assignment, routing, and status dialogs so every screen behaves the same way. */
export function WorkflowProvider({ children }: {children: React.ReactNode;}) {
  const { tickets, setStatus, setPriority } = useAppState();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [lastIds, setLastIds] = useState<string[]>([]);

  const close = useCallback(() => setDialog(null), []);

  const openAssign = useCallback((ids: string[]) => {
    setLastIds(ids);
    setDialog({ kind: 'assign', ids });
  }, []);

  const openTeam = useCallback((ids: string[]) => {
    setLastIds(ids);
    setDialog({ kind: 'team', ids });
  }, []);

  const requestStatus = useCallback(
    async (ids: string[], to?: TicketStatus) => {
      setLastIds(ids);
      const single = ids.length === 1 ? tickets.find((t) => t.id === ids[0]) : undefined;
      if (single && to && !needsConfirmation(single.status, to)) {
        const res = await setStatus(ids, to);
        if (res.ok) toast.success(`${single.id} is now ${STATUS_META[to].label}`);else
        toast.error('Status not updated', { description: res.error });
        return;
      }
      setDialog({ kind: 'status', ids, target: to ?? null });
    },
    [tickets, setStatus]
  );

  const changePriority = useCallback(
    async (ids: string[], priority: TicketPriority) => {
      const res = await setPriority(ids, priority);
      if (res.ok) toast.success(ids.length > 1 ? `Priority set to ${PRIORITY_META[priority].label} · ${ids.length} tickets` : `Priority set to ${PRIORITY_META[priority].label}`);else
      toast.error('Priority not updated', { description: res.error });
    },
    [setPriority]
  );

  const ids = dialog?.ids ?? lastIds;

  return (
    <WorkflowContext.Provider value={{ openAssign, openTeam, requestStatus, changePriority }}>
      {children}
      <AssignDialog open={dialog?.kind === 'assign'} ticketIds={ids} onClose={close} />
      <TeamDialog open={dialog?.kind === 'team'} ticketIds={ids} onClose={close} />
      <StatusDialog open={dialog?.kind === 'status'} ticketIds={ids} target={dialog?.kind === 'status' ? dialog.target : null} onClose={close} />
    </WorkflowContext.Provider>);

}

export function useWorkflow(): WorkflowValue {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be used inside WorkflowProvider');
  return ctx;
}
