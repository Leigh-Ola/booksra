import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount-dto';
import { DiscountService } from './discount.service';
export declare class DiscountController {
    private readonly discountService;
    constructor(discountService: DiscountService);
    create(discount: CreateDiscountDto): Promise<never>;
    update(id: number, discount: UpdateDiscountDto): Promise<never>;
    getDiscounts(query: string, page?: number, limit?: number): Promise<import("./discount.entity").Discount[]>;
    delete(id: number): Promise<never>;
}
