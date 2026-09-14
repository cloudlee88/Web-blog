/**
 * Bulk content-import pipeline (Implementation Plan §4.1 / TechStack `content-import/`).
 *
 * Reads one Markdown file per tool from content-import/tools/*.md — YAML
 * frontmatter holds the structured fields, the body is the review markdown —
 * validates each against the SAME Zod schema used by POST /api/content
 * (`toolInputSchema`), then upserts by slug (idempotent, safe to re-run).
 *
 *   npm run import          # validate + write to the DB (needs DATABASE_URL)
 *   npm run import:check    # validate only, no DB connection (dry run)
 *
 * This keeps the single-write-entry-point rule intact: admin UI, the API and
 * this importer all go through the same validation + upsert shape.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { Prisma, PrismaClient } from "@prisma/client";
import { toolInputSchema, type ToolInput } from "../src/schemas/content";
import { CATEGORIES } from "./categories";
import { logoFor } from "./logo";
import { canonicalTagSlugs, tagDisplayName } from "./tags";

const HERE = dirname(fileURLToPath(import.meta.url));
const TOOLS_DIR = join(HERE, "tools");
const CHECK_ONLY = process.argv.includes("--check");

interface ParsedFile {
  file: string;
  ok: boolean;
  data?: ToolInput;
  error?: string;
}

/** Parse + validate every Markdown file. Never touches the DB. */
function parseAll(): ParsedFile[] {
  let files: string[] = [];
  try {
    // Skip files starting with "_" (e.g. _TEMPLATE.md).
    files = readdirSync(TOOLS_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  } catch {
    console.error(`✖ Could not read ${TOOLS_DIR}. Create content-import/tools/*.md first.`);
    process.exit(1);
  }

  return files.sort().map((file) => {
    try {
      const raw = readFileSync(join(TOOLS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      // Frontmatter uses `tags`; the schema field is `tagSlugs`. Map it so tags
      // are actually persisted (and category subtypes work).
      const payload = {
        ...data,
        tagSlugs: (data as { tags?: unknown }).tags ?? (data as { tagSlugs?: unknown }).tagSlugs ?? [],
        reviewBody: content.trim(),
      };
      const parsed = toolInputSchema.safeParse(payload);
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        const path = first?.path.join(".") || "?";
        return { file, ok: false, error: `${path}: ${first?.message}` };
      }
      return { file, ok: true, data: parsed.data };
    } catch (err) {
      return { file, ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}

/** Upsert one validated tool (mirrors src/features/tools/queries.ts upsertTool). */
async function upsertTool(prisma: PrismaClient, input: ToolInput) {
  const { categorySlug, tagSlugs, ...rest } = input;
  const tagConnectOrCreate = canonicalTagSlugs(tagSlugs).map((s) => ({
    where: { slug: s },
    create: { slug: s, name: tagDisplayName(s) },
  }));
  const data = {
    ...rest,
    // Fall back to a domain-derived favicon when no explicit logo is provided.
    logoUrl: logoFor(rest.logoUrl, rest.website),
    pricingTiers: (rest.pricingTiers ?? undefined) as Prisma.InputJsonValue | undefined,
    faq: (rest.faq ?? undefined) as Prisma.InputJsonValue | undefined,
  };
  const category = categorySlug ? { connect: { slug: categorySlug } } : undefined;

  await prisma.tool.upsert({
    where: { slug: input.slug },
    create: { ...data, category, tags: { connectOrCreate: tagConnectOrCreate } },
    update: {
      ...data,
      category: categorySlug ? category : { disconnect: true },
      tags: { set: [], connectOrCreate: tagConnectOrCreate },
    },
  });
}

async function main() {
  const results = parseAll();
  const valid = results.filter((r) => r.ok);
  const invalid = results.filter((r) => !r.ok);

  console.log(`\n📦 content-import — ${results.length} file(s) in content-import/tools\n`);
  for (const r of valid) console.log(`  ✓ ${r.file}  →  ${r.data!.slug} [${r.data!.categorySlug ?? "no category"}]`);
  for (const r of invalid) console.log(`  ✖ ${r.file}  —  ${r.error}`);

  if (invalid.length) {
    console.error(`\n✖ ${invalid.length} file(s) failed validation. Fix them before importing.`);
    process.exit(1);
  }

  if (CHECK_ONLY) {
    console.log(`\n✅ All ${valid.length} file(s) valid (dry run — nothing written).`);
    return;
  }

  const prisma = new PrismaClient();
  try {
    // Ensure the taxonomy exists so category connects succeed.
    for (const c of CATEGORIES) {
      await prisma.category.upsert({ where: { slug: c.slug }, create: c, update: c });
    }
    for (const r of valid) await upsertTool(prisma, r.data!);
    console.log(`\n✅ Imported ${valid.length} tool(s) into the database.`);
  } catch (err) {
    console.error("\n✖ Import failed:", err instanceof Error ? err.message : err);
    console.error("   Is DATABASE_URL set and migrated? Run: npx prisma migrate dev");
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
