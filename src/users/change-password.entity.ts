import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ChangePassword {
  // userId will be the same as the user id
  // code will be the code sent to the user, 6 digits
  // updatedAt will be the time the code was sent
  // createdAt will be the time the code was created
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
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
