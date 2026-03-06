CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
DROP INDEX IF EXISTS "store_search_document_idx";
--> statement-breakpoint
ALTER TABLE "store" DROP COLUMN IF EXISTS "search_document";
--> statement-breakpoint
ALTER TABLE "store"
ADD COLUMN "search_text" text GENERATED ALWAYS AS (
  lower(
    coalesce("name", '') || ' ' ||
    coalesce("address", '') || ' ' ||
    coalesce("city", '') || ' ' ||
    coalesce("state", '') || ' ' ||
    coalesce("zip", '') || ' ' ||
    coalesce("country", '')
  )
) STORED NOT NULL;
--> statement-breakpoint
DROP INDEX IF EXISTS "store_search_text_idx";
--> statement-breakpoint
DROP INDEX IF EXISTS "location_index";
--> statement-breakpoint
CREATE INDEX "store_search_text_idx" ON "store" USING gin ("search_text" gin_trgm_ops) WHERE "store"."deleted_at" IS NULL;
--> statement-breakpoint
CREATE INDEX "location_index" ON "store" USING gist ((location::geography)) WHERE "store"."deleted_at" IS NULL;
