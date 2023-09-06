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
} from 'typeorm';

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
    type: 'time with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'time with time zone',
  })
  updatedAt: Date;

  // deletedAt
  @DeleteDateColumn({
    type: 'time with time zone',
  })
  deletedAt: Date;
}
