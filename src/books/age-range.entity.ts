// age range with id, name, createdAt, updatedAt
// relation of book table
// an age range can have many books, a book can have one age range

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Book } from './book.entity';

@Entity()
export class AgeRange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: true, unique: true })
  name: string;

  @OneToMany(() => Book, (book) => book.ageRange)
  books: Book[];
}
