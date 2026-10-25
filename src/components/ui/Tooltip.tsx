'use client';
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  side?: 'right' | 'bottom';
  disabled?: boolean;
  children: React.ReactElement;
}

export function Tooltip({ content, side = 'bottom', disabled, children }: TooltipProps) {
  const [pos, setPos] = useState<{top: number;left: number;} | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const show = () => {
    if (disabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos(side === 'right' ? { top: r.top + r.height / 2, left: r.right + 8 } : { top: r.bottom + 6, left: r.left + r.width / 2 });
  };
  const hide = () => setPos(null);

  return (
    <span ref={ref} className="inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {pos && typeof document !== 'undefined' &&
      createPortal(
        <span
          role="tooltip"
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform: side === 'right' ? 'translateY(-50%)' : 'translateX(-50%)'
          }}
          className="pointer-events-none z-[70] whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[12px] font-medium text-white shadow-pop">
          
            {content}
          </span>,
        document.body
      )}
    </span>);

}
