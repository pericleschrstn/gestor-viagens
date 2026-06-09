import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  findAllByOwner(ownerId: string): Promise<Trip[]> {
    return this.tripRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneForOwner(id: string, ownerId: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id, ownerId },
      relations: ['members'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
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

  async update(id: string, ownerId: string, dto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findOneForOwner(id, ownerId);
    Object.assign(trip, {
      ...dto,
      initials: dto.initials ? dto.initials.toUpperCase() : trip.initials,
    });
    return this.tripRepository.save(trip);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const trip = await this.findOneForOwner(id, ownerId);
    await this.tripRepository.remove(trip);
  }
}
