import { MiscService } from './misc.service';
import { ContactMessageDto } from './dto/misc-dto';
export declare class MiscController {
    private readonly miscService;
    constructor(miscService: MiscService);
    getGenre(body: ContactMessageDto, ip: string): Promise<never>;
}
