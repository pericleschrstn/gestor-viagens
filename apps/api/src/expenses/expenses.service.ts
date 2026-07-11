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
import { TripPermission } from '../common/enums/trip-permission.enum';
import { TripRbacService } from '../common/rbac/trip-rbac.service';
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
    private readonly tripRbacService: TripRbacService,
  ) {}

  async findAllByTrip(
    tripId: string,
    userId: string,
    query: ListExpensesQueryDto,
  ): Promise<PaginatedResult<Expense>> {
    await this.tripRbacService.assertPermission(
      userId,
      tripId,
      TripPermission.READ,
    );

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

    if (query.categories?.length) {
      qb.andWhere('expense.category IN (:...categories)', {
        categories: query.categories,
      });
    }

    if (query.memberIds?.length) {
      qb.andWhere(
        '(expense.payerId IN (:...memberIds) OR splits.memberId IN (:...memberIds))',
        { memberIds: query.memberIds },
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

  async findOneAccessible(expenseId: string, userId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['trip', 'payer', 'splits', 'splits.member'],
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.tripRbacService.assertPermission(
      userId,
      expense.tripId,
      TripPermission.READ,
    );

    return expense;
  }

  /** @deprecated use findOneAccessible */
  async findOneForOwner(expenseId: string, ownerId: string): Promise<Expense> {
    return this.findOneAccessible(expenseId, ownerId);
  }

  async create(
    tripId: string,
    userId: string,
    dto: CreateExpenseDto,
  ): Promise<Expense> {
    await this.tripRbacService.assertPermission(
      userId,
      tripId,
      TripPermission.WRITE,
    );
    await this.membersService.findMemberForTrip(dto.payerId, tripId, userId);
    this.validateSplits(dto.amount, dto.splits);

    for (const split of dto.splits) {
      await this.membersService.findMemberForTrip(split.memberId, tripId, userId);
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
    userId: string,
    dto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOneAccessible(expenseId, userId);
    await this.tripRbacService.assertPermission(
      userId,
      expense.tripId,
      TripPermission.WRITE,
    );

    if (dto.payerId) {
      await this.membersService.findMemberForTrip(
        dto.payerId,
        expense.tripId,
        userId,
      );
    }

    if (dto.splits) {
      const amount = dto.amount ?? expense.amount;
      this.validateSplits(amount, dto.splits);
      for (const split of dto.splits) {
        await this.membersService.findMemberForTrip(
          split.memberId,
          expense.tripId,
          userId,
        );
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

  async remove(expenseId: string, userId: string): Promise<void> {
    const expense = await this.findOneAccessible(expenseId, userId);
    await this.tripRbacService.assertPermission(
      userId,
      expense.tripId,
      TripPermission.WRITE,
    );
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
