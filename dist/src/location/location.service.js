"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const location_entity_1 = require("./location.entity");
const lodash_1 = require("lodash");
const helpers_1 = require("../utils/helpers");
let LocationService = class LocationService {
    constructor(dbSource) {
        this.dbSource = dbSource;
        this.manager = this.dbSource.manager;
    }
    async create(locationDto) {
        locationDto = (0, lodash_1.pick)(locationDto, ['name', 'description', 'price']);
        if (!locationDto.name) {
            return;
        }
        locationDto.name = locationDto.name.trim().toLowerCase();
        const location = await this.manager.create(location_entity_1.Location, locationDto);
        await this.manager.save(location_entity_1.Location, location);
    }
    async update(id, locationDto) {
        locationDto = (0, lodash_1.pick)(locationDto, ['name', 'description', 'price']);
        if (!Object.keys(locationDto).length) {
            return;
        }
        const location = await this.manager.findOne(location_entity_1.Location, {
            where: {
                id,
            },
        });
        if (!location) {
            return (0, helpers_1.throwBadRequest)('This location does not exist');
        }
        if (locationDto.name) {
            locationDto.name = locationDto.name.trim().toLowerCase();
            const locationName = await this.manager.findOne(location_entity_1.Location, {
                where: {
                    name: locationDto.name,
                },
            });
            if (locationName) {
                return (0, helpers_1.throwBadRequest)('This location name already exists');
            }
        }
        (0, lodash_1.merge)(location, locationDto);
        await this.manager.save(location_entity_1.Location, location);
    }
    async getLocations() {
        return ((await this.manager.find(location_entity_1.Location, {
            relations: ['purchases'],
        }))?.map((location) => {
            return (0, lodash_1.pick)(location, ['id', 'name', 'description', 'price']);
        }) || []);
    }
    async delete(id) {
        const location = await this.manager.findOne(location_entity_1.Location, {
            where: {
                id,
            },
        });
        if (!location) {
            return (0, helpers_1.throwBadRequest)('This location does not exist');
        }
        await this.manager.softDelete(location_entity_1.Location, {
            id,
        });
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], LocationService);
//# sourceMappingURL=location.service.js.map