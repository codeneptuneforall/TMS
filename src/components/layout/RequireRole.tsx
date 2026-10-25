'use client';
import React from 'react';
import { useCurrentUser } from '../../contexts/AppStateContext';
import { Unauthorized } from '../../views/system/Unauthorized';
import type { Role } from '../../types/user';

/** UI guard only — the API must enforce the same rule. */
export function RequireRole({ roles, children }: {roles: Role[];children: React.ReactNode;}) {
  const user = useCurrentUser();
  if (!roles.includes(user.role)) return <Unauthorized inShell />;
  return <>{children}</>;
}
