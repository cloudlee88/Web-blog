import { PrismaClient } from "@prisma/client";

// Singleton to avoid exhausting DB connections during Next.js hot-reload / serverless.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Runs a Prisma query and falls back to a default value if the database is
 * unreachable (e.g. DATABASE_URL not yet pointed at Neon). This lets the site
 * build and render friendly empty states before the DB is connected/seeded.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[cloudpixel] DB query failed — returning fallback. Is DATABASE_URL set & migrated?\n",
        err instanceof Error ? err.message : err,
      );
    }
    return fallback;
  }
}
