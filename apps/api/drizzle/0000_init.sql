CREATE TABLE IF NOT EXISTS "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"dest" text NOT NULL,
	"clicks" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"linkId" text NOT NULL,
	"country" text NOT NULL,
	"browser" text NOT NULL,
	"device" text NOT NULL,
	"referrer" text DEFAULT 'Unknown',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"hash" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stats" ADD CONSTRAINT "stats_linkId_links_slug_fk" FOREIGN KEY ("linkId") REFERENCES "public"."links"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
