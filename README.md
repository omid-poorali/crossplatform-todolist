# Cross-Platform TypeORM + SQLite To-Do App

A cross-platform to-do list application that shares a single React + Vite codebase across desktop (Windows, macOS) and
mobile (Android, iOS) by targeting the browser or packaging with tooling such as Capacitor, Tauri, or Electron. The app
persists data locally with SQLite via `sql.js` and runs TypeORM migrations automatically on startup, while tracking
application and database schema versions.

## Features

- ⚛️ **React + TypeScript + Vite** foundation for fast iterations and hot-module reloading.
- 🎨 **Tailwind CSS** styling with a responsive layout that adapts to desktop and mobile.
- 🗄️ **SQLite storage** powered by TypeORM's `sql.js` driver with `localforage` persistence for offline durability.
- 🔄 **Automatic migrations** executed on launch, ensuring schema changes apply seamlessly.
- 📦 **Version tracking** that records application and database schema revisions so upgrades are surfaced to users.

## Getting started

1. **Install dependencies** (requires Node 18+):

   ```bash
   npm install
   ```

   > ℹ️ The SQLite WebAssembly binary (`sql-wasm.wasm`) must be available in `public/`. After installing dependencies run:
   >
   > ```bash
   > cp node_modules/sql.js/dist/sql-wasm.wasm public/
   > ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

   Preview the optimized bundle locally with `npm run preview`.

## Cross-platform packaging

The project is agnostic of the host runtime and can be shipped as:

- A Progressive Web App served from the `dist/` output.
- A native desktop bundle via [Tauri](https://tauri.app/) or [Electron](https://www.electronjs.org/).
- A native mobile shell via [Capacitor](https://capacitorjs.com/) or other WebView containers.

In each case the same web build is used, so UI and database logic remain identical. When wrapping the app ensure the
`sql-wasm.wasm` asset is copied to the packaged bundle.

## Database lifecycle

- Database connection is configured through TypeORM's `SqlJs` driver (`src/db/data-source.ts`).
- Pending migrations execute automatically during `initializeDatabase()` (`src/db/index.ts`).
- Application (`VITE_APP_VERSION`) and schema (`VITE_DB_VERSION`) versions are persisted in the `app_meta` table.
- Version deltas are surfaced in the UI banner on launch.

To add new migrations, create additional files in `src/db/migrations/` and register them in the datasource. Increment
`VITE_DB_VERSION` so clients record the update.

## Project structure

```
├── public/                 # Static assets (add sql-wasm.wasm here)
├── src/
│   ├── App.tsx             # Root UI
│   ├── components/         # Presentational components
│   ├── db/                 # TypeORM configuration & migrations
│   ├── entities/           # TypeORM entities
│   ├── hooks/              # Reusable hooks (task management)
│   └── main.tsx            # React bootstrap
├── index.html              # Vite entry point
└── tailwind.config.cjs     # Tailwind configuration
```

## Environment variables

- `VITE_APP_VERSION`: Semantic version string displayed in the banner.
- `VITE_DB_VERSION`: Schema revision identifier stored in the database.

These values default to `0.1.0` and `1` respectively (see `.env`). Bump them when shipping new builds or schema
migrations.

## Testing

The project relies on React Testing Library or end-to-end tools that you can add as needed. For now manual verification
ensures database initialization, migrations, and CRUD behaviour across supported platforms.
