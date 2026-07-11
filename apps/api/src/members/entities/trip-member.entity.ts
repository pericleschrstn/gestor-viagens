import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TripMemberRole } from '../../common/enums/trip-member-role.enum';
import { Expense } from '../../expenses/entities/expense.entity';
import { ExpenseSplit } from '../../expenses/entities/expense-split.entity';
import { Settlement } from '../../settlements/entities/settlement.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { User } from '../../users/entities/user.entity';

@Entity('trip_members')
export class TripMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'trip_id' })
  tripId!: string;

  @Column()
  name!: string;

  @Column({ length: 4 })
  initials!: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId!: string | null;

  @Column({
    type: 'enum',
    enum: TripMemberRole,
    nullable: true,
  })
  role!: TripMemberRole | null;

  @ManyToOne(() => Trip, (trip) => trip.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;

  @OneToMany(() => Expense, (expense) => expense.payer)
  paidExpenses!: Expense[];

  @OneToMany(() => ExpenseSplit, (split) => split.member)
  expenseSplits!: ExpenseSplit[];

  @OneToMany(() => Settlement, (settlement) => settlement.fromMember)
  settlementsFrom!: Settlement[];

  @OneToMany(() => Settlement, (settlement) => settlement.toMember)
  settlementsTo!: Settlement[];
}
