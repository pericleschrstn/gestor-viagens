import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  convertAmount,
  parseDecimal,
} from '../common/utils/currency.util';
import { Expense } from '../expenses/entities/expense.entity';
import { TripMember } from '../members/entities/trip-member.entity';
import { TripsService } from '../trips/trips.service';
import { Trip } from '../trips/entities/trip.entity';
import { SettleDto } from './dto/settle.dto';
import { Settlement } from './entities/settlement.entity';

export interface MemberBalance {
  memberId: string;
  memberName: string;
  initials: string;
  paid: number;
  owed: number;
  balance: number;
}

@Injectable()
export class SettlementsService {
  constructor(
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(TripMember)
    private readonly memberRepository: Repository<TripMember>,
    private readonly tripsService: TripsService,
  ) {}

  async getBalances(tripId: string, ownerId: string) {
    const trip = await this.tripsService.findOneForOwner(tripId, ownerId);
    const balances = await this.calculateBalances(trip);
    return balances;
  }

  async getSuggestedSettlements(tripId: string, ownerId: string) {
    const trip = await this.tripsService.findOneForOwner(tripId, ownerId);
    const balances = await this.calculateBalances(trip);
    return this.minimizeTransfers(balances);
  }

  async settle(tripId: string, ownerId: string, dto: SettleDto) {
    await this.tripsService.findOneForOwner(tripId, ownerId);

    const records = dto.settlements.map((item) =>
      this.settlementRepository.create({
        tripId,
        fromMemberId: item.fromMemberId,
        toMemberId: item.toMemberId,
        amount: item.amount,
      }),
    );

    return this.settlementRepository.save(records);
  }

  private async calculateBalances(trip: Trip): Promise<MemberBalance[]> {
    const members = await this.memberRepository.find({
      where: { tripId: trip.id },
    });

    const expenses = await this.expenseRepository.find({
      where: { tripId: trip.id },
      relations: ['splits'],
    });

    const paidMap = new Map<string, number>();
    const owedMap = new Map<string, number>();

    for (const member of members) {
      paidMap.set(member.id, 0);
      owedMap.set(member.id, 0);
    }

    for (const expense of expenses) {
      const amount = convertAmount(
        parseDecimal(expense.amount),
        expense.currency,
        trip.baseCurrency,
      );
      paidMap.set(
        expense.payerId,
        (paidMap.get(expense.payerId) ?? 0) + amount,
      );

      for (const split of expense.splits) {
        const share = convertAmount(
          parseDecimal(split.share),
          expense.currency,
          trip.baseCurrency,
        );
        owedMap.set(split.memberId, (owedMap.get(split.memberId) ?? 0) + share);
      }
    }

    return members.map((member) => {
      const paid = paidMap.get(member.id) ?? 0;
      const owed = owedMap.get(member.id) ?? 0;
      return {
        memberId: member.id,
        memberName: member.name,
        initials: member.initials,
        paid,
        owed,
        balance: paid - owed,
      };
    });
  }

  private minimizeTransfers(balances: MemberBalance[]) {
    const creditors = balances
      .filter((item) => item.balance > 0.01)
      .map((item) => ({ ...item }))
      .sort((a, b) => b.balance - a.balance);

    const debtors = balances
      .filter((item) => item.balance < -0.01)
      .map((item) => ({ ...item, balance: Math.abs(item.balance) }))
      .sort((a, b) => b.balance - a.balance);

    const transfers: {
      fromMemberId: string;
      fromMemberName: string;
      toMemberId: string;
      toMemberName: string;
      amount: number;
    }[] = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i]!;
      const creditor = creditors[j]!;
      const amount = Math.min(debtor.balance, creditor.balance);

      if (amount > 0.01) {
        transfers.push({
          fromMemberId: debtor.memberId,
          fromMemberName: debtor.memberName,
          toMemberId: creditor.memberId,
          toMemberName: creditor.memberName,
          amount: Number(amount.toFixed(2)),
        });
      }

      debtor.balance -= amount;
      creditor.balance -= amount;

      if (debtor.balance <= 0.01) i++;
      if (creditor.balance <= 0.01) j++;
    }

    return transfers;
  }
}
