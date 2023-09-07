import { CreateLocationDto, UpdateLocationDto } from './dto/location-dto';
import { LocationService } from './location.service';
export declare class LocationController {
    private readonly locationsService;
    constructor(locationsService: LocationService);
    create(location: CreateLocationDto): Promise<void>;
    update(id: number, data: UpdateLocationDto): Promise<never>;
    findAll(): Promise<Pick<import("./location.entity").Location, keyof import("./location.entity").Location>[]>;
    delete(id: number): Promise<never>;
}
