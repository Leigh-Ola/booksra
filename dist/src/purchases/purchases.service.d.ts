import { EntityManager, DataSource } from 'typeorm';
import { PaymentStatusEnum } from '../utils/types';
import { CalculatePurchaseDto, NewPurchaseDto } from './dto/purchases.dto';
import { Purchase } from '../purchases/purchase.entity';
export declare class PurchasesService {
    private dbSource;
    manager: EntityManager;
    constructor(dbSource: DataSource);
    private getSplitPurchase;
    private verifyPurchase;
    verifyPurchasePayment(uniqueCode: string, purchase?: Purchase | null): Promise<{
        customerEmail: string;
        status: string;
        amount: number;
        code: string;
    }>;
    private initiatePurchase;
    createPurchase(data: NewPurchaseDto, userId: number): Promise<{
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
        purchaseUrl: string;
        code: string;
        status: PaymentStatusEnum;
    }>;
    private calculateBooksPrice;
    calculatePurchase(data: CalculatePurchaseDto, userId: number): Promise<{
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
}
