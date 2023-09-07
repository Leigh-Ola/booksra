import { EntityService } from './entities.service';
export declare class EntityController {
    private readonly entityService;
    constructor(entityService: EntityService);
    getGenre(q: string): Promise<string[]>;
    getCategory(q: string): Promise<string[]>;
    getAgeRange(q: string): Promise<string[]>;
}
