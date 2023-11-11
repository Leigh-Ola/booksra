import { User } from '../users/user.entity';
import { Location } from '../location/location.entity';
import { SplitPurchase } from './splitPurchase.entity';
import { PaymentStatusEnum } from '../utils/types';
export declare class Purchase {
    id: number;
    code: string;
    booksData: Array<{
        bookId: number;
        quantity: number;
    }>;
    notes: string;
    createdAt: Date;
    user: User;
    isDelivery: boolean;
    deliveryPrice: number;
    location: Location;
    splitPurchase: SplitPurchase;
    basePrice: number;
    isDiscountApplied: boolean;
    finalPrice: number;
    paidAmount: number;
    paymentStatus: PaymentStatusEnum;
    paymentReference: string;
    paymentAccessCode: string;
    emailSent: boolean;
    deletedAt: Date;
    updatedAt: Date;
}
