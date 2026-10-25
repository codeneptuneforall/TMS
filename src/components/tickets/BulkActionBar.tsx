'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCwIcon, SignalIcon, UserPlusIcon, UsersRoundIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Popover } from '../ui/Popover';
import { MenuItem, MenuLabel } from '../ui/Menu';
import { PriorityGlyph } from './PriorityIndicator';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { PRIORITY_META, PRIORITY_ORDER } from '../../utils/ticketMeta';

interface BulkActionBarProps {
  selected: string[];
  onClear: () => void;
}

export function BulkActionBar({ selected, onClear }: BulkActionBarProps) {
  const { openAssign, openTeam, requestStatus, changePriority } = useWorkflow();

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
      role="toolbar"
      aria-label="Bulk actions"
      className="hidden items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-2 py-1.5 shadow-card md:flex">
      
      <span className="px-2 text-[13px] font-medium tabular-nums text-ink">{selected.length} selected</span>
      <span className="mx-1 h-5 w-px bg-line" aria-hidden />
      <Button size="sm" variant="ghost" onClick={() => openAssign(selected)} leadingIcon={<UserPlusIcon className="h-4 w-4" />}>
        Assign
      </Button>
      <Button size="sm" variant="ghost" onClick={() => requestStatus(selected)} leadingIcon={<RefreshCwIcon className="h-4 w-4" />}>
        Status
      </Button>
      <Popover
        label="Set priority"
        trigger={({ ref, toggle, open }) =>
        <Button ref={ref} size="sm" variant="ghost" onClick={toggle} aria-expanded={open} leadingIcon={<SignalIcon className="h-4 w-4" />}>
            Priority
          </Button>
        }>
        
        {(close) =>
        <div role="menu">
            <MenuLabel>Set priority for {selected.length} tickets</MenuLabel>
            {PRIORITY_ORDER.map((p) =>
          <MenuItem
            key={p}
            icon={<PriorityGlyph priority={p} />}
            onSelect={() => {
              close();
              changePriority(selected, p);
            }}>
            
                {PRIORITY_META[p].label}
              </MenuItem>
          )}
          </div>
        }
      </Popover>
      <Button size="sm" variant="ghost" onClick={() => openTeam(selected)} leadingIcon={<UsersRoundIcon className="h-4 w-4" />}>
        Team
      </Button>
      <Button size="icon-sm" variant="ghost" onClick={onClear} aria-label="Clear selection" className="ml-auto">
        <XIcon className="h-4 w-4" />
      </Button>
    </motion.div>);

}
