'use client';
import React from 'react';
import { useParams } from '@/lib/router';
import { BellIcon, BuildingIcon, GitBranchIcon, ScrollTextIcon, ShieldIcon, SignalIcon, TagsIcon, UserCogIcon } from 'lucide-react';
import { PageContainer, PageHeader } from '../components/ui/PageHeader';
import { SubNav } from '../components/ui/SubNav';
import { GeneralSettings } from '../components/settings/GeneralSettings';
import { CategoriesSettings } from '../components/settings/CategoriesSettings';
import { PrioritiesSettings } from '../components/settings/PrioritiesSettings';
import { WorkflowSettings } from '../components/settings/WorkflowSettings';
import { AssignmentSettings } from '../components/settings/AssignmentSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { AuditLog } from '../components/settings/AuditLog';
import { NotFound } from './system/NotFound';

const SECTIONS = {
  general: { label: 'General', icon: <BuildingIcon />, Component: GeneralSettings },
  categories: { label: 'Ticket categories', icon: <TagsIcon />, Component: CategoriesSettings },
  priorities: { label: 'Priorities & SLA', icon: <SignalIcon />, Component: PrioritiesSettings },
  workflow: { label: 'Status & workflow', icon: <GitBranchIcon />, Component: WorkflowSettings },
  assignment: { label: 'Teams & assignment', icon: <UserCogIcon />, Component: AssignmentSettings },
  notifications: { label: 'Notifications', icon: <BellIcon />, Component: NotificationSettings },
  security: { label: 'Security & sessions', icon: <ShieldIcon />, Component: SecuritySettings },
  audit: { label: 'Audit log', icon: <ScrollTextIcon />, Component: AuditLog }
} as const;

type SectionKey = keyof typeof SECTIONS;

export function Settings() {
  const { section = 'general' } = useParams();
  if (!(section in SECTIONS)) return <NotFound inShell />;
  const { Component } = SECTIONS[section as SectionKey];

  return (
    <PageContainer wide>
      <PageHeader title="Settings" description="Organization-wide configuration. Changes here affect every team and requester." />
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <SubNav label="Settings sections" items={(Object.keys(SECTIONS) as SectionKey[]).map((k) => ({ to: `/settings/${k}`, label: SECTIONS[k].label, icon: SECTIONS[k].icon }))} />
        <div key={section} className="min-w-0 max-w-4xl space-y-5">
          <Component />
        </div>
      </div>
    </PageContainer>);

}
