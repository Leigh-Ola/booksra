import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmailTypeEnum, EmailStatusEnum } from '../utils/types';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  // ip
  @Column({ type: 'varchar', length: 255, nullable: true })
  ip: string;

  // type (enum)
  @Column({
    type: 'enum',
    enum: EmailTypeEnum,
    default: EmailTypeEnum.OTHER,
  })
  type: EmailTypeEnum;

  // status (enum)
  @Column({
    type: 'enum',
    enum: EmailStatusEnum,
    default: EmailStatusEnum.PENDING,
  })
  status: EmailStatusEnum;

  @Column({ type: 'json', nullable: false })
  data: {
    recipient: string;
    subject: string;
    body: string;
  };

  // retries (default 0)
  @Column({ type: 'int2', default: 0 })
  tries: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
