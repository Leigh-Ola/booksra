import { BackgroundJobsService } from './background-jobs.service';
export declare class BackgroundJobsController {
    private readonly backgroundJobsService;
    constructor(backgroundJobsService: BackgroundJobsService);
    getGenre(code: string): Promise<never>;
    checkDiscountStatus(code: string): Promise<never>;
}
