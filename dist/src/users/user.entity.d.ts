import { AppAccessLevelsEnum } from '../utils/types';
import { ChangePassword } from './change-password.entity';
import { Purchase } from '../purchases/purchase.entity';
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    address: string;
    companyName: string;
    country: string;
    town: string;
    state: string;
    zipCode: string;
    role: AppAccessLevelsEnum;
    passwordToken: ChangePassword;
    purchases: Purchase[];
}
