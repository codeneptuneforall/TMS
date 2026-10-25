'use client';
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  noun?: string;
}

export function Pagination({ page, pageCount, total, pageSize, onChange, noun = 'tickets' }: PaginationProps) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 px-1 py-3 text-[13px] text-ink-3">
      <p className="tabular-nums">
        <span className="font-medium text-ink">{from}–{to}</span> of {total} {noun}
      </p>
      <div className="flex items-center gap-1.5">
        <span className="mr-1 hidden tabular-nums sm:inline">
          Page {page} of {pageCount}
        </span>
        <Button size="icon-sm" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button size="icon-sm" aria-label="Next page" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </nav>);

}
