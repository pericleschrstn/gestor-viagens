import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Currency } from '../../common/enums/currency.enum';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';
import { TripMember } from '../../members/entities/trip-member.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { ExpenseSplit } from './expense-split.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'trip_id' })
  tripId!: string;

  @Column()
  description!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: string;

  @Column({ type: 'enum', enum: Currency })
  currency!: Currency;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'enum', enum: ExpenseCategory })
  category!: ExpenseCategory;

  @Column({ name: 'payer_id' })
  payerId!: string;

  @Column({ type: 'varchar', name: 'receipt_url', nullable: true })
  receiptUrl!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Trip, (trip) => trip.expenses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @ManyToOne(() => TripMember, (member) => member.paidExpenses, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'payer_id' })
  payer!: TripMember;

  @OneToMany(() => ExpenseSplit, (split) => split.expense, { cascade: true })
  splits!: ExpenseSplit[];
}
