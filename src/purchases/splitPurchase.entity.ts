import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Purchase } from '../purchases/purchase.entity';

@Entity()
export class SplitPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'numeric',
    nullable: false,
    precision: 14,
    scale: 4,
    default: 0,
  })
  amount: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  // purchases
  @OneToMany(() => Purchase, (purchase) => purchase.splitPurchase)
  purchases: Purchase[];
}
