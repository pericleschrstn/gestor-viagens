import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class TripAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: User;
      params: { id?: string; tripId?: string };
    }>();

    const tripId = request.params.tripId ?? request.params.id;
    if (!tripId) {
      throw new ForbiddenException('Trip id is required');
    }

    const trip = await this.tripRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.ownerId !== request.user.id) {
      throw new ForbiddenException('You do not have access to this trip');
    }

    return true;
  }
}
