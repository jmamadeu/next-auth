import { ReactNode } from 'react';
import { useCanUser } from '../hooks/use-can-user';

interface CanUserSeeProperties {
  roles?: Array<string>;
  permissions?: Array<string>;

  children: ReactNode;
}

export function CanUserSee({
  children,
  roles,
  permissions,
}: CanUserSeeProperties) {
  const canUserSeeComponent = useCanUser({ roles, permissions });

  if (!canUserSeeComponent) return null;

  return <>{children}</>;
}
