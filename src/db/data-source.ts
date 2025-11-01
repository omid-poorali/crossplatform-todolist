import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AppMeta } from '../entities/AppMeta';
import { Task } from '../entities/Task';
import { CreateAppMetaTable1700000000000 } from './migrations/1700000000000-CreateAppMetaTable';
import { CreateTasksTable1700000001000 } from './migrations/1700000001000-CreateTasksTable';

export const DATABASE_NAME = 'crossplatform_todo';

export const AppDataSource = new DataSource({
  type: 'sqljs',
  location: DATABASE_NAME,
  autoSave: true,
  useLocalForage: true,
  logging: ['error'],
  synchronize: false,
  entities: [Task, AppMeta],
  migrations: [CreateAppMetaTable1700000000000, CreateTasksTable1700000001000],
  migrationsTableName: 'migrations_history',
  sqlJsConfig: {
    locateFile: (file) => `/sql-wasm.wasm`
  }
});
