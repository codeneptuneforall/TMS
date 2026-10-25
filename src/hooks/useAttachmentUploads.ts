'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { uid } from '../utils/cn';
import type { Attachment } from '../types/ticket';

export interface UploadItem {
  id: string;
  name: string;
  size: number;
  mime: string;
  status: 'uploading' | 'done' | 'failed';
  progress: number;
  error?: string;
  retryable?: boolean;
}

const MAX_BYTES = 10 * 1024 * 1024;
const BLOCKED = ['exe', 'bat', 'cmd', 'sh', 'msi', 'js'];

/** Simulates POST /attachments with progress, validation, and network failure. */
export function useAttachmentUploads(simulateErrors: boolean) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const timers = useRef<Record<string, number>>({});

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach((id) => window.clearInterval(id));
  }, []);

  const run = useCallback(
    (id: string) => {
      let progress = 0;
      timers.current[id] = window.setInterval(() => {
        progress += 20;
        if (simulateErrors && progress >= 60) {
          window.clearInterval(timers.current[id]);
          setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'failed', progress, error: 'Upload interrupted. Check your connection.', retryable: true } : i));
          return;
        }
        if (progress >= 100) {
          window.clearInterval(timers.current[id]);
          setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'done', progress: 100 } : i));
          return;
        }
        setItems((prev) => prev.map((i) => i.id === id ? { ...i, progress } : i));
      }, 160);
    },
    [simulateErrors]
  );

  const add = useCallback(
    (files: FileList | File[]) => {
      const next: UploadItem[] = Array.from(files).map((f) => {
        const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
        const base = { id: uid('up'), name: f.name, size: f.size, mime: f.type || 'application/octet-stream', progress: 0 };
        if (f.size > MAX_BYTES) return { ...base, status: 'failed' as const, error: 'Larger than the 10 MB limit', retryable: false };
        if (BLOCKED.includes(ext)) return { ...base, status: 'failed' as const, error: 'This file type isn’t allowed', retryable: false };
        return { ...base, status: 'uploading' as const };
      });
      setItems((prev) => [...prev, ...next]);
      next.filter((i) => i.status === 'uploading').forEach((i) => run(i.id));
    },
    [run]
  );

  const retry = useCallback(
    (id: string) => {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'uploading', progress: 0, error: undefined } : i));
      run(id);
    },
    [run]
  );

  const remove = useCallback((id: string) => {
    window.clearInterval(timers.current[id]);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const reset = useCallback(() => setItems([]), []);

  const attachments: Attachment[] = items.filter((i) => i.status === 'done').map(({ id, name, size, mime }) => ({ id, name, size, mime }));
  const uploading = items.some((i) => i.status === 'uploading');

  return { items, add, retry, remove, reset, attachments, uploading };
}
