'use client';
import { useEffect, useState } from 'react';

/** Mimics the first network round-trip for a screen so loading skeletons are exercised. */
export function useSimulatedLoading(key: string, ms = 380): [boolean, () => void] {
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(t);
  }, [key, ms, nonce]);

  return [loading, () => setNonce((n) => n + 1)];
}
