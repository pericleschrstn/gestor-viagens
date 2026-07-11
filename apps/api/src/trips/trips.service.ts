import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripPermission } from '../common/enums/trip-permission.enum';
import { TripRbacService } from '../common/rbac/trip-rbac.service';
import { TripStatus } from '../common/enums/trip-status.enum';
import { Currency } from '../common/enums/currency.enum';
import { User } from '../users/entities/user.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Trip } from './entities/trip.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private readonly tripRbacService: TripRbacService,
  ) {}

  findAllAccessible(userId: string): Promise<Trip[]> {
    return this.tripRepository
      .createQueryBuilder('trip')
      .leftJoin('trip_members', 'member', 'member.trip_id = trip.id')
      .where('trip.owner_id = :userId', { userId })
      .orWhere('member.user_id = :userId', { userId })
      .orderBy('trip.created_at', 'DESC')
      .getMany();
  }

  /** @deprecated use findAllAccessible */
  findAllByOwner(ownerId: string): Promise<Trip[]> {
    return this.findAllAccessible(ownerId);
  }

  async findOneAccessible(id: string, userId: string): Promise<Trip> {
    await this.tripRbacService.assertPermission(
      userId,
      id,
      TripPermission.READ,
    );

    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  /** @deprecated use findOneAccessible */
  async findOneForOwner(id: string, ownerId: string): Promise<Trip> {
    return this.findOneAccessible(id, ownerId);
  }

  async create(owner: User, dto: CreateTripDto): Promise<Trip> {
    const trip = this.tripRepository.create({
      name: dto.name,
      initials: dto.initials.toUpperCase(),
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: dto.status ?? TripStatus.PLANNING,
      baseCurrency: dto.baseCurrency ?? Currency.BRL,
      totalBudget: dto.totalBudget ?? null,
      ownerId: owner.id,
    });

    return this.tripRepository.save(trip);
  }

  async update(id: string, userId: string, dto: UpdateTripDto): Promise<Trip> {
    await this.tripRbacService.assertPermission(
      userId,
      id,
      TripPermission.DELETE_TRIP,
    );

    const trip = await this.findOneAccessible(id, userId);
    Object.assign(trip, {
      ...dto,
      initials: dto.initials ? dto.initials.toUpperCase() : trip.initials,
    });
    return this.tripRepository.save(trip);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.tripRbacService.assertPermission(
      userId,
      id,
      TripPermission.DELETE_TRIP,
    );

    const trip = await this.findOneAccessible(id, userId);
    await this.tripRepository.remove(trip);
  }
}
