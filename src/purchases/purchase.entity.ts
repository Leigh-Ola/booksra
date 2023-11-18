import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Location } from '../location/location.entity';
import { SplitPurchase } from './splitPurchase.entity';
import { PaymentStatusEnum } from '../utils/types';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  code: string;

  @Column({ type: 'json', nullable: false })
  booksData: Array<{
    bookId: number;
    quantity: number;
  }>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;

  @Column({ type: 'boolean', nullable: false })
  isDelivery: boolean;

  @Column({ type: 'numeric', nullable: true, precision: 14, scale: 4 })
  deliveryPrice: number;

  @ManyToOne(() => Location, (location) => location.purchases)
  location: Location;

  @ManyToOne(() => SplitPurchase, (splitPurchase) => splitPurchase.purchases)
  splitPurchase: SplitPurchase;

  @Column({ type: 'numeric', nullable: false, precision: 14, scale: 4 })
  basePrice: number;

  @Column({ type: 'boolean', nullable: false })
  isDiscountApplied: boolean;

  @Column({ type: 'numeric', nullable: false, precision: 14, scale: 4 })
  finalPrice: number;

  @Column({
    type: 'numeric',
    nullable: false,
    precision: 14,
    scale: 4,
    default: 0,
  })
  paidAmount: number;

  @Column({ type: 'enum', enum: PaymentStatusEnum, nullable: false })
  paymentStatus: PaymentStatusEnum;

  @Column({ type: 'varchar', nullable: true })
  paymentReference: string; // jt0x37agm9
  // NOTE: Remember to change paystack business name from "My Business"

  @Column({ type: 'varchar', nullable: true })
  paymentAccessCode: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  deletedAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
