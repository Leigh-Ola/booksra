import { EmailTypeEnum, EmailStatusEnum } from '../utils/types';
export declare class Email {
    id: number;
    ip: string;
    type: EmailTypeEnum;
    status: EmailStatusEnum;
    data: {
        recipient: string;
        subject: string;
        body: string;
    };
    tries: number;
    createdAt: Date;
    updatedAt: Date;
}
