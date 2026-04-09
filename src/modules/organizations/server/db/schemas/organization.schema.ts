import { users } from '@/modules/users/server/db/schemas/user.schema';
import { sql } from 'drizzle-orm';
import {
  pgPolicy,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const organizations = pgTable(
  'organizations',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }),
    logoPath: varchar({ length: 255 }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    ownerId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  () => [
    pgPolicy('Allow individual user read their own organization', {
      as: 'permissive',
      for: 'select',
      to: 'authenticated',
      using: sql`((auth.jwt() ->> 'sub'::text) = (owner_id)::text)`,
    }),
    pgPolicy('Allow individual user create their own organization', {
      as: 'permissive',
      for: 'insert',
      to: 'authenticated',
      withCheck: sql`((auth.jwt() ->> 'sub'::text) = (owner_id)::text)`,
    }),
    pgPolicy('Allow individual user update their own organization', {
      as: 'permissive',
      for: 'update',
      to: 'authenticated',
      using: sql`((auth.jwt() ->> 'sub'::text) = (owner_id)::text)`,
      withCheck: sql`((auth.jwt() ->> 'sub'::text) = (owner_id)::text)`,
    }),
    pgPolicy('Allow individual user delete their own organization', {
      as: 'permissive',
      for: 'delete',
      to: 'authenticated',
      using: sql`((auth.jwt() ->> 'sub'::text) = (owner_id)::text)`,
    }),
  ]
).enableRLS();
