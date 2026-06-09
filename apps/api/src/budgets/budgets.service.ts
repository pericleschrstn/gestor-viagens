import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseCategory } from '../common/enums/expense-category.enum';
import {
  convertAmount,
  parseDecimal,
} from '../common/utils/currency.util';
import { Expense } from '../expenses/entities/expense.entity';
import { Trip } from '../trips/entities/trip.entity';
import { TripsService } from '../trips/trips.service';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { CategoryBudget } from './entities/category-budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(CategoryBudget)
    private readonly categoryBudgetRepository: Repository<CategoryBudget>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private readonly tripsService: TripsService,
  ) {}

  async getBudget(tripId: string, ownerId: string) {
    const trip = await this.tripsService.findOneForOwner(tripId, ownerId);
    const categoryBudgets = await this.categoryBudgetRepository.find({
      where: { tripId },
      order: { category: 'ASC' },
    });

    const expenses = await this.expenseRepository.find({ where: { tripId } });
    const spentByCategory = this.groupSpentByCategory(expenses, trip);

    return {
      totalBudget: trip.totalBudget,
      categories: categoryBudgets.map((budget) => ({
        ...budget,
        spent: spentByCategory[budget.category] ?? 0,
      })),
    };
  }

  async updateBudget(tripId: string, ownerId: string, dto: UpdateBudgetDto) {
    const trip = await this.tripsService.findOneForOwner(tripId, ownerId);

    if (dto.totalBudget !== undefined) {
      trip.totalBudget = dto.totalBudget;
      await this.tripRepository.save(trip);
    }

    await this.categoryBudgetRepository.delete({ tripId });

    const categoryBudgets = dto.categories.map((item) =>
      this.categoryBudgetRepository.create({
        tripId,
        category: item.category,
        limitAmount: item.limitAmount,
      }),
    );

    await this.categoryBudgetRepository.save(categoryBudgets);
    return this.getBudget(tripId, ownerId);
  }

  async getSummary(tripId: string, ownerId: string) {
    const trip = await this.tripsService.findOneForOwner(tripId, ownerId);
    const expenses = await this.expenseRepository.find({
      where: { tripId },
      relations: ['payer', 'splits', 'splits.member'],
      order: { date: 'ASC' },
    });

    const totalSpent = expenses.reduce(
      (sum, expense) =>
        sum +
        convertAmount(
          parseDecimal(expense.amount),
          expense.currency,
          trip.baseCurrency,
        ),
      0,
    );

    const totalBudget = trip.totalBudget
      ? parseDecimal(trip.totalBudget)
      : null;
    const remaining =
      totalBudget !== null ? totalBudget - totalSpent : null;

    const tripDays = this.countTripDays(trip);
    const elapsedDays = this.countElapsedDays(trip);
    const dailyAverage = elapsedDays > 0 ? totalSpent / elapsedDays : 0;

    const memberCount = trip.members?.length ?? 0;
    const perPerson = memberCount > 0 ? totalSpent / memberCount : 0;

    const byCategory = this.groupSpentByCategory(expenses, trip);
    const categoryBudgets = await this.categoryBudgetRepository.find({
      where: { tripId },
    });

    const categorySummary = Object.values(ExpenseCategory).map((category) => {
      const spent = byCategory[category] ?? 0;
      const budget = categoryBudgets.find((item) => item.category === category);
      const limit = budget ? parseDecimal(budget.limitAmount) : null;
      return {
        category,
        spent,
        limit,
        percentage: limit ? (spent / limit) * 100 : null,
      };
    });

    const byDay = this.groupSpentByDay(expenses, trip);

    const recent = [...expenses]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime() ||
          b.createdAt.getTime() - a.createdAt.getTime(),
      )
      .slice(0, 5);

    return {
      currency: trip.baseCurrency,
      totalSpent,
      totalBudget,
      remaining,
      dailyAverage,
      perPerson,
      tripDays,
      elapsedDays,
      byCategory: categorySummary,
      byDay,
      recent,
    };
  }

  private groupSpentByCategory(expenses: Expense[], trip: Trip) {
    return expenses.reduce<Record<string, number>>((acc, expense) => {
      const amount = convertAmount(
        parseDecimal(expense.amount),
        expense.currency,
        trip.baseCurrency,
      );
      acc[expense.category] = (acc[expense.category] ?? 0) + amount;
      return acc;
    }, {});
  }

  private groupSpentByDay(expenses: Expense[], trip: Trip) {
    return expenses.reduce<Record<string, number>>((acc, expense) => {
      const amount = convertAmount(
        parseDecimal(expense.amount),
        expense.currency,
        trip.baseCurrency,
      );
      acc[expense.date] = (acc[expense.date] ?? 0) + amount;
      return acc;
    }, {});
  }

  private countTripDays(trip: Trip): number {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }

  private countElapsedDays(trip: Trip): number {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const today = new Date();
    const effectiveEnd = today < end ? today : end;
    const diff = effectiveEnd.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }
}
