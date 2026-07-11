import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TRIP_PERMISSION_KEY } from '../decorators/require-trip-permission.decorator';
import { TripPermission } from '../enums/trip-permission.enum';
import { TripRbacService } from '../rbac/trip-rbac.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class TripRbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tripRbacService: TripRbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<TripPermission>(
      TRIP_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permission) {
      throw new ForbiddenException('Trip permission metadata is required');
    }

    const request = context.switchToHttp().getRequest<{
      user: User;
      params: { id?: string; tripId?: string };
    }>();

    const tripId = request.params.tripId ?? request.params.id;
    if (!tripId) {
      throw new ForbiddenException('Trip id is required');
    }

    await this.tripRbacService.assertPermission(
      request.user.id,
      tripId,
      permission,
    );

    return true;
  }
}
