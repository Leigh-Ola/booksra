import { Controller, Query, Get } from '@nestjs/common';
import { BackgroundJobsService } from './background-jobs.service';

@Controller('background-jobs')
export class BackgroundJobsController {
  constructor(private readonly backgroundJobsService: BackgroundJobsService) {}

  @Get('/delete-old-books')
  async getGenre(@Query('code') code: string) {
    return this.backgroundJobsService.deleteOldBooks(code);
  }

  @Get('/update-discount-statuses')
  async checkDiscountStatus(@Query('code') code: string) {
    return this.backgroundJobsService.updateDiscountStatuses(code);
  }
}
