// category with id, name, createdAt, updatedAt
// relation of book table
// a category can have many books, a book can have one category

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Book } from './book.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  name: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
