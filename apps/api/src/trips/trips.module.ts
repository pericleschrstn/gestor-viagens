import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripAccessGuard } from '../common/guards/trip-access.guard';
import { Trip } from './entities/trip.entity';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
  controllers: [TripsController],
  providers: [TripsService, TripAccessGuard],
  exports: [TripsService, TripAccessGuard, TypeOrmModule],
})
export class TripsModule {}
