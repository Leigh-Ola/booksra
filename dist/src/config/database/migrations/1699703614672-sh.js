"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sh1699703614672 = void 0;
const email_entity_1 = require("../../../misc/email.entity");
class Sh1699703614672 {
    async up(queryRunner) {
        await queryRunner.manager.delete(email_entity_1.Email, {});
    }
    async down(queryRunner) { }
}
exports.Sh1699703614672 = Sh1699703614672;
//# sourceMappingURL=1699703614672-sh.js.map