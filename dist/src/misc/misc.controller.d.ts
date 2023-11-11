import { MiscService } from './misc.service';
import { ContactMessageDto, UpdateMessageDto } from './dto/misc-dto';
import { MessageTypesEnum } from '../utils/types';
export declare class MiscController {
    private readonly miscService;
    constructor(miscService: MiscService);
    getGenre(body: ContactMessageDto, ip: string): Promise<never>;
    updateMessage(body: UpdateMessageDto): Promise<void>;
    getMessage(type: MessageTypesEnum): Promise<import("./message.entity").Message>;
}
