import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../expenses/entities/expense.entity';
import { TripMember } from '../members/entities/trip-member.entity';
import { TripsModule } from '../trips/trips.module';
import { Settlement } from './entities/settlement.entity';
import { SettlementsController } from './settlements.controller';
import { SettlementsService } from './settlements.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Settlement, Expense, TripMember]),
    TripsModule,
  ],
  controllers: [SettlementsController],
  providers: [SettlementsService],
})
export class SettlementsModule {}
