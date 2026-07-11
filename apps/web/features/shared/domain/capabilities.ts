export type TripRole = "OWNER" | "EDITOR" | "VIEWER"

export type TripPermission =
  | "READ"
  | "WRITE"
  | "MANAGE_MEMBERS"
  | "MANAGE_BUDGET"
  | "DELETE_TRIP"
  | "MANAGE_SETTLEMENTS"

export type TripCapabilities = {
  role: TripRole
  permissions: TripPermission[]
  canRead: boolean
  canWrite: boolean
  canManageMembers: boolean
  canManageBudget: boolean
  canManageSettlements: boolean
  canDeleteTrip: boolean
}

export function buildCapabilities(
  role: TripRole,
  permissions: TripPermission[],
): TripCapabilities {
  const has = (p: TripPermission) => permissions.includes(p)

  return {
    role,
    permissions,
    canRead: has("READ"),
    canWrite: has("WRITE"),
    canManageMembers: has("MANAGE_MEMBERS"),
    canManageBudget: has("MANAGE_BUDGET"),
    canManageSettlements: has("MANAGE_SETTLEMENTS"),
    canDeleteTrip: has("DELETE_TRIP"),
  }
}
