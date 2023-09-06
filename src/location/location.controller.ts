import {
  Post,
  Put,
  Param,
  UseGuards,
  Body,
  Controller,
  Delete,
  Get,
} from '@nestjs/common';
import { IsAdminUser } from '../users/users-guard';
import { CreateLocationDto, UpdateLocationDto } from './dto/location-dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationsService: LocationService) {}

  // create location
  @Post()
  @UseGuards(IsAdminUser)
  async create(@Body() location: CreateLocationDto) {
    return this.locationsService.create(location);
  }

  // update location
  @Put(':id')
  @UseGuards(IsAdminUser)
  async update(@Param('id') id: number, @Body() data: UpdateLocationDto) {
    return this.locationsService.update(id, data);
  }

  // get all matched locations
  @Get()
  async findAll() {
    return this.locationsService.getLocations();
  }

  // soft-delete location
  @Delete(':id')
  @UseGuards(IsAdminUser)
  async delete(@Param('id') id: number) {
    return this.locationsService.delete(id);
  }
}
