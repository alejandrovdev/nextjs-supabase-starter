CREATE TABLE "organizations"(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(255) NOT NULL,
    "description" varchar(255),
    "logo_path" varchar(255),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "owner_id" uuid NOT NULL
);

--> statement-breakpoint
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
ALTER TABLE "organizations"
    ADD CONSTRAINT "organizations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO action;

--> statement-breakpoint
CREATE POLICY "Allow individual user access their own organization" ON "organizations" AS PERMISSIVE
    FOR SELECT TO "authenticated"
        USING (((auth.jwt() ->> 'sub'::text) =(owner_id)::text));

--> statement-breakpoint
CREATE POLICY "Allow individual user create their own organization" ON "organizations" AS PERMISSIVE
    FOR INSERT TO "authenticated"
        WITH CHECK (((auth.jwt() ->> 'sub'::text) =(owner_id)::text));

--> statement-breakpoint
CREATE POLICY "Allow individual user update their own organization" ON "organizations" AS PERMISSIVE
    FOR UPDATE TO "authenticated"
        USING (((auth.jwt() ->> 'sub'::text) =(owner_id)::text))
        WITH CHECK (((auth.jwt() ->> 'sub'::text) =(owner_id)::text));

--> statement-breakpoint
CREATE POLICY "Allow individual user delete their own organization" ON "organizations" AS PERMISSIVE
    FOR DELETE TO "authenticated"
        USING (((auth.jwt() ->> 'sub'::text) =(owner_id)::text));

