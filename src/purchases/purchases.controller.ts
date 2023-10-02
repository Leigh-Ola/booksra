import {
  Controller,
  Query,
  Get,
  Body,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { IsUser } from '../users/users-guard';
import { CalculatePurchaseDto } from './dto/purchases.dto';

@Controller('purchase')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  // calculate the price of the purchase
  @Post('/calculate')
  @UseGuards(IsUser)
  async getGenre(@Request() req, @Body() data: CalculatePurchaseDto) {
    const id = req.user.id;
    return this.purchasesService.calculatePurchase(data, id);
  }
}
