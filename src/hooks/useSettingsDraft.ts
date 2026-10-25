'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAppState } from '../contexts/AppStateContext';

/** Local draft + save flow for a settings form (stand-in for PUT /settings/:section). */
export function useSettingsDraft<T extends object>(initial: T, successMessage: string) {
  const { simulateErrors } = useAppState();
  const [saved, setSaved] = useState<T>(initial);
  const [draft, setDraft] = useState<T>(initial);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof T,>(key: K, value: T[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const reset = () => setDraft(saved);

  const save = async (persist?: (value: T) => Promise<boolean>) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 420));
    if (simulateErrors) {
      setSaving(false);
      toast.error('Settings not saved', { description: 'We couldn’t reach the server. Your changes are still here.' });
      return false;
    }
    if (persist && !(await persist(draft))) {
      setSaving(false);
      return false;
    }
    setSaved(draft);
    setSaving(false);
    toast.success(successMessage);
    return true;
  };

  return { draft, set, setDraft, dirty, reset, save, saving };
}
