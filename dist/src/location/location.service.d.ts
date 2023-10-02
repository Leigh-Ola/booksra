import { DataSource, EntityManager } from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto, UpdateLocationDto } from './dto/location-dto';
export declare class LocationService {
    private dbSource;
    manager: EntityManager;
    constructor(dbSource: DataSource);
    create(locationDto: CreateLocationDto): Promise<void>;
    update(id: number, locationDto: UpdateLocationDto): Promise<never>;
    getLocations(): Promise<Pick<Location, keyof Location>[]>;
    delete(id: number): Promise<never>;
}
