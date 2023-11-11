import { Purchase } from '../purchases/purchase.entity';
export declare class SplitPurchase {
    id: number;
    amount: number;
    createdAt: Date;
    purchases: Purchase[];
}
