import fs from "node:fs";
import path from "node:path";
const dbPath = path.resolve("data/vendorsmart.db");
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log("[reset] Base de dados removida.");
}
else {
    console.log("[reset] Nenhuma base de dados encontrada para remover.");
}
