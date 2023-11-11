// import required decorators
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
// import entities
import { Location } from './location.entity';
// import dto
import { CreateLocationDto, UpdateLocationDto } from './dto/location-dto';
import { pick, merge } from 'lodash';
import { throwBadRequest } from '../utils/helpers';

@Injectable()
export class LocationService {
  manager: EntityManager;
  constructor(private dbSource: DataSource) {
    this.manager = this.dbSource.manager;
  }

  // create location
  async create(locationDto: CreateLocationDto) {
    // pick the required fields
    locationDto = pick(locationDto, ['name', 'description', 'price']);
    if (!locationDto.name) {
      return;
    }
    locationDto.name = locationDto.name.trim().toLowerCase();
    // create the location
    const location = await this.manager.create(Location, locationDto);
    // save the location
    await this.manager.save(Location, location);
  }

  // update location
  async update(id: number, locationDto: UpdateLocationDto) {
    // pick the required fields
    locationDto = pick(locationDto, ['name', 'description', 'price']);
    if (!Object.keys(locationDto).length) {
      return;
    }
    // find the location
    const location = await this.manager.findOne(Location, {
      where: {
        id,
      },
    });
    // if the location doesn't exist, throw an error
    if (!location) {
      return throwBadRequest('This location does not exist');
    }
    if (locationDto.name) {
      locationDto.name = locationDto.name.trim().toLowerCase();
      // check if the location name already exists
      const locationName = await this.manager.findOne(Location, {
        where: {
          name: locationDto.name,
        },
      });
      // if the location name already exists, throw an error
      if (locationName) {
        return throwBadRequest('This location name already exists');
      }
    }
    // merge the location
    merge(location, locationDto);
    // save the location
    await this.manager.save(Location, location);
  }

  // get all locations
  async getLocations() {
    return (
      (
        await this.manager.find(Location, {
          relations: ['purchases'],
        })
      )?.map((location) => {
        return pick(location, ['id', 'name', 'description', 'price']);
      }) || []
    );
  }

  // soft delete location
  async delete(id: number) {
    // find the location
    const location = await this.manager.findOne(Location, {
      where: {
        id,
      },
    });
    // if the location doesn't exist, throw an error
    if (!location) {
      return throwBadRequest('This location does not exist');
    }
    // soft delete the location
    await this.manager.softDelete(Location, {
      id,
    });
  }
}
