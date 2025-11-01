import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppMetaTable1700000000000 implements MigrationInterface {
  name = 'CreateAppMetaTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "app_meta" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "updatedAt" text NOT NULL DEFAULT (datetime('now')));`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "app_meta";');
  }
}
