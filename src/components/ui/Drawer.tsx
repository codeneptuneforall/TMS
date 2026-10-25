'use client';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  title: string;
  hideHeader?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ open, onClose, side = 'right', title, hideHeader, children, className }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => panelRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current();
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open]);

  const offset = side === 'left' ? '-100%' : '100%';

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50">
          <motion.div
          className="absolute inset-0 bg-ink/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden />
        
          <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          initial={{ x: offset }}
          animate={{ x: 0 }}
          exit={{ x: offset }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            'absolute inset-y-0 flex w-[min(320px,88vw)] flex-col bg-surface shadow-pop outline-none',
            side === 'left' ? 'left-0 border-r border-line' : 'right-0 border-l border-line',
            className
          )}>
          
            {!hideHeader &&
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
                <h2 className="text-sm font-semibold text-ink">{title}</h2>
                <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-3 hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
              
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
          }
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      }
    </AnimatePresence>,
    document.body
  );
}
