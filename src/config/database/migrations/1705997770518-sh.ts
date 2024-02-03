import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sh1705997770518 implements MigrationInterface {
  name = 'Sh1705997770518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // move everything from message table to data table
    // note: message table is: (id, type, message)

    const messages = await queryRunner.query(`SELECT * FROM message`);

    for (const message of messages) {
      await queryRunner.query(`INSERT INTO data (type, data) VALUES ($1, $2)`, [
        message.type,
        message.message,
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
