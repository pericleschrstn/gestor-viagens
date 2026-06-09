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
import { TripStatus } from '../../common/enums/trip-status.enum';
import { CategoryBudget } from '../../budgets/entities/category-budget.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { Settlement } from '../../settlements/entities/settlement.entity';
import { TripMember } from '../../members/entities/trip-member.entity';
import { User } from '../../users/entities/user.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ length: 4 })
  initials!: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate!: string;

  @Column({ type: 'date', name: 'end_date' })
  endDate!: string;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.PLANNING })
  status!: TripStatus;

  @Column({
    type: 'enum',
    enum: Currency,
    name: 'base_currency',
    default: Currency.BRL,
  })
  baseCurrency!: Currency;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'total_budget',
    nullable: true,
  })
  totalBudget!: string | null;

  @Column({ name: 'owner_id' })
  ownerId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.trips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @OneToMany(() => TripMember, (member) => member.trip)
  members!: TripMember[];

  @OneToMany(() => Expense, (expense) => expense.trip)
  expenses!: Expense[];

  @OneToMany(() => CategoryBudget, (budget) => budget.trip)
  categoryBudgets!: CategoryBudget[];

  @OneToMany(() => Settlement, (settlement) => settlement.trip)
  settlements!: Settlement[];
}
