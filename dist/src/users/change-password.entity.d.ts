import { User } from './user.entity';
export declare class ChangePassword {
    id: number;
    token: string;
    updatedAt: Date;
    userId: number;
    user: User;
}
