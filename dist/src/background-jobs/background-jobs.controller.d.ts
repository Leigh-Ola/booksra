import { BackgroundJobsService } from './background-jobs.service';
export declare class BackgroundJobsController {
    private readonly backgroundJobsService;
    constructor(backgroundJobsService: BackgroundJobsService);
    getGenre(code: string): Promise<void>;
    checkDiscountStatus(code: string): Promise<void>;
    checkPaymentStatus(code: string): Promise<void>;
    sendEmails(code: string): Promise<void>;
}
