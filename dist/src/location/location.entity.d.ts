import { Purchase } from '../purchases/purchase.entity';
export declare class Location {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    purchases: Purchase[];
}
