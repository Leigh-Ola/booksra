// discount, relation of book table
// a discount can have many books, a book can have one discount
/*
The discount entity should have the following columns:
    Books (one to many relationship)
    couponCode?
    Type (fixed/percentage) (enum)
    Value (numeric) (precision 10, scale 2)
    StartDate
    EndDate
    isActive (boolean)
*/
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from '../books/book.entity';
import { DiscountTypeEnum } from '../utils/types';
@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true, unique: true })
  couponCode: string;

  @Column({ type: 'enum', enum: DiscountTypeEnum, nullable: false })
  type: DiscountTypeEnum;

  @Column({ type: 'numeric', nullable: false, precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'timestamp with time zone', nullable: false })
  startDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: false })
  endDate: Date;

  @Column({ type: 'boolean', nullable: false })
  isActive: boolean;

  @CreateDateColumn({
    type: 'time with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'time with time zone',
  })
  updatedAt: Date;

  // RELATIONS
  // books
  @OneToMany(() => Book, (book) => book.discount, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  books: Book[];
}
