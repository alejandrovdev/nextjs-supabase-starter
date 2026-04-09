import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    SUPABASE_SECRET_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_API_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_DATABASE_STUDIO_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_MAILPIT_URL: z.url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_API_URL: process.env.NEXT_PUBLIC_SUPABASE_API_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_DATABASE_STUDIO_URL:
      process.env.NEXT_PUBLIC_SUPABASE_DATABASE_STUDIO_URL,
    NEXT_PUBLIC_SUPABASE_MAILPIT_URL:
      process.env.NEXT_PUBLIC_SUPABASE_MAILPIT_URL,
  },
  emptyStringAsUndefined: true,
});
