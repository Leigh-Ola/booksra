import { Test, TestingModule } from '@nestjs/testing';
import { BackgroundJobsController } from './background-jobs.controller';

describe('BackgroundJobsController', () => {
  let controller: BackgroundJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackgroundJobsController],
    }).compile();

    controller = module.get<BackgroundJobsController>(BackgroundJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
