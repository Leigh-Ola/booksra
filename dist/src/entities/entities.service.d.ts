import { EntityManager, DataSource } from 'typeorm';
export declare class EntityService {
    private dbSource;
    manager: EntityManager;
    constructor(dbSource: DataSource);
    findGenre(q: string): Promise<string[]>;
    findCategory(q: string): Promise<string[]>;
    findAgeRange(q: string): Promise<string[]>;
}
