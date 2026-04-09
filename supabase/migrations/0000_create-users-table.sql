CREATE TABLE "users"(
    "id" uuid PRIMARY KEY NOT NULL,
    "first_name" varchar(255) NOT NULL,
    "last_name" varchar(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
ALTER TABLE "users"
    ADD CONSTRAINT "users_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO action;

--> statement-breakpoint
CREATE POLICY "Allow individual user access to heir own user" ON "users" AS PERMISSIVE
    FOR SELECT TO "authenticated"
        USING (((auth.jwt() ->> 'sub'::text) =(id)::text));

