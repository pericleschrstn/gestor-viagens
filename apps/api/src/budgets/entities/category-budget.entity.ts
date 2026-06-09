import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';
import { Trip } from '../../trips/entities/trip.entity';

@Entity('category_budgets')
@Unique(['tripId', 'category'])
export class CategoryBudget {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'trip_id' })
  tripId!: string;

  @Column({ type: 'enum', enum: ExpenseCategory })
  category!: ExpenseCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'limit_amount' })
  limitAmount!: string;

  @ManyToOne(() => Trip, (trip) => trip.categoryBudgets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;
}
