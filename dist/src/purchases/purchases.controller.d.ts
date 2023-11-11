import { PurchasesService } from './purchases.service';
import { CalculatePurchaseDto, NewPurchaseDto } from './dto/purchases.dto';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    getGenre(req: any, data: CalculatePurchaseDto): Promise<{
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
    createPurchase(req: any, data: NewPurchaseDto): Promise<{
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
        status: import("../utils/types").PaymentStatusEnum;
    }>;
    verifyPurchase(reference: string): Promise<{
        customerEmail: string;
        status: string;
        amount: number;
        code: string;
    }>;
}
