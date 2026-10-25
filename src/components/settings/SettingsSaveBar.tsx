'use client';
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';

interface SettingsSaveBarProps {
  dirty: boolean;
  saving: boolean;
  onReset: () => void;
  onSave: () => Promise<boolean> | void;
  confirm?: {title: string;description: string;};
}

/** Footer actions for a settings form. Consequential sections pass `confirm` to require an explicit second step. */
export function SettingsSaveBar({ dirty, saving, onReset, onSave, confirm }: SettingsSaveBarProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {dirty && <span className="mr-auto hidden text-[12px] text-warning-fg sm:inline">Unsaved changes</span>}
      <Button onClick={onReset} disabled={!dirty || saving}>Discard</Button>
      <Button variant="primary" loading={saving && !open} disabled={!dirty} onClick={() => confirm ? setOpen(true) : onSave()}>
        Save changes
      </Button>
      {confirm &&
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        role="alertdialog"
        title={confirm.title}
        description={confirm.description}
        footer={
        <>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
            variant="primary"
            loading={saving}
            onClick={async () => {
              const ok = await onSave();
              if (ok !== false) setOpen(false);
            }}>
            
                Apply changes
              </Button>
            </>
        } />

      }
    </>);

}
