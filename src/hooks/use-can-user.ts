import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';
import { validateUserPermissions } from '../utils/validate-user-permissions';

type UseCanUserProperties = {
  permissions?: Array<string>;
  roles?: Array<string>;
};

export function useCanUser({ permissions, roles }: UseCanUserProperties) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) return false;

  const userHasValidPermissions = validateUserPermissions({
    roles,
    user,
    permissions,
  });

  return userHasValidPermissions;
}
