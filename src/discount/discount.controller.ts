import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount-dto';
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

  // update discount
  @Put(':id')
  @UseGuards(IsAdminUser)
  async update(@Param('id') id: number, @Body() discount: UpdateDiscountDto) {
    return await this.discountService.update(id, discount);
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
  @Delete(':id')
  @UseGuards(IsAdminUser)
  async delete(@Param('id') id: number) {
    return await this.discountService.delete(id);
  }
}
