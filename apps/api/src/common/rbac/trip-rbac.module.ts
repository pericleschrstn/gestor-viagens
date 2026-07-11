import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripRbacGuard } from '../guards/trip-rbac.guard';
import { TripMember } from '../../members/entities/trip-member.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { TripRbacService } from './trip-rbac.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripMember])],
  providers: [TripRbacService, TripRbacGuard],
  exports: [TripRbacService, TripRbacGuard],
})
export class TripRbacModule {}
