import { authUsers } from '@/lib/supabase/schemas/auth.schema';
import { sql } from 'drizzle-orm';
import {
  pgPolicy,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid()
      .primaryKey()
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 255 }),
    avatarUrl: varchar('avatar_url', { length: 255 }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  () => [
    pgPolicy('Allow individual user access to their own user', {
      as: 'permissive',
      for: 'select',
      to: 'authenticated',
      using: sql`((auth.jwt() ->> 'sub'::text) = (id)::text)`,
    }),
  ]
).enableRLS();
