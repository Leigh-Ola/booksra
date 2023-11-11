import { EntityManager, DataSource } from 'typeorm';
import { ContactMessageDto, UpdateMessageDto } from './dto/misc-dto';
import { Message } from './message.entity';
import { MessageTypesEnum } from '../utils/types';
export declare class MiscService {
    private dbSource;
    manager: EntityManager;
    constructor(dbSource: DataSource);
    sendEmail(ip: string, body: ContactMessageDto): Promise<never>;
    updateMessage(body: UpdateMessageDto): Promise<void>;
    getMessage(type: MessageTypesEnum): Promise<Message>;
}
