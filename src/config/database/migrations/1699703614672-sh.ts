import { MigrationInterface, QueryRunner } from 'typeorm';
import { Email } from '../../../misc/email.entity';

export class Sh1699703614672 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // delete all emails
    await queryRunner.manager.delete(Email, {});
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
