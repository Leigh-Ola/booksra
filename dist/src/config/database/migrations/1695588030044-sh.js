"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sh1695588030044 = void 0;
const typeorm_1 = require("typeorm");
const discount_entity_1 = require("../../../discount/discount.entity");
const types_1 = require("../../../utils/types");
class Sh1695588030044 {
    async up(queryRunner) {
        const discounts = await queryRunner.manager.find(discount_entity_1.Discount, {
            where: { category: (0, typeorm_1.IsNull)() },
        });
        discounts.forEach(async (discount) => {
            discount.category = types_1.DiscountCategoryEnum.GENERAL;
            discount.couponCode = null;
        });
        await queryRunner.manager.save(discounts);
    }
    async down(queryRunner) {
    }
}
exports.Sh1695588030044 = Sh1695588030044;
//# sourceMappingURL=1695588030044-sh.js.map