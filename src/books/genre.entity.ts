// genre with id, name, createdAt, updatedAt
// relation of book table
// a genre can have many books, a book can have multiple genres

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  name: string;

  @ManyToMany(() => Book, (book) => book.genres)
  @JoinTable({})
  books: Book[];
}
