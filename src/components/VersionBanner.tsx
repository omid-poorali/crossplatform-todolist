import { VersionChange } from '../db';

interface VersionBannerProps {
  versionChange: VersionChange | null;
}

export function VersionBanner({ versionChange }: VersionBannerProps) {
  if (!versionChange) return null;

  const { appVersionChanged, dbVersionChanged, previousAppVersion, previousDbVersion } = versionChange;
  if (!appVersionChanged && !dbVersionChanged) return null;

  return (
    <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100 shadow-lg backdrop-blur">
      <p className="font-semibold uppercase tracking-wide text-amber-300">Updated!</p>
      {appVersionChanged && (
        <p>
          App updated from <span className="font-semibold">{previousAppVersion ?? 'first install'}</span> to{' '}
          <span className="font-semibold">{import.meta.env.VITE_APP_VERSION}</span>.
        </p>
      )}
      {dbVersionChanged && (
        <p>
          Database migrated from version <span className="font-semibold">{previousDbVersion ?? 'none'}</span> to{' '}
          <span className="font-semibold">{import.meta.env.VITE_DB_VERSION}</span>.
        </p>
      )}
      <p className="mt-1 text-[11px] text-amber-200/80">All pending migrations were executed automatically.</p>
    </div>
  );
}
