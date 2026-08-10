CREATE SCHEMA "meta";
--> statement-breakpoint
CREATE TABLE "meta"."cities" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"state_id" integer NOT NULL,
	"state_code" text NOT NULL,
	"state_name" text NOT NULL,
	"country_id" integer NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"type" text,
	"level" integer,
	"parent_id" integer,
	"latitude" text NOT NULL,
	"longitude" text NOT NULL,
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
CREATE TABLE "meta"."countries" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"iso3" text,
	"numeric_code" text,
	"iso2" text,
	"phonecode" text,
	"capital" text,
	"currency" text,
	"currency_name" text,
	"currency_symbol" text,
	"tld" text,
	"native" text,
	"population" bigint,
	"gdp" bigint,
	"region" text,
	"region_id" integer,
	"subregion" text,
	"subregion_id" integer,
	"nationality" text,
	"area_sq_km" double precision,
	"postal_code_format" text,
	"postal_code_regex" text,
	"timezones" jsonb,
	"translations" jsonb,
	"latitude" text,
	"longitude" text,
	"emoji" text,
	"emoji_u" text,
	"created_at" timestamp,
	"updated_at" timestamp NOT NULL,
	"flag" integer NOT NULL,
	"wiki_data_id" text
);
--> statement-breakpoint
CREATE TABLE "meta"."currencies" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text,
	"symbol" text
);
--> statement-breakpoint
CREATE TABLE "meta"."regions" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"translations" jsonb,
	"created_at" timestamp,
	"updated_at" timestamp NOT NULL,
	"flag" integer NOT NULL,
	"wiki_data_id" text
);
--> statement-breakpoint
CREATE TABLE "meta"."states" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country_id" integer NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text,
	"fips_code" text,
	"iso2" text,
	"state_code" text NOT NULL,
	"iso3166_2" text,
	"type" text,
	"level" integer,
	"parent_id" integer,
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
CREATE TABLE "meta"."subregions" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"translations" jsonb,
	"region_id" integer NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp NOT NULL,
	"flag" integer NOT NULL,
	"wiki_data_id" text
);
--> statement-breakpoint
CREATE TABLE "meta"."timezones" (
	"id" integer PRIMARY KEY NOT NULL,
	"country_id" integer NOT NULL,
	"zone_name" text NOT NULL,
	"gmt_offset" integer,
	"gmt_offset_name" text,
	"abbreviation" text,
	"tz_name" text
);
--> statement-breakpoint
CREATE INDEX "meta_cities_country_id_idx" ON "meta"."cities" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "meta_cities_state_id_idx" ON "meta"."cities" USING btree ("state_id");--> statement-breakpoint
CREATE INDEX "meta_countries_region_id_idx" ON "meta"."countries" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "meta_countries_subregion_id_idx" ON "meta"."countries" USING btree ("subregion_id");--> statement-breakpoint
CREATE INDEX "meta_states_country_id_idx" ON "meta"."states" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "meta_subregions_region_id_idx" ON "meta"."subregions" USING btree ("region_id");