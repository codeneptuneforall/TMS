'use client';
import React from 'react';
import { PlusIcon } from 'lucide-react';
import { PageContainer, PageHeader } from '../components/ui/PageHeader';
import { ButtonLink } from '../components/ui/Button';
import { Skeleton, ErrorState } from '../components/ui/States';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { AgentDashboard } from '../components/dashboard/AgentDashboard';
import { RequesterDashboard } from '../components/dashboard/RequesterDashboard';
import { useAppState, useCurrentUser } from '../contexts/AppStateContext';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import { greeting } from '../utils/time';
import { format } from 'date-fns';
import { currentTime } from '../utils/time';

export function Overview() {
  const user = useCurrentUser();
  const { simulateErrors } = useAppState();
  const [loading, reload] = useSimulatedLoading(`overview-${user.id}`, 420);
  const [dismissed, setDismissed] = React.useState(false);
  const first = user.name.split(' ')[0];

  const description =
  user.role === 'admin' ?
  'Organization-wide view of Cadence Support.' :
  user.role === 'agent' ?
  'Your queue and what needs you next.' :
  `Track your requests with Cadence Support.`;

  return (
    <PageContainer wide>
      <PageHeader
        title={`${greeting()}, ${first}`}
        description={<>{format(currentTime(), 'EEEE, MMMM d')} · {description}</>}
        actions={user.role === 'requester' ? <ButtonLink to="/tickets/new" variant="primary" leadingIcon={<PlusIcon className="h-4 w-4" />}>Create ticket</ButtonLink> : undefined} />
      
      {loading ?
      <DashboardSkeleton /> :
      simulateErrors && !dismissed ?
      <div className="rounded-lg border border-line bg-surface">
          <ErrorState title="Dashboard unavailable" description="We couldn’t load your metrics. Tickets are still accessible from the sidebar." onRetry={() => {setDismissed(true);reload();}} />
        </div> :
      user.role === 'admin' ?
      <AdminDashboard /> :
      user.role === 'agent' ?
      <AgentDashboard /> :

      <RequesterDashboard />
      }
    </PageContainer>);

}

function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) =>
        <div key={i} className="space-y-2 bg-surface px-4 py-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-10" />
          </div>
        )}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-3 rounded-lg border border-line bg-surface p-5 xl:col-span-2">
          <Skeleton className="h-4 w-40" />
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </div>
        <div className="space-y-3 rounded-lg border border-line bg-surface p-5">
          <Skeleton className="h-4 w-24" />
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
        </div>
      </div>
    </div>);

}
