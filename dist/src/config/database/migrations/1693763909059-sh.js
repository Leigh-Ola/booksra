"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sh1693763909059 = void 0;
class Sh1693763909059 {
    constructor() {
        this.name = 'Sh1693763909059';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`CREATE TABLE "typeorm_cache_table" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_1f1c066da68820c20a4ff873df1" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "typeorm_cache_table"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }
}
exports.Sh1693763909059 = Sh1693763909059;
//# sourceMappingURL=1693763909059-sh.js.map