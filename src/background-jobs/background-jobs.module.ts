import { Module } from '@nestjs/common';
import { BackgroundJobsController } from './background-jobs.controller';
import { BackgroundJobsService } from './background-jobs.service';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [PurchasesModule],
  controllers: [BackgroundJobsController],
  providers: [BackgroundJobsService],
})
export class BackgroundJobsModule {}
