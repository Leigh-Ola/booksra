import {
  Controller,
  Param,
  Get,
  Body,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { IsUser, IsAdminUser } from '../users/users-guard';
import {
  CalculatePurchaseDto,
  NewPurchaseDto,
  GetPurchasesDto,
} from './dto/purchases.dto';

@Controller('purchase')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  // Get all purchases (with filters)
  @Get()
  @UseGuards(IsAdminUser)
  async getAllPurchases(@Query() query: GetPurchasesDto) {
    return this.purchasesService.getAllPurchases(query);
  }

  // calculate the price of the purchase
  @Post('/calculate')
  @UseGuards(IsUser)
  async getGenre(@Request() req, @Body() data: CalculatePurchaseDto) {
    const id = req.user.id;
    return this.purchasesService.calculatePurchase(data, id);
  }

  // create a purchase
  @Post('/new')
  @UseGuards(IsUser)
  async createPurchase(@Request() req, @Body() data: NewPurchaseDto) {
    const id = req.user.id;
    return this.purchasesService.createPurchase(data, id);
  }

  // verify a purchase
  @Get('/verify/:reference')
  async verifyPurchase(@Param('reference') reference: string) {
    return this.purchasesService.verifyPurchasePayment(reference);
  }
}
