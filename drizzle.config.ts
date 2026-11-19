import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./backend/database/schema.ts",
  out: "./backend/database/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
