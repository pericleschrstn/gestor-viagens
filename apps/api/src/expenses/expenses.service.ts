import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  PaginatedResult,
  paginate,
} from '../common/interfaces/paginated-result.interface';
import { parseDecimal } from '../common/utils/currency.util';
import { MembersService } from '../members/members.service';
import { TripsService } from '../trips/trips.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import {
  ExpenseSortOrder,
  ListExpensesQueryDto,
} from './dto/list-expenses-query.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseSplit } from './entities/expense-split.entity';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private readonly splitRepository: Repository<ExpenseSplit>,
    private readonly tripsService: TripsService,
    private readonly membersService: MembersService,
  ) {}

  async findAllByTrip(
    tripId: string,
    ownerId: string,
    query: ListExpensesQueryDto,
  ): Promise<PaginatedResult<Expense>> {
    await this.tripsService.findOneForOwner(tripId, ownerId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const countQb = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoin('expense.splits', 'splits')
      .where('expense.tripId = :tripId', { tripId });
    this.applyExpenseFilters(countQb, query);
    const total = await countQb.distinct(true).getCount();

    const dataQb = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.payer', 'payer')
      .leftJoinAndSelect('expense.splits', 'splits')
      .leftJoinAndSelect('splits.member', 'member')
      .where('expense.tripId = :tripId', { tripId });
    this.applyExpenseFilters(dataQb, query);
    this.applyExpenseSort(dataQb, query);
    const data = await dataQb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return paginate(data, total, page, limit);
  }

  private applyExpenseFilters(
    qb: SelectQueryBuilder<Expense>,
    query: ListExpensesQueryDto,
  ): void {
    if (query.search) {
      qb.andWhere('expense.description ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.category) {
      qb.andWhere('expense.category = :category', { category: query.category });
    }

    if (query.memberId) {
      qb.andWhere(
        '(expense.payerId = :memberId OR splits.memberId = :memberId)',
        { memberId: query.memberId },
      );
    }

    if (query.startDate) {
      qb.andWhere('expense.date >= :startDate', { startDate: query.startDate });
    }

    if (query.endDate) {
      qb.andWhere('expense.date <= :endDate', { endDate: query.endDate });
    }
  }

  private applyExpenseSort(
    qb: SelectQueryBuilder<Expense>,
    query: ListExpensesQueryDto,
  ): void {
    switch (query.sort ?? ExpenseSortOrder.NEWEST) {
      case ExpenseSortOrder.OLDEST:
        qb.orderBy('expense.date', 'ASC').addOrderBy('expense.createdAt', 'ASC');
        break;
      case ExpenseSortOrder.AMOUNT_DESC:
        qb.orderBy('expense.amount', 'DESC');
        break;
      case ExpenseSortOrder.AMOUNT_ASC:
        qb.orderBy('expense.amount', 'ASC');
        break;
      default:
        qb.orderBy('expense.date', 'DESC').addOrderBy('expense.createdAt', 'DESC');
        break;
    }
  }

  async findOneForOwner(expenseId: string, ownerId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['trip', 'payer', 'splits', 'splits.member'],
    });

    if (!expense || expense.trip.ownerId !== ownerId) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async create(
    tripId: string,
    ownerId: string,
    dto: CreateExpenseDto,
  ): Promise<Expense> {
    await this.tripsService.findOneForOwner(tripId, ownerId);
    await this.membersService.findMemberForOwner(dto.payerId, ownerId);
    this.validateSplits(dto.amount, dto.splits);

    for (const split of dto.splits) {
      await this.membersService.findMemberForOwner(split.memberId, ownerId);
    }

    const expense = this.expenseRepository.create({
      tripId,
      description: dto.description,
      amount: dto.amount,
      currency: dto.currency,
      date: dto.date,
      category: dto.category,
      payerId: dto.payerId,
      receiptUrl: dto.receiptUrl ?? null,
      splits: dto.splits.map((split) =>
        this.splitRepository.create({
          memberId: split.memberId,
          share: split.share,
        }),
      ),
    });

    return this.expenseRepository.save(expense);
  }

  async update(
    expenseId: string,
    ownerId: string,
    dto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOneForOwner(expenseId, ownerId);

    if (dto.payerId) {
      await this.membersService.findMemberForOwner(dto.payerId, ownerId);
    }

    if (dto.splits) {
      const amount = dto.amount ?? expense.amount;
      this.validateSplits(amount, dto.splits);
      for (const split of dto.splits) {
        await this.membersService.findMemberForOwner(split.memberId, ownerId);
      }
      await this.splitRepository.delete({ expenseId: expense.id });
      expense.splits = dto.splits.map((split) =>
        this.splitRepository.create({
          expenseId: expense.id,
          memberId: split.memberId,
          share: split.share,
        }),
      );
    }

    Object.assign(expense, {
      description: dto.description ?? expense.description,
      amount: dto.amount ?? expense.amount,
      currency: dto.currency ?? expense.currency,
      date: dto.date ?? expense.date,
      category: dto.category ?? expense.category,
      payerId: dto.payerId ?? expense.payerId,
      receiptUrl: dto.receiptUrl ?? expense.receiptUrl,
    });

    return this.expenseRepository.save(expense);
  }

  async remove(expenseId: string, ownerId: string): Promise<void> {
    const expense = await this.findOneForOwner(expenseId, ownerId);
    await this.expenseRepository.remove(expense);
  }

  private validateSplits(
    amount: string,
    splits: { share: string }[],
  ): void {
    const total = splits.reduce(
      (sum, split) => sum + parseDecimal(split.share),
      0,
    );
    const expenseAmount = parseDecimal(amount);

    if (Math.abs(total - expenseAmount) > 0.01) {
      throw new BadRequestException(
        'Split shares must sum to the expense amount',
      );
    }
  }
}
