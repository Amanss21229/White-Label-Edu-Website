import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });


// Ensure the public registration table exists on fresh production databases.
// This keeps registration working even when a deployment has not run drizzle-kit push.
export async function ensureRegistrationSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      student_name TEXT NOT NULL,
      gender TEXT NOT NULL,
      grade TEXT NOT NULL,
      father_name TEXT NOT NULL,
      mother_name TEXT NOT NULL,
      whatsapp_number VARCHAR(15) NOT NULL,
      parent_mobile_number VARCHAR(15) NOT NULL,
      alternate_number VARCHAR(15),
      address TEXT NOT NULL,
      photo TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  // Keep existing installations compatible with the registration model.
  await pool.query(`
    ALTER TABLE registrations
      ADD COLUMN IF NOT EXISTS student_name TEXT,
      ADD COLUMN IF NOT EXISTS gender TEXT,
      ADD COLUMN IF NOT EXISTS grade TEXT,
      ADD COLUMN IF NOT EXISTS father_name TEXT,
      ADD COLUMN IF NOT EXISTS mother_name TEXT,
      ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(15),
      ADD COLUMN IF NOT EXISTS parent_mobile_number VARCHAR(15),
      ADD COLUMN IF NOT EXISTS alternate_number VARCHAR(15),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS photo TEXT,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()
  `);
}
