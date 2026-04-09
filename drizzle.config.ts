import { env } from '@/lib/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/modules/**/db/schemas/*.ts',
  out: './supabase/migrations',
  casing: 'snake_case',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
