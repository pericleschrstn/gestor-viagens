import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripsService } from '../trips/trips.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { TripMember } from './entities/trip-member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(TripMember)
    private readonly memberRepository: Repository<TripMember>,
    private readonly tripsService: TripsService,
  ) {}

  async findAllByTrip(tripId: string, ownerId: string): Promise<TripMember[]> {
    await this.tripsService.findOneForOwner(tripId, ownerId);
    return this.memberRepository.find({
      where: { tripId },
      order: { name: 'ASC' },
    });
  }

  async create(
    tripId: string,
    ownerId: string,
    dto: CreateMemberDto,
  ): Promise<TripMember> {
    await this.tripsService.findOneForOwner(tripId, ownerId);

    const member = this.memberRepository.create({
      tripId,
      name: dto.name,
      initials: dto.initials.toUpperCase(),
      userId: dto.userId ?? null,
    });

    return this.memberRepository.save(member);
  }

  async update(
    memberId: string,
    ownerId: string,
    dto: UpdateMemberDto,
  ): Promise<TripMember> {
    const member = await this.findMemberForOwner(memberId, ownerId);
    Object.assign(member, {
      ...dto,
      initials: dto.initials ? dto.initials.toUpperCase() : member.initials,
    });
    return this.memberRepository.save(member);
  }

  async remove(memberId: string, ownerId: string): Promise<void> {
    const member = await this.findMemberForOwner(memberId, ownerId);
    await this.memberRepository.remove(member);
  }

  async findMemberForOwner(
    memberId: string,
    ownerId: string,
  ): Promise<TripMember> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['trip'],
    });

    if (!member || member.trip.ownerId !== ownerId) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }
}
