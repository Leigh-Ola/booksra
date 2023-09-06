import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { AppAccessLevelsEnum } from '../utils/types';
import { ChangePassword } from './change-password.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // first name
  @Column({ type: 'varchar', length: 30, nullable: true })
  firstName: string;

  // last name
  @Column({ type: 'varchar', length: 30, nullable: true })
  lastName: string;

  // email. required
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  // password
  @Column({ type: 'varchar', nullable: true })
  password: string;

  // phone number
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string;

  @CreateDateColumn({
    type: 'time with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'time with time zone',
  })
  updatedAt: Date;

  // address
  @Column({ type: 'varchar', default: '', nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  companyName: string;

  // country
  @Column({ type: 'varchar', length: 255, nullable: true })
  country: string;

  // town
  @Column({ type: 'varchar', length: 255, nullable: true })
  town: string;

  // state
  @Column({ type: 'varchar', length: 255, nullable: true })
  state: string;

  // role
  @Column({
    type: 'enum',
    enum: AppAccessLevelsEnum,
    default: AppAccessLevelsEnum.USER,
  })
  role: AppAccessLevelsEnum;

  // relations
  @OneToOne(() => ChangePassword, (changePassword) => changePassword.user)
  passwordToken: ChangePassword;
}
