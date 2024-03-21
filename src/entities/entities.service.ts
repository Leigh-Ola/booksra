import { Injectable } from '@nestjs/common';
import { ILike, EntityManager, DataSource, Not, IsNull } from 'typeorm';
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
          where: {
            ...(q ? { name: ILike(`%${q}%`) } : {}),
            books: {
              id: Not(IsNull()),
            },
          },
          select: ['name'],
          relations: {
            books: true,
          },
        })
      )?.map((item) => {
        return item.name;
      }) || []
    );
  }

  // find category
  async findCategory(q: string) {
    return (
      (
        await this.manager.find(Category, {
          where: {
            ...(q ? { name: ILike(`%${q}%`) } : {}),
            books: {
              id: Not(IsNull()),
            },
          },
          select: ['name'],
          relations: {
            books: true,
          },
        })
      )?.map((item) => {
        return item.name;
      }) || []
    );
  }

  // find age range
  async findAgeRange(q: string) {
    return (
      (
        await this.manager.find(AgeRange, {
          where: {
            ...(q ? { name: ILike(`%${q}%`) } : {}),
            books: {
              id: Not(IsNull()),
            },
          },
          select: ['name'],
          relations: {
            books: true,
          },
        })
      )?.map((item) => {
        return item.name;
      }) || []
    );
  }
}
