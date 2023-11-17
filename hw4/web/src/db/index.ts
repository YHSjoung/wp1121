import { env } from "@/lib/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: env.NEXT_PUBLIC_POSTGRES_URL,
});

export const db = drizzle(pool);
