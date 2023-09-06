import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ChangePassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  token: string;

  @UpdateDateColumn({
    type: 'time with time zone',
  })
  updatedAt: Date;

  // foreign keys
  @Column({ type: 'int', nullable: false, unique: true })
  userId: number;

  // relations
  @OneToOne(() => User, (user) => user.passwordToken)
  @JoinColumn()
  user: User;
}
