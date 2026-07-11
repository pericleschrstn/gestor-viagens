import { z } from "zod"

export const tripStatusSchema = z.enum(["planning", "active", "closed"])

export type TripStatus = z.infer<typeof tripStatusSchema>
