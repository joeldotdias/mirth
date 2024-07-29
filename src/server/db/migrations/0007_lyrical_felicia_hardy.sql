CREATE TABLE IF NOT EXISTS "post" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"urls" varchar(1024)[] NOT NULL,
	"caption" varchar(150),
	"tagged" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
