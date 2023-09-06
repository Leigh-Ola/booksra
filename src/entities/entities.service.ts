import { Injectable } from '@nestjs/common';
import { ILike, EntityManager, DataSource } from 'typeorm';
import { Genre } from '../books/genre.entity';
import { Category } from '../books/category.entity';
import { AgeRange } from '../books/age-range.entity';

@Injectable()
export class EntityService {
  manager: EntityManager;
  constructor(private dbSource: DataSource) {
    this.manager = this.dbSource.manager;
  }

  // find genre
  async findGenre(q: string) {
    return (
      (
        await this.manager.find(Genre, {
          where: { name: ILike(`%${q}%`) },
          select: ['name'],
        })
      ).map((item) => item.name) || []
    );
  }

  // find category
  async findCategory(q: string) {
    return (
      (
        await this.manager.find(Category, {
          where: { name: ILike(`%${q}%`) },
          select: ['name'],
        })
      ).map((item) => item.name) || []
    );
  }

  // find age range
  async findAgeRange(q: string) {
    return (
      (
        await this.manager.find(AgeRange, {
          where: { name: ILike(`%${q}%`) },
          select: ['name'],
        })
      )?.map((item) => item.name) || []
    );
  }
}
