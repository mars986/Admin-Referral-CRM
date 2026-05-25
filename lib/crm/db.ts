import { getRuntimeEnv } from "@/lib/cloudflare/env";

export type SqlParam = string | number | null;

type PreparedStatementLike = {
  bind: (...params: SqlParam[]) => PreparedStatementLike;
  all: <T = unknown>() => Promise<{ results?: T[] }>;
  run: () => Promise<unknown>;
};

function bindParams(statement: PreparedStatementLike, params: SqlParam[] = []) {
  return params.length ? statement.bind(...params) : statement;
}

export async function getDb() {
  const env = await getRuntimeEnv();
  return env?.DB;
}

export async function hasDatabase() {
  return Boolean(await getDb());
}

export async function all<T>(sql: string, params: SqlParam[] = []) {
  const db = await getDb();

  if (!db) {
    return [] as T[];
  }

  const result = await bindParams(db.prepare(sql) as PreparedStatementLike, params).all<T>();
  return (result.results ?? []) as T[];
}

export async function first<T>(sql: string, params: SqlParam[] = []) {
  const rows = await all<T>(sql, params);
  return rows[0] ?? null;
}

export async function run(sql: string, params: SqlParam[] = []) {
  const db = await getDb();

  if (!db) {
    return null;
  }

  return bindParams(db.prepare(sql) as PreparedStatementLike, params).run();
}

export function jsonArray(value: unknown) {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify([]);
}

export function parseJsonArray(value: unknown) {
  if (!value || typeof value !== "string") {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
}

export function nowIso() {
  return new Date().toISOString();
}
