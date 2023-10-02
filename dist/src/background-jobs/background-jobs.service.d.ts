import { EntityManager, DataSource } from 'typeorm';
export declare class BackgroundJobsService {
    private dbSource;
    manager: EntityManager;
    constructor(dbSource: DataSource);
    deleteOldBooks(code: any): Promise<never>;
    updateDiscountStatuses(code: any): Promise<never>;
}
