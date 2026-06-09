import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TripMember } from '../../members/entities/trip-member.entity';
import { Expense } from './expense.entity';

@Entity('expense_splits')
export class ExpenseSplit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'expense_id' })
  expenseId!: string;

  @Column({ name: 'member_id' })
  memberId!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  share!: string;

  @ManyToOne(() => Expense, (expense) => expense.splits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expense_id' })
  expense!: Expense;

  @ManyToOne(() => TripMember, (member) => member.expenseSplits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member!: TripMember;
}
