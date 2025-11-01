import { DataSource } from 'typeorm';
import { AppMeta } from '../entities/AppMeta';
import { AppDataSource } from './data-source';

const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '0.1.0';
const DB_SCHEMA_VERSION = import.meta.env.VITE_DB_VERSION ?? '1';

let initializationPromise: Promise<DataSource> | null = null;

async function updateMetaValue(dataSource: DataSource, key: string, value: string): Promise<void> {
  const repo = dataSource.getRepository(AppMeta);
  const existing = await repo.findOne({ where: { key } });
  const record = repo.create({
    key,
    value,
    updatedAt: new Date().toISOString()
  });

  if (existing) {
    record.key = existing.key;
  }

  await repo.save(record);
}

export interface VersionChange {
  appVersionChanged: boolean;
  dbVersionChanged: boolean;
  previousAppVersion: string | null;
  previousDbVersion: string | null;
}

export async function initializeDatabase(): Promise<{ dataSource: DataSource; versionChange: VersionChange }> {
  if (AppDataSource.isInitialized) {
    const versionChange = await detectVersionChange(AppDataSource);
    return { dataSource: AppDataSource, versionChange };
  }

  if (!initializationPromise) {
    initializationPromise = (async () => {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      await AppDataSource.runMigrations();
      return AppDataSource;
    })();
  }

  const dataSource = await initializationPromise;
  const versionChange = await detectVersionChange(dataSource);
  return { dataSource, versionChange };
}

async function detectVersionChange(dataSource: DataSource): Promise<VersionChange> {
  const repo = dataSource.getRepository(AppMeta);
  const previousApp = await repo.findOne({ where: { key: 'app_version' } });
  const previousDb = await repo.findOne({ where: { key: 'db_version' } });

  const appVersionChanged = previousApp?.value !== APP_VERSION;
  const dbVersionChanged = previousDb?.value !== DB_SCHEMA_VERSION;

  await updateMetaValue(dataSource, 'app_version', APP_VERSION);
  await updateMetaValue(dataSource, 'db_version', DB_SCHEMA_VERSION);

  return {
    appVersionChanged,
    dbVersionChanged,
    previousAppVersion: previousApp?.value ?? null,
    previousDbVersion: previousDb?.value ?? null
  };
}
