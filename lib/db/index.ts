import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

// Initialize Drizzle client with Vercel Postgres
export const db = drizzle(sql, { schema });

// Export schema for easy access
export * from './schema';
