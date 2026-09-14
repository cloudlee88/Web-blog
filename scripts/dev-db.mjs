/**
 * Local dev Postgres (embedded, no Docker/Neon needed).
 * Runs a real Postgres 16 in-process so `prisma db push`, seed and import work
 * exactly like against Neon (full array/json/enum support). Dev-only — production
 * still uses Neon via DATABASE_URL.
 *
 *   node scripts/dev-db.mjs      # starts + keeps running on :5432
 *
 * Data persists in ./.localdb (gitignored). Ctrl-C to stop.
 */
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";

const DATA_DIR = ".localdb";

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
});

if (!existsSync(`${DATA_DIR}/PG_VERSION`)) {
  console.log("Initialising local Postgres data dir…");
  await pg.initialise();
}

await pg.start();
console.log("✅ Local Postgres running on postgresql://postgres:postgres@localhost:5432/postgres");
console.log("   (Ctrl-C to stop; data persists in ./.localdb)");

async function shutdown() {
  try {
    await pg.stop();
  } finally {
    process.exit(0);
  }
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
// keep the process alive
setInterval(() => {}, 1 << 30);
