'use client';
import React from 'react';
import { useAppState, useCurrentUser } from '@/contexts/AppStateContext';
import { isManager } from '@/utils/permissions';

export default function EscalationsPage() {
  const { tickets } = useAppState();
  const user = useCurrentUser();
  if (!isManager(user)) return <div className="p-6">Not authorized</div>;
  const escalated = tickets.filter((t: any) => t.escalation);
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Escalations</h1>
      <table className="w-full text-sm">
        <thead><tr><th>Ticket</th><th>Subject</th><th>Reason</th><th>State</th></tr></thead>
        <tbody>
          {escalated.map((t: any) => (
            <tr key={t.id}><td>{t.id}</td><td>{t.subject}</td><td>{t.escalation?.reason}</td><td>{t.escalation?.state}</td></tr>
          ))}
        </tbody>
      </table>
      {escalated.length === 0 && <p className="mt-4 text-ink-3">No escalations.</p>}
    </div>
  );
}
