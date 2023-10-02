import { EntityManager, DataSource } from 'typeorm';
import { CalculatePurchaseDto } from './dto/purchases.dto';
export declare class PurchasesService {
    private dbSource;
    manager: EntityManager;
    constructor(dbSource: DataSource);
    calculatePurchase(data: CalculatePurchaseDto, userId: string): Promise<{
        data: {
            bookIds: number[];
            totalBookCopiesCount: number;
            totalBooksBasePrice: number;
            isDiscountApplied: boolean;
            booksOnSaleCount: number;
            isDelivery: boolean;
            deliveryPrice: number;
        };
        finalPrice: number;
    }>;
    createPurchase(data: CalculatePurchaseDto, userId: string): Promise<void>;
    private calculateBooksPrice;
}
