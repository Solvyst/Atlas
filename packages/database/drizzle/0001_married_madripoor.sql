CREATE TABLE "meta"."admin_areas" (
	"id" integer PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"source_id" text NOT NULL,
	"country_id" integer NOT NULL,
	"country_code" text NOT NULL,
	"parent_id" integer,
	"name" text NOT NULL,
	"code" text,
	"iso3166_2" text,
	"type" text NOT NULL,
	"level" integer NOT NULL,
	"native" text,
	"latitude" text,
	"longitude" text,
	"timezone" text,
	"translations" jsonb,
	"population" bigint,
	"created_at" timestamp,
	"updated_at" timestamp NOT NULL,
	"flag" integer NOT NULL,
	"wiki_data_id" text
);
--> statement-breakpoint
CREATE TABLE "meta"."localities" (
	"id" integer PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"source_id" text NOT NULL,
	"country_id" integer NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"admin_area_id" integer,
	"admin_area_code" text,
	"admin_area_name" text,
	"parent_id" integer,
	"name" text NOT NULL,
	"type" text,
	"level" integer,
	"is_settlement" integer NOT NULL,
	"latitude" text,
	"longitude" text,
	"native" text,
	"population" bigint,
	"timezone" text,
	"translations" jsonb,
	"created_at" timestamp,
	"updated_at" timestamp NOT NULL,
	"flag" integer NOT NULL,
	"wiki_data_id" text
);
--> statement-breakpoint
CREATE INDEX "meta_admin_areas_country_id_idx" ON "meta"."admin_areas" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "meta_admin_areas_country_parent_idx" ON "meta"."admin_areas" USING btree ("country_id","parent_id");--> statement-breakpoint
CREATE INDEX "meta_admin_areas_country_level_idx" ON "meta"."admin_areas" USING btree ("country_id","level");--> statement-breakpoint
CREATE INDEX "meta_admin_areas_country_type_idx" ON "meta"."admin_areas" USING btree ("country_id","type");--> statement-breakpoint
CREATE INDEX "meta_admin_areas_parent_id_idx" ON "meta"."admin_areas" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "meta_admin_areas_source_idx" ON "meta"."admin_areas" USING btree ("source","source_id");--> statement-breakpoint
CREATE INDEX "meta_localities_country_id_idx" ON "meta"."localities" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "meta_localities_admin_area_id_idx" ON "meta"."localities" USING btree ("admin_area_id");--> statement-breakpoint
CREATE INDEX "meta_localities_country_type_idx" ON "meta"."localities" USING btree ("country_id","type");--> statement-breakpoint
CREATE INDEX "meta_localities_settlement_idx" ON "meta"."localities" USING btree ("is_settlement");--> statement-breakpoint
CREATE INDEX "meta_localities_source_idx" ON "meta"."localities" USING btree ("source","source_id");