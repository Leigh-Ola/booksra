import { MessageTypesEnum } from '../../utils/types';
export declare class ContactMessageDto {
    name: string;
    email: string;
    company?: string;
    message: string;
}
export declare class UpdateMessageDto {
    message: string;
    type: MessageTypesEnum;
}
