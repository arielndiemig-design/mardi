const { Pool } = require("pg");

const hasDatabaseConfiguration = Boolean(
  process.env.DATABASE_URL ||
    (process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER),
);

const pool = hasDatabaseConfiguration
  ? new Pool(
      process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl:
              process.env.PGSSLMODE === "require"
                ? { rejectUnauthorized: true }
                : undefined,
          }
        : undefined,
    )
  : null;

function query(text, values) {
  if (!pool) {
    const error = new Error(
      "La base PostgreSQL n’est pas configurée. Définissez DATABASE_URL.",
    );
    error.statusCode = 503;
    throw error;
  }

  return pool.query(text, values);
}

async function checkDatabaseConnection() {
  if (!pool) return false;

  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  closeDatabase: () => (pool ? pool.end() : Promise.resolve()),
  isDatabaseConfigured: () => Boolean(pool),
  pool,
  query,
  checkDatabaseConnection,
};