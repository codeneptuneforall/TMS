'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname, useParams as useNextParams, useSearchParams as useNextSearchParams } from 'next/navigation';

export function Link({ to, href, ...rest }: { to?: string; href?: string } & Omit<React.ComponentProps<typeof NextLink>, 'href'>) {
  return <NextLink href={(href ?? to ?? '') as string} {...rest} />;
}

export function useNavigate() {
  const router = useRouter();
  return (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) router.replace(to);
    else router.push(to);
  };
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname, state: null, search: '', hash: '' };
}

export function useParams() {
  return useNextParams() as Record<string, string>;
}

export function useSearchParams() {
  const sp = useNextSearchParams();
  return [sp ?? new URLSearchParams(), () => undefined] as const;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter();
  React.useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [to, replace, router]);
  return null;
}

export function Outlet({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

