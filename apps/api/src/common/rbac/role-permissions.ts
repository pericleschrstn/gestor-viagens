import { TripMemberRole } from '../enums/trip-member-role.enum';
import { TripPermission } from '../enums/trip-permission.enum';

export const ROLE_PERMISSIONS: Record<TripMemberRole, TripPermission[]> = {
  [TripMemberRole.OWNER]: [
    TripPermission.READ,
    TripPermission.WRITE,
    TripPermission.MANAGE_MEMBERS,
    TripPermission.MANAGE_BUDGET,
    TripPermission.DELETE_TRIP,
    TripPermission.MANAGE_SETTLEMENTS,
  ],
  [TripMemberRole.EDITOR]: [
    TripPermission.READ,
    TripPermission.WRITE,
    TripPermission.MANAGE_BUDGET,
  ],
  [TripMemberRole.VIEWER]: [TripPermission.READ],
};

export function permissionsForRole(role: TripMemberRole): TripPermission[] {
  return ROLE_PERMISSIONS[role];
}

export function roleHasPermission(
  role: TripMemberRole,
  permission: TripPermission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
