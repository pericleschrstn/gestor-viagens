import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TripMember } from '../../members/entities/trip-member.entity';
import { Trip } from '../../trips/entities/trip.entity';

@Entity('settlements')
export class Settlement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'trip_id' })
  tripId!: string;

  @Column({ name: 'from_member_id' })
  fromMemberId!: string;

  @Column({ name: 'to_member_id' })
  toMemberId!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: string;

  @CreateDateColumn({ name: 'settled_at' })
  settledAt!: Date;

  @ManyToOne(() => Trip, (trip) => trip.settlements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @ManyToOne(() => TripMember, (member) => member.settlementsFrom, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'from_member_id' })
  fromMember!: TripMember;

  @ManyToOne(() => TripMember, (member) => member.settlementsTo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'to_member_id' })
  toMember!: TripMember;
}
