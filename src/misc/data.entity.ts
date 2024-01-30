import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MessageTypesEnum } from '../utils/types';

@Entity()
export class Data {
  @PrimaryGeneratedColumn()
  id: number;

  // type. required
  @Column({
    type: 'enum',
    enum: MessageTypesEnum,
    nullable: false,
  })
  type: MessageTypesEnum;

  // data. required
  @Column({ type: 'varchar', length: 10000, nullable: false })
  data: string;

  // isBoolean
  @Column({ type: 'boolean', default: false })
  isBoolean: boolean;
}
