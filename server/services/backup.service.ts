import fs from "node:fs";
import path from "node:path";

const DB_FILE = path.resolve("data/vendorsmart.db");
const BACKUPS_DIR = path.resolve("data/backups");
const RETENTION = 10; // numero maximo de backups

export function ensureBackupDir() {
  if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

export function runBackup(): { success: boolean; file?: string; error?: string } {
  try {
    ensureBackupDir();
    if (!fs.existsSync(DB_FILE)) {
      return { success: false, error: "Base de dados nao existe ainda." };
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const target = path.join(BACKUPS_DIR, `vendorsmart-${stamp}.db`);
    fs.copyFileSync(DB_FILE, target);

    // Mantem apenas os ultimos RETENTION
    const files = fs
      .readdirSync(BACKUPS_DIR)
      .filter((f) => f.endsWith(".db"))
      .map((f) => ({ name: f, mtime: fs.statSync(path.join(BACKUPS_DIR, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    for (const f of files.slice(RETENTION)) {
      fs.unlinkSync(path.join(BACKUPS_DIR, f.name));
    }

    return { success: true, file: target };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export function startBackupSchedule(intervalMs = 24 * 60 * 60 * 1000) {
  // Executa um backup ao arrancar e depois periodicamente.
  setTimeout(() => {
    const r = runBackup();
    if (r.success) console.log(`[backup] Inicial: ${r.file}`);
    else console.warn(`[backup] Falhou: ${r.error}`);
  }, 5_000);

  setInterval(() => {
    const r = runBackup();
    if (r.success) console.log(`[backup] OK: ${r.file}`);
    else console.warn(`[backup] Falhou: ${r.error}`);
  }, intervalMs);
}
