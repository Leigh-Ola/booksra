import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MessageTypesEnum } from '../utils/types';
import { max } from 'lodash';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  // type
  @Column({
    type: 'enum',
    enum: MessageTypesEnum,
    default: MessageTypesEnum.BANNER,
  })
  type: MessageTypesEnum;

  // message. required
  @Column({ type: 'varchar', length: 10000, nullable: false })
  message: string;
}
