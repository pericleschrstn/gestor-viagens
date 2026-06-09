import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../expenses/entities/expense.entity';
import { Trip } from '../trips/entities/trip.entity';
import { TripsModule } from '../trips/trips.module';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { CategoryBudget } from './entities/category-budget.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryBudget, Expense, Trip]),
    TripsModule,
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService],
  exports: [BudgetsService],
})
export class BudgetsModule {}
