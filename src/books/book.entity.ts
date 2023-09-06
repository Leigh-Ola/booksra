import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { BookCoversEnum } from '../utils/types';
import { Genre } from './genre.entity';
import { Category } from './category.entity';
import { AgeRange } from './age-range.entity';
import { Discount } from '../discount/discount.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'varchar', nullable: false })
  imageUrl: string;

  @Column({ type: 'varchar', length: 30, unique: true, nullable: false })
  code: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: BookCoversEnum, nullable: true })
  cover: BookCoversEnum | null;

  @Column({ type: 'bigint', default: 0, nullable: false })
  amountInStock: number;

  @CreateDateColumn({
    type: 'time with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'time with time zone',
  })
  updatedAt: Date;

  // discount price
  @Column({
    type: 'numeric',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  discountPrice: number | null;

  // price, use numeric type
  @Column({ type: 'numeric', nullable: false, precision: 10, scale: 2 })
  price: number;

  // FOREIGN KEYS
  // discount
  @Column({ type: 'int', nullable: true })
  discountId: number | null;

  // ie.: 'children'. will be a relation
  @Index()
  @Column({ type: 'bigint', nullable: true })
  categoryId: number | null;

  // ie: '5-11'. will be a relation
  @Index()
  @Column({ type: 'bigint', nullable: true })
  ageRangeId: number | null;

  // RELATIONS
  // genre, one to many
  @ManyToMany(() => Genre, (genre) => genre.books, {
    cascade: true,
  })
  genres: Genre[];

  // category, many to one
  @ManyToOne(() => Category, (category) => category.books)
  category: Category;

  // age range, many to one
  @ManyToOne(() => AgeRange, (agerange) => agerange.books)
  ageRange: AgeRange;

  // discount, many to one
  @ManyToOne(() => Discount, (discount) => discount.books)
  discount: Discount;
}
