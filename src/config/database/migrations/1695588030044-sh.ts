import { MigrationInterface, QueryRunner, IsNull } from 'typeorm';
import { Discount } from '../../../discount/discount.entity';
import { DiscountCategoryEnum } from '../../../utils/types';

// find all discounts where category is null, then set category to DiscountCategoryEnum.general
// and set the couponCode to null
export class Sh1695588030044 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const discounts = await queryRunner.manager.find(Discount, {
      where: { category: IsNull() },
    });
    // console.log({ discounts: discounts.map((d) => d.id) || 'idk' });
    discounts.forEach(async (discount) => {
      discount.category = DiscountCategoryEnum.GENERAL;
      discount.couponCode = null;
    });
    await queryRunner.manager.save(discounts);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // no take-backsies.. hehe
  }
}
