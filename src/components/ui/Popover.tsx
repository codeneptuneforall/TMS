'use client';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface TriggerArgs {
  ref: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  toggle: () => void;
}

interface PopoverProps {
  trigger: (args: TriggerArgs) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: 'start' | 'end';
  className?: string;
  label?: string;
}

/** Portal-based popover so menus are never clipped by scrolling tables. */
export function Popover({ trigger, children, align = 'start', className, label }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{top: number;left: number;} | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const t = triggerRef.current;
    const p = panelRef.current;
    if (!t || !p) return;
    const r = t.getBoundingClientRect();
    const pw = p.offsetWidth;
    const ph = p.offsetHeight;
    let left = align === 'end' ? r.right - pw : r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
    let top = r.bottom + 6;
    if (top + ph > window.innerHeight - 8 && r.top - ph - 6 > 8) top = r.top - ph - 6;
    setPos({ top, left });
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    const onScroll = (e: Event) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open || !pos) return;
    const first = panelRef.current?.querySelector<HTMLElement>('input, [data-menu-item]:not([disabled])');
    first?.focus();
  }, [open, pos]);

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[data-menu-item]:not([disabled])') ?? []);
    if (!items.length) return;
    e.preventDefault();
    const idx = items.indexOf(document.activeElement as HTMLElement);
    const next = e.key === 'ArrowDown' ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;
    items[next].focus();
  };

  return (
    <>
      {trigger({ ref: triggerRef, open, toggle: () => setOpen((o) => !o) })}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open &&
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label={label}
            onKeyDown={onPanelKeyDown}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            style={{ position: 'fixed', top: pos?.top ?? -9999, left: pos?.left ?? -9999, transformOrigin: align === 'end' ? 'top right' : 'top left' }}
            className={cn('z-[60] min-w-[200px] rounded-lg border border-line bg-surface p-1 shadow-pop', className)}>
            
              {children(close)}
            </motion.div>
          }
        </AnimatePresence>,
        document.body
      )}
    </>);

}
