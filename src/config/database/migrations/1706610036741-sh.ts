import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1706610036741 implements MigrationInterface {
    name = 'Sh1706610036741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data" ADD "isBoolean" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data" DROP COLUMN "isBoolean"`);
    }

}
