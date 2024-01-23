import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1705997072473 implements MigrationInterface {
    name = 'Sh1705997072473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."data_type_enum" AS ENUM('banner_message', 'cover_message', 'purchase_availability')`);
        await queryRunner.query(`CREATE TABLE "data" ("id" SERIAL NOT NULL, "type" "public"."data_type_enum" NOT NULL, "data" character varying(10000) NOT NULL, CONSTRAINT "PK_2533602bd9247937e3a4861e173" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."message_type_enum" RENAME TO "message_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."message_type_enum" AS ENUM('banner_message', 'cover_message', 'purchase_availability')`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "type" TYPE "public"."message_type_enum" USING "type"::"text"::"public"."message_type_enum"`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "type" SET DEFAULT 'banner_message'`);
        await queryRunner.query(`DROP TYPE "public"."message_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."message_type_enum_old" AS ENUM('banner_message')`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "type" TYPE "public"."message_type_enum_old" USING "type"::"text"::"public"."message_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "type" SET DEFAULT 'banner_message'`);
        await queryRunner.query(`DROP TYPE "public"."message_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."message_type_enum_old" RENAME TO "message_type_enum"`);
        await queryRunner.query(`DROP TABLE "data"`);
        await queryRunner.query(`DROP TYPE "public"."data_type_enum"`);
    }

}
