import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1700000001000 implements MigrationInterface {
  name = 'CreateTasksTable1700000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "tasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "completed" integer NOT NULL DEFAULT 0, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')));`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_tasks_completed" ON "tasks" ("completed");`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_tasks_completed";');
    await queryRunner.query('DROP TABLE IF EXISTS "tasks";');
  }
}
