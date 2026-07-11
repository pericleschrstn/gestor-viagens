import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripMemberRole } from '../enums/trip-member-role.enum';
import { TripPermission } from '../enums/trip-permission.enum';
import { TripMember } from '../../members/entities/trip-member.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { permissionsForRole, roleHasPermission } from './role-permissions';

export type TripAccessContext = {
  role: TripMemberRole;
  permissions: TripPermission[];
};

@Injectable()
export class TripRbacService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(TripMember)
    private readonly memberRepository: Repository<TripMember>,
  ) {}

  async resolveRole(userId: string, tripId: string): Promise<TripMemberRole> {
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.ownerId === userId) {
      return TripMemberRole.OWNER;
    }

    const membership = await this.memberRepository.findOne({
      where: { tripId, userId },
    });

    if (!membership?.role) {
      throw new ForbiddenException('You do not have access to this trip');
    }

    return membership.role;
  }

  async getAccess(userId: string, tripId: string): Promise<TripAccessContext> {
    const role = await this.resolveRole(userId, tripId);
    return {
      role,
      permissions: permissionsForRole(role),
    };
  }

  async assertPermission(
    userId: string,
    tripId: string,
    permission: TripPermission,
  ): Promise<TripMemberRole> {
    const role = await this.resolveRole(userId, tripId);
    if (!roleHasPermission(role, permission)) {
      throw new ForbiddenException(
        `Missing permission: ${permission}`,
      );
    }
    return role;
  }

  async can(
    userId: string,
    tripId: string,
    permission: TripPermission,
  ): Promise<boolean> {
    try {
      const role = await this.resolveRole(userId, tripId);
      return roleHasPermission(role, permission);
    } catch {
      return false;
    }
  }
}
