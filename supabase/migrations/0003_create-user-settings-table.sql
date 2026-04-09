CREATE TABLE "user_settings"(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "default_organization_id" uuid,
    CONSTRAINT "user_settings_userId_unique" UNIQUE ("user_id")
);

--> statement-breakpoint
ALTER TABLE "user_settings" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
ALTER TABLE "user_settings"
    ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO action;

--> statement-breakpoint
ALTER TABLE "user_settings"
    ADD CONSTRAINT "user_settings_default_organization_id_organizations_id_fk" FOREIGN KEY ("default_organization_id") REFERENCES "public"."organizations"("id") ON DELETE SET NULL ON UPDATE NO action;

--> statement-breakpoint
DROP POLICY "Allow individual user access their own organization" ON "organizations" CASCADE;

--> statement-breakpoint
CREATE POLICY "Allow individual user read their own organization" ON "organizations" AS PERMISSIVE
    FOR SELECT TO "authenticated"
        USING (((auth.jwt() ->> 'sub'::text) =(owner_id)::text));

--> statement-breakpoint
CREATE POLICY "Allow individual user read their own settings" ON "user_settings" AS PERMISSIVE
    FOR SELECT TO "authenticated"
        USING (((auth.jwt() ->> 'sub'::text) =(user_id)::text));

--> statement-breakpoint
CREATE POLICY "Allow individual user create their own settings" ON "user_settings" AS PERMISSIVE
    FOR INSERT TO "authenticated"
        WITH CHECK (((auth.jwt() ->> 'sub'::text) =(user_id)::text));

--> statement-breakpoint
CREATE POLICY "Allow individual user update their own settings" ON "user_settings" AS PERMISSIVE
    FOR UPDATE TO "authenticated"
        USING (((auth.jwt() ->> 'sub'::text) =(user_id)::text))
        WITH CHECK (((auth.jwt() ->> 'sub'::text) =(user_id)::text));

