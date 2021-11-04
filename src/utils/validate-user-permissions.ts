type UserPermissionsProperties = {
  permissions?: Array<string>;
  roles?: Array<string>;
  user: Omit<UserPermissionsProperties, 'user'>;
};

export function validateUserPermissions({
  user,
  permissions,
  roles,
}: UserPermissionsProperties) {
  if (permissions?.length) {
    const hasAllPermissions = permissions.every((permission) => {
      return user.permissions?.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length) {
    const hasAllRoles = roles.some((role) => {
      return user?.roles?.includes(role);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
