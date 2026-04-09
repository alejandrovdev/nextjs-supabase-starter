import { organizations } from '@/modules/organizations/server/db/schemas/organization.schema';
import { users } from '@/modules/users/server/db/schemas/user.schema';
import { sql } from 'drizzle-orm';
import { pgPolicy, pgTable, uuid } from 'drizzle-orm/pg-core';

export const userSettings = pgTable(
  'user_settings',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    userId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull()
      .unique(),
    defaultOrganizationId: uuid().references(() => organizations.id, {
      onDelete: 'set null',
    }),
  },
  () => [
    pgPolicy('Allow individual user read their own settings', {
      as: 'permissive',
      for: 'select',
      to: 'authenticated',
      using: sql`((auth.jwt() ->> 'sub'::text) = (user_id)::text)`,
    }),
    pgPolicy('Allow individual user create their own settings', {
      as: 'permissive',
      for: 'insert',
      to: 'authenticated',
      withCheck: sql`((auth.jwt() ->> 'sub'::text) = (user_id)::text)`,
    }),
    pgPolicy('Allow individual user update their own settings', {
      as: 'permissive',
      for: 'update',
      to: 'authenticated',
      using: sql`((auth.jwt() ->> 'sub'::text) = (user_id)::text)`,
      withCheck: sql`((auth.jwt() ->> 'sub'::text) = (user_id)::text)`,
    }),
  ]
).enableRLS();
