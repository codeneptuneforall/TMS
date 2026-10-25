'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from '@/lib/router';
import { CircleCheckBigIcon, FilterXIcon, InboxIcon, PlusIcon, SearchXIcon, TicketIcon } from 'lucide-react';
import { PageContainer, PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState } from '../components/ui/States';
import { Pagination } from '../components/ui/Pagination';
import { Button, ButtonLink } from '../components/ui/Button';
import { TicketFilterBar } from '../components/tickets/TicketFilterBar';
import { TicketTable, TicketTableSkeleton } from '../components/tickets/TicketTable';
import { TicketCardList } from '../components/tickets/TicketCardList';
import { BulkActionBar } from '../components/tickets/BulkActionBar';
import { useAppState, useCurrentUser } from '../contexts/AppStateContext';
import { useTicketQuery } from '../hooks/useTicketQuery';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import { QUEUE_VIEWS, ticketsForView, viewAllowed, type QueueView } from '../utils/permissions';
import { queueViewMeta } from '../data/navigation';
import { NotFound } from './system/NotFound';
import { Unauthorized } from './system/Unauthorized';

const PAGE_SIZE = 10;

export function TicketQueue() {
  const { view: rawView = 'all' } = useParams();
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const user = useCurrentUser();
  const { tickets, teams, simulateErrors } = useAppState();
  const view = (QUEUE_VIEWS as string[]).includes(rawView) ? rawView as QueueView : null;

  const base = useMemo(() => view ? ticketsForView(view, user, tickets) : [], [view, user, tickets]);
  const query = useTicketQuery(base, `${view}`, PAGE_SIZE, view === 'search' ? q : '');
  const [loading, reload] = useSimulatedLoading(`${view}-${q}`);
  const [selected, setSelected] = useState<string[]>([]);
  const [errorDismissed, setErrorDismissed] = useState(false);

  useEffect(() => setSelected([]), [view, q]);
  useEffect(() => setSelected((s) => s.filter((id) => base.some((t) => t.id === id))), [base]);

  if (!view) return <NotFound inShell />;
  if (!viewAllowed(view, user)) return <Unauthorized inShell />;

  const staff = user.role !== 'requester';
  const meta = queueViewMeta[view];
  const showError = simulateErrors && !errorDismissed && !loading;
  const myTeams = teams.filter((t) => user.teamIds.includes(t.id));

  const description =
  view === 'search' && q ?
  <>
        Results for <span className="font-medium text-ink">“{q}”</span> across {staff ? 'tickets you can access' : 'your requests'}.
      </> :
  view === 'team' && staff && myTeams.length > 0 ?
  `Tickets routed to ${myTeams.map((t) => t.name).join(', ')}.` :
  staff ?
  meta.staff :

  meta.requester;


  return (
    <PageContainer wide>
      <PageHeader
        title={meta.title}
        description={description}
        actions={
        !staff &&
        <ButtonLink to="/tickets/new" variant="primary" size="sm" leadingIcon={<PlusIcon className="h-4 w-4" />}>
              New ticket
            </ButtonLink>

        } />
      

      <div className="space-y-3">
        {staff && selected.length > 0 ? <BulkActionBar selected={selected} onClear={() => setSelected([])} /> : <TicketFilterBar query={query} base={base} />}

        {loading ?
        <TicketTableSkeleton /> :
        showError ?
        <div className="rounded-lg border border-line bg-surface">
            <ErrorState
            title="Couldn’t load tickets"
            description="The ticket service didn’t respond. Your filters are kept — try again in a moment."
            onRetry={() => {
              setErrorDismissed(true);
              reload();
            }} />
          
          </div> :
        query.total === 0 ?
        <div className="rounded-lg border border-line bg-surface">
            {base.length > 0 || view === 'search' && q ?
          <EmptyState
            icon={view === 'search' ? <SearchXIcon /> : <FilterXIcon />}
            title={view === 'search' && query.activeCount <= 1 ? `No tickets match “${query.search || q}”` : 'No tickets match these filters'}
            description="Try a different ticket ID, subject keyword, or requester name — or clear filters to see everything."
            action={<Button size="sm" onClick={query.resetAll}>Reset filters</Button>} /> :


          <QueueEmpty view={view} staff={staff} />
          }
          </div> :

        <>
            <TicketTable rows={query.rows} sort={query.sort} onSort={query.setSort} selected={selected} onSelectedChange={setSelected} />
            <TicketCardList rows={query.rows} />
            <Pagination page={query.page} pageCount={query.pageCount} total={query.total} pageSize={PAGE_SIZE} onChange={query.setPage} />
          </>
        }
      </div>
    </PageContainer>);

}

function QueueEmpty({ view, staff }: {view: QueueView;staff: boolean;}) {
  if (view === 'mine' && !staff)
  return (
    <EmptyState
      icon={<TicketIcon />}
      title="You haven’t submitted any tickets yet"
      description="Describe what you need help with and our support team will get back to you."
      action={
      <ButtonLink to="/tickets/new" variant="primary" size="sm">
            Create a ticket
          </ButtonLink>
      } />);


  if (view === 'mine')
  return (
    <EmptyState
      icon={<InboxIcon />}
      title="No tickets assigned to you"
      description="Tickets you own will appear here. Pick one up from the unassigned queue."
      action={
      <ButtonLink to="/queue/unassigned" size="sm">
            View unassigned
          </ButtonLink>
      } />);


  if (view === 'unassigned')
  return <EmptyState icon={<CircleCheckBigIcon />} title="Every active ticket has an owner" description="New tickets that aren’t auto-assigned will land here." />;
  if (view === 'search') return <EmptyState icon={<SearchXIcon />} title="Search for a ticket" description="Use the search bar to find tickets by ID, subject, or requester." />;
  return <EmptyState icon={<InboxIcon />} title={`No ${queueViewMeta[view].title.toLowerCase()} tickets`} description="Tickets will appear here as their status changes." />;
}
