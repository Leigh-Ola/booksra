import { Controller, Query, Get } from '@nestjs/common';
import { BackgroundJobsService } from './background-jobs.service';

@Controller('background-jobs')
export class BackgroundJobsController {
  constructor(private readonly backgroundJobsService: BackgroundJobsService) {}

  // every day at 00:01 (cron job)
  @Get('/delete-old-books')
  async getGenre(@Query('code') code: string) {
    await this.backgroundJobsService.validateCronCode(code);
    this.backgroundJobsService.deleteOldBooks();
  }

  // every 1 hour (cron job)
  @Get('/update-discount-statuses')
  async checkDiscountStatus(@Query('code') code: string) {
    await this.backgroundJobsService.validateCronCode(code);
    this.backgroundJobsService.updateDiscountStatuses();
  }

  // every 5 minutes (cron job)
  @Get('/check-payment-statuses')
  async checkPaymentStatus(@Query('code') code: string) {
    await this.backgroundJobsService.validateCronCode(code);
    this.backgroundJobsService.checkPaymentStatuses();
  }

  // every 10 minutes (cron job)
  @Get('/send-emails')
  async sendEmails(@Query('code') code: string) {
    await this.backgroundJobsService.validateCronCode(code);
    this.backgroundJobsService.sendEmails();
  }

  // just to test
  @Get('/test')
  async testCronJobs(@Query('code') code: string) {
    await this.backgroundJobsService.validateCronCode(code);
    return await this.backgroundJobsService.testCron();
  }
}
