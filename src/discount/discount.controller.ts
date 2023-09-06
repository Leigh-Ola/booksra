import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/discount-dto';
import { DiscountService } from './discount.service';
import { IsAdminUser } from '../users/users-guard';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  // create discount
  @Post()
  @UseGuards(IsAdminUser)
  async create(@Body() discount: CreateDiscountDto) {
    return await this.discountService.create(discount);
  }

  // get matching discounts
  @Get()
  @UseGuards(IsAdminUser)
  async getDiscounts(
    @Query('query') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.discountService.find({ page, limit, query });
  }

  // delete discount
  @Delete()
  @UseGuards(IsAdminUser)
  async delete(@Body('id') id: number) {
    return await this.discountService.delete(id);
  }
}
