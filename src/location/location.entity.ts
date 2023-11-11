/*
The location entity should have the following columns:
Name
Description
Delivery Price
[createdAt]
[updatedAt]
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Purchase } from '../purchases/purchase.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'numeric', nullable: false, precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  // deletedAt
  @DeleteDateColumn({
    type: 'timestamp with time zone',
  })
  deletedAt: Date;

  // purchases
  @OneToMany(() => Purchase, (purchase) => purchase.location)
  purchases: Purchase[];
}
