import { EntityManager, DataSource } from 'typeorm';
import { PurchasesService } from '../purchases/purchases.service';
export declare class BackgroundJobsService {
    private dbSource;
    private purchasesService;
    manager: EntityManager;
    constructor(dbSource: DataSource, purchasesService: PurchasesService);
    validateCronCode(code: any): Promise<never>;
    deleteOldBooks(): Promise<void>;
    updateDiscountStatuses(): Promise<void>;
    checkPaymentStatuses(): Promise<void>;
    sendEmails(): Promise<void>;
}
