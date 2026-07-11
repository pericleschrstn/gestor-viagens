import { z } from "zod"

import {
  buildCapabilities,
  type TripCapabilities,
  type TripPermission,
  type TripRole,
} from "@/features/shared/domain/capabilities"

export const tripRoleSchema = z.enum(["OWNER", "EDITOR", "VIEWER"])
export const tripPermissionSchema = z.enum([
  "READ",
  "WRITE",
  "MANAGE_MEMBERS",
  "MANAGE_BUDGET",
  "DELETE_TRIP",
  "MANAGE_SETTLEMENTS",
])

export const apiTripAccessSchema = z.object({
  role: tripRoleSchema,
  permissions: z.array(tripPermissionSchema),
})

export type ApiTripAccess = z.infer<typeof apiTripAccessSchema>

export function mapTripAccess(dto: ApiTripAccess): TripCapabilities {
  return buildCapabilities(dto.role as TripRole, dto.permissions as TripPermission[])
}
