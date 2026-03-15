import path from "node:path";
import { defineConfig } from "prisma/config";

const dbPath = path.join(__dirname, "..", "prisma", "dev.db");

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: `file:./prisma/dev.db`,
  },
  migrate: {
    adapter: async () => {
      const { default: Database } = await import("better-sqlite3");
      const { PrismaBetterSqlite3 } = await import(
        "@prisma/adapter-better-sqlite3"
      );
      const db = new Database(dbPath);
      return new PrismaBetterSqlite3(db);
    },
  },
});
