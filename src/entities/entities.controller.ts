import { Controller, Get } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { EntityService } from './entities.service';

@Controller('entities')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Get('/genre')
  async getGenre(@Query('q') q: string) {
    return this.entityService.findGenre(q);
  }

  @Get('/category')
  async getCategory(@Query('q') q: string) {
    return this.entityService.findCategory(q);
  }

  @Get('/age-range')
  async getAgeRange(@Query('q') q: string) {
    return this.entityService.findAgeRange(q);
  }
}
