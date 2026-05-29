import fs from "node:fs";
import path from "node:path";
import { sqliteClient } from "../db/client.js";

/**
 * Divide um ficheiro SQL em statements individuais.
 * Ignora ; dentro de strings com aspas simples.
 */
function splitStatements(sql: string): string[] {
  // 1. Remover comentarios de linha (-- ...)
  const cleaned = sql
    .split(/\r?\n/)
    .map((line) => {
      const idx = line.indexOf("--");
      // ignora -- dentro de string literal (heuristica simples)
      if (idx >= 0 && (line.slice(0, idx).match(/'/g)?.length ?? 0) % 2 === 0) {
        return line.slice(0, idx);
      }
      return line;
    })
    .join("\n");

  const statements: string[] = [];
  let buffer = "";
  let inString = false;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === "'") {
      if (cleaned[i + 1] === "'") {
        buffer += "''";
        i++;
        continue;
      }
      inString = !inString;
      buffer += ch;
      continue;
    }
    if (ch === ";" && !inString) {
      const stmt = buffer.trim();
      if (stmt) statements.push(stmt);
      buffer = "";
      continue;
    }
    buffer += ch;
  }
  const last = buffer.trim();
  if (last) statements.push(last);
  return statements;
}

async function runMigrations() {
  const migrationsDir = path.resolve("server/db/migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`[migrate] A aplicar ${files.length} migracao(oes)...`);

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file);
    const sqlContent = fs.readFileSync(fullPath, "utf-8");
    const statements = splitStatements(sqlContent);

    for (const stmt of statements) {
      try {
        await sqliteClient.execute(stmt);
      } catch (err) {
        console.error(`[migrate] ERRO em ${file}:`, stmt.slice(0, 120));
        throw err;
      }
    }
    console.log(`[migrate] ✓ ${file} (${statements.length} statements)`);
  }

  console.log("[migrate] Concluido com sucesso.");
}

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[migrate] Falhou:", err);
    process.exit(1);
  });
