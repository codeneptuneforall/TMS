'use client';
import React from 'react';
import { LogoMark } from '../layout/Logo';

interface AuthLayoutProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full w-full flex-col bg-canvas">
      <header className="flex items-center gap-2.5 px-6 py-5">
        <LogoMark />
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Relay</span>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center sm:pt-0">
        <div className="w-full max-w-[400px]">
          <div className="rounded-xl border border-line bg-surface p-6 shadow-card sm:p-8">
            <h1 className="text-xl font-semibold tracking-[-0.01em] text-ink">{title}</h1>
            {description && <p className="mt-1.5 text-[14px] leading-6 text-ink-2">{description}</p>}
            <div className="mt-6">{children}</div>
          </div>
          {footer && <div className="mt-5 text-center text-[13px] text-ink-3">{footer}</div>}
        </div>
      </main>
      <footer className="px-6 py-5 text-center text-[12px] text-ink-3">© 2026 Cadence Support · Privacy · Terms</footer>
    </div>);

}
