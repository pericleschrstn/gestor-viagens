import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripMemberRole } from '../common/enums/trip-member-role.enum';
import { TripPermission } from '../common/enums/trip-permission.enum';
import { TripRbacService } from '../common/rbac/trip-rbac.service';
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
    private readonly tripRbacService: TripRbacService,
  ) {}

  async findAllByTrip(tripId: string, userId: string): Promise<TripMember[]> {
    await this.tripRbacService.assertPermission(
      userId,
      tripId,
      TripPermission.READ,
    );
    return this.memberRepository.find({
      where: { tripId },
      order: { name: 'ASC' },
    });
  }

  async create(
    tripId: string,
    userId: string,
    dto: CreateMemberDto,
  ): Promise<TripMember> {
    await this.tripRbacService.assertPermission(
      userId,
      tripId,
      TripPermission.MANAGE_MEMBERS,
    );

    const member = this.memberRepository.create({
      tripId,
      name: dto.name,
      initials: dto.initials.toUpperCase(),
      userId: dto.userId ?? null,
      role: dto.userId
        ? (dto.role ?? TripMemberRole.EDITOR)
        : null,
    });

    return this.memberRepository.save(member);
  }

  async update(
    memberId: string,
    userId: string,
    dto: UpdateMemberDto,
  ): Promise<TripMember> {
    const member = await this.findMemberForUser(memberId, userId);
    await this.tripRbacService.assertPermission(
      userId,
      member.tripId,
      TripPermission.MANAGE_MEMBERS,
    );

    Object.assign(member, {
      ...dto,
      initials: dto.initials ? dto.initials.toUpperCase() : member.initials,
      role:
        dto.role !== undefined
          ? dto.role
          : member.role,
    });
    return this.memberRepository.save(member);
  }

  async remove(memberId: string, userId: string): Promise<void> {
    const member = await this.findMemberForUser(memberId, userId);
    await this.tripRbacService.assertPermission(
      userId,
      member.tripId,
      TripPermission.MANAGE_MEMBERS,
    );
    await this.memberRepository.remove(member);
  }

  async findMemberForTrip(
    memberId: string,
    tripId: string,
    userId: string,
  ): Promise<TripMember> {
    await this.tripRbacService.assertPermission(
      userId,
      tripId,
      TripPermission.READ,
    );

    const member = await this.memberRepository.findOne({
      where: { id: memberId, tripId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async findMemberForUser(
    memberId: string,
    userId: string,
  ): Promise<TripMember> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['trip'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.tripRbacService.assertPermission(
      userId,
      member.tripId,
      TripPermission.READ,
    );

    return member;
  }

  /** @deprecated use findMemberForUser */
  async findMemberForOwner(
    memberId: string,
    ownerId: string,
  ): Promise<TripMember> {
    return this.findMemberForUser(memberId, ownerId);
  }
}
