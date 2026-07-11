import { SetMetadata } from '@nestjs/common';
import { TripPermission } from '../enums/trip-permission.enum';

export const TRIP_PERMISSION_KEY = 'trip_permission';

export const RequireTripPermission = (permission: TripPermission) =>
  SetMetadata(TRIP_PERMISSION_KEY, permission);
