import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  // ip
  @Column({ type: 'varchar', length: 255, nullable: true })
  ip: string;

  // name. required
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  // email. required
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  // company
  @Column({ type: 'varchar', length: 255, nullable: true })
  company: string;

  // message. required
  @Column({ type: 'varchar', length: 2000, nullable: true })
  message: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
