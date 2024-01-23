import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sh1705998182805 implements MigrationInterface {
  name = 'Sh1705998182805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(
      `ALTER TYPE "public"."data_type_enum" RENAME TO "data_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."data_type_enum" AS ENUM('banner_message', 'cover_image', 'purchase_availability')`,
    );
    await queryRunner.query(
      `ALTER TABLE "data" ALTER COLUMN "type" TYPE "public"."data_type_enum" USING "type"::"text"::"public"."data_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."data_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."data_type_enum_old" AS ENUM('banner_message', 'cover_image', 'purchase_availability')`,
    );
    await queryRunner.query(
      `ALTER TABLE "data" ALTER COLUMN "type" TYPE "public"."data_type_enum_old" USING "type"::"text"::"public"."data_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."data_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."data_type_enum_old" RENAME TO  "data_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "type" "data_type_enum" NOT NULL, "message" character varying(10000) NOT NULL, CONSTRAINT "PK_5f468ae7985f5f5e0b9f275e29f" PRIMARY KEY ("id"))`,
    );
  }
}
