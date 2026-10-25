'use client';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from '@/lib/router';
import { useAppState } from '../../contexts/AppStateContext';
import { WorkflowProvider } from '../../contexts/WorkflowContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Drawer } from '../ui/Drawer';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, signOut } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  if (!currentUser) return <Navigate to="/signin" replace />;

  const requestSignOut = () => {
    setMobileOpen(false);
    setConfirmSignOut(true);
  };

  return (
    <WorkflowProvider>
      <div className="flex h-screen w-full overflow-hidden bg-canvas">
        <a href="#main" className="sr-only z-50 rounded-md bg-surface px-3 py-2 focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:shadow-pop">
          Skip to content
        </a>
        <aside
          className={cn(
            'hidden shrink-0 border-r border-line transition-[width] duration-200 ease-out lg:block',
            collapsed ? 'w-[60px]' : 'w-60'
          )}>
          
          <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} onRequestSignOut={requestSignOut} />
        </aside>

        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} side="left" title="Navigation" hideHeader>
          <Sidebar collapsed={false} onRequestSignOut={requestSignOut} />
        </Drawer>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenNav={() => setMobileOpen(true)} onRequestSignOut={requestSignOut} />
          <main id="main" tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto outline-none">
            {children}
          </main>
        </div>

        <Dialog
          open={confirmSignOut}
          onClose={() => setConfirmSignOut(false)}
          size="sm"
          title="Sign out of Relay?"
          description="Unsent replies and unsaved drafts on this device will be lost."
          footer={
          <>
              <Button onClick={() => setConfirmSignOut(false)}>Cancel</Button>
              <Button
              variant="primary"
              onClick={() => {
                setConfirmSignOut(false);
                signOut();
                navigate('/signin', { replace: true });
              }}>
              
                Sign out
              </Button>
            </>
          } />
        
      </div>
    </WorkflowProvider>);

}
