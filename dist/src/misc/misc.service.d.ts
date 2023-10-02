import { EntityManager, DataSource } from 'typeorm';
import { ContactMessageDto } from './dto/misc-dto';
export declare class MiscService {
    private dbSource;
    manager: EntityManager;
    constructor(dbSource: DataSource);
    sendEmail(ip: string, body: ContactMessageDto): Promise<never>;
}
