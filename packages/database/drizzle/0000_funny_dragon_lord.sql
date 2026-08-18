CREATE SCHEMA "geo";
--> statement-breakpoint
CREATE SCHEMA "reference";
--> statement-breakpoint
CREATE SCHEMA "tax";
--> statement-breakpoint
CREATE TABLE "geo"."admin_areas" (
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
CREATE TABLE "geo"."cities" (
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
	"created_at" timestamp,
	"updated_at" timestamp NOT NULL,
	"flag" integer NOT NULL,
	"wiki_data_id" text
);
--> statement-breakpoint
CREATE TABLE "geo"."countries" (
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
CREATE TABLE "geo"."currencies" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text,
	"symbol" text
);
--> statement-breakpoint
CREATE TABLE "geo"."languages" (
	"code" text PRIMARY KEY NOT NULL,
	"iso639_2" text,
	"name" text NOT NULL,
	"native_name" text,
	"direction" text DEFAULT 'ltr' NOT NULL,
	"family" text,
	"is_active" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "geo"."locales" (
	"code" text PRIMARY KEY NOT NULL,
	"language_code" text NOT NULL,
	"country_code" text,
	"name" text NOT NULL,
	"native_name" text,
	"direction" text DEFAULT 'ltr' NOT NULL,
	"date_format" text,
	"time_format" text,
	"first_day_of_week" integer,
	"currency_code" text,
	"number_system" text DEFAULT 'latn' NOT NULL,
	"is_active" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "geo"."localities" (
	"id" integer PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"external_id" text NOT NULL,
	"country_id" integer NOT NULL,
	"admin_area_id" integer,
	"parent_id" integer,
	"name" text NOT NULL,
	"type" text,
	"level" integer,
	"is_settlement" boolean NOT NULL,
	"latitude" text,
	"longitude" text,
	"native" text,
	"population" bigint,
	"timezone" text,
	"wiki_data_id" text
);
--> statement-breakpoint
CREATE TABLE "geo"."phone_codes" (
	"id" integer PRIMARY KEY NOT NULL,
	"country_id" integer NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"phone_code" text NOT NULL,
	"dial_code" text NOT NULL,
	"calling_code" text NOT NULL,
	"national_destination_code" text,
	"is_shared_calling_code" integer NOT NULL,
	"flag" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "geo"."regions" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"translations" jsonb,
	"created_at" timestamp,
	"updated_at" timestamp NOT NULL,
	"flag" integer NOT NULL,
	"wiki_data_id" text
);
--> statement-breakpoint
CREATE TABLE "geo"."states" (
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
	"population" bigint,
	"created_at" timestamp,
	"updated_at" timestamp NOT NULL,
	"flag" integer NOT NULL,
	"wiki_data_id" text
);
--> statement-breakpoint
CREATE TABLE "geo"."subregions" (
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
CREATE TABLE "geo"."timezones" (
	"id" integer PRIMARY KEY NOT NULL,
	"country_id" integer NOT NULL,
	"zone_name" text NOT NULL,
	"gmt_offset" integer,
	"gmt_offset_name" text,
	"abbreviation" text,
	"tz_name" text
);
--> statement-breakpoint
CREATE TABLE "reference"."address_formats" (
	"country_id" integer PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"format" jsonb NOT NULL,
	"required_fields" jsonb NOT NULL,
	"administrative_area_label" text,
	"locality_label" text,
	"postal_code_label" text,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax"."country_forms" (
	"country_code" text PRIMARY KEY NOT NULL,
	"country_name" text NOT NULL,
	"version" integer NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax"."form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_code" text NOT NULL,
	"code" text NOT NULL,
	"label" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"applies_to" jsonb NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"input_type" text NOT NULL,
	"placeholder" text,
	"normalization" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"validation" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tax"."form_fields" ADD CONSTRAINT "form_fields_country_code_country_forms_country_code_fk" FOREIGN KEY ("country_code") REFERENCES "tax"."country_forms"("country_code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "geo_admin_areas_country_id_idx" ON "geo"."admin_areas" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "geo_admin_areas_country_parent_idx" ON "geo"."admin_areas" USING btree ("country_id","parent_id");--> statement-breakpoint
CREATE INDEX "geo_admin_areas_country_level_idx" ON "geo"."admin_areas" USING btree ("country_id","level");--> statement-breakpoint
CREATE INDEX "geo_admin_areas_country_type_idx" ON "geo"."admin_areas" USING btree ("country_id","type");--> statement-breakpoint
CREATE INDEX "geo_admin_areas_parent_id_idx" ON "geo"."admin_areas" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "geo_admin_areas_source_idx" ON "geo"."admin_areas" USING btree ("source","source_id");--> statement-breakpoint
CREATE INDEX "geo_cities_country_id_idx" ON "geo"."cities" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "geo_cities_state_id_idx" ON "geo"."cities" USING btree ("state_id");--> statement-breakpoint
CREATE UNIQUE INDEX "geo_countries_iso2_unique" ON "geo"."countries" USING btree ("iso2");--> statement-breakpoint
CREATE UNIQUE INDEX "geo_countries_iso3_unique" ON "geo"."countries" USING btree ("iso3");--> statement-breakpoint
CREATE INDEX "geo_countries_region_id_idx" ON "geo"."countries" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "geo_countries_subregion_id_idx" ON "geo"."countries" USING btree ("subregion_id");--> statement-breakpoint
CREATE INDEX "geo_languages_name_idx" ON "geo"."languages" USING btree ("name");--> statement-breakpoint
CREATE INDEX "geo_locales_language_idx" ON "geo"."locales" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "geo_locales_country_idx" ON "geo"."locales" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "geo_localities_country_id_idx" ON "geo"."localities" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "geo_localities_admin_area_id_idx" ON "geo"."localities" USING btree ("admin_area_id");--> statement-breakpoint
CREATE INDEX "geo_localities_country_type_idx" ON "geo"."localities" USING btree ("country_id","type");--> statement-breakpoint
CREATE INDEX "geo_localities_settlement_idx" ON "geo"."localities" USING btree ("is_settlement");--> statement-breakpoint
CREATE INDEX "geo_localities_source_idx" ON "geo"."localities" USING btree ("source","external_id");--> statement-breakpoint
CREATE INDEX "geo_phone_codes_country_id_idx" ON "geo"."phone_codes" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "geo_phone_codes_country_code_idx" ON "geo"."phone_codes" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "geo_phone_codes_dial_code_idx" ON "geo"."phone_codes" USING btree ("dial_code");--> statement-breakpoint
CREATE INDEX "geo_phone_codes_calling_code_idx" ON "geo"."phone_codes" USING btree ("calling_code");--> statement-breakpoint
CREATE UNIQUE INDEX "geo_states_country_state_code_unique" ON "geo"."states" USING btree ("country_id","state_code");--> statement-breakpoint
CREATE INDEX "geo_states_country_id_idx" ON "geo"."states" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "geo_subregions_region_id_idx" ON "geo"."subregions" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "reference_address_formats_country_code_idx" ON "reference"."address_formats" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "tax_country_forms_version_idx" ON "tax"."country_forms" USING btree ("version");--> statement-breakpoint
CREATE UNIQUE INDEX "tax_form_fields_country_code_unique" ON "tax"."form_fields" USING btree ("country_code","code");--> statement-breakpoint
CREATE INDEX "tax_form_fields_country_idx" ON "tax"."form_fields" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "tax_form_fields_code_idx" ON "tax"."form_fields" USING btree ("code");--> statement-breakpoint
CREATE INDEX "tax_form_fields_category_idx" ON "tax"."form_fields" USING btree ("category");