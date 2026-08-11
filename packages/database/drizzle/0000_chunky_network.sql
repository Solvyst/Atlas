CREATE SCHEMA "geo";
--> statement-breakpoint
CREATE SCHEMA "reference";
--> statement-breakpoint
CREATE TABLE "geo"."address_formats" (
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
	"translations" jsonb,
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
CREATE TABLE "geo"."phone_number_rules" (
	"country_id" integer PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"dial_code" text NOT NULL,
	"min_length" integer,
	"max_length" integer,
	"national_prefix" text,
	"trunk_prefix" text,
	"example" text,
	"validation_regex" text,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "geo"."postal_code_rules" (
	"country_id" integer PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"format" text,
	"regex" text,
	"example" text,
	"is_required" integer DEFAULT 0 NOT NULL,
	"is_supported" integer DEFAULT 1 NOT NULL,
	"source" text NOT NULL
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
	"translations" jsonb,
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
CREATE TABLE "reference"."banking_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"iban_supported" integer DEFAULT 0 NOT NULL,
	"iban_length" integer,
	"swift_supported" integer DEFAULT 1 NOT NULL,
	"local_bank_code_label" text,
	"local_bank_code_regex" text,
	"routing_code_label" text,
	"routing_code_regex" text,
	"account_number_min_length" integer,
	"account_number_max_length" integer,
	"example" jsonb,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reference"."business_identifiers" (
	"id" text PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"local_name" text,
	"category" text NOT NULL,
	"issuing_authority" text,
	"validation_regex" text,
	"example" text,
	"checksum_supported" integer DEFAULT 0 NOT NULL,
	"is_required_for_business" integer DEFAULT 0 NOT NULL,
	"source_url" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "reference"."company_types" (
	"id" text PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"local_name" text,
	"liability_type" text,
	"registration_body" text,
	"min_owners" integer,
	"max_owners" integer,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reference"."currency_formats" (
	"id" text PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"currency_code" text NOT NULL,
	"currency_symbol" text,
	"decimal_digits" integer NOT NULL,
	"symbol_position" text NOT NULL,
	"symbol_spacing" integer DEFAULT 0 NOT NULL,
	"decimal_separator" text NOT NULL,
	"grouping_separator" text NOT NULL,
	"grouping_pattern" text NOT NULL,
	"positive_pattern" text NOT NULL,
	"negative_pattern" text NOT NULL,
	"example" text NOT NULL,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reference"."date_time_formats" (
	"country_code" text PRIMARY KEY NOT NULL,
	"country_name" text NOT NULL,
	"date_format" text NOT NULL,
	"time_format" text NOT NULL,
	"datetime_format" text NOT NULL,
	"first_day_of_week" integer NOT NULL,
	"weekend_days" jsonb NOT NULL,
	"default_timezone" text,
	"timezone_strategy" text NOT NULL,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reference"."holidays" (
	"id" text PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"subdivision_code" text,
	"name" text NOT NULL,
	"local_name" text,
	"type" text NOT NULL,
	"date_rule" text NOT NULL,
	"month" integer,
	"day" integer,
	"observed_rule" text,
	"is_national" integer DEFAULT 1 NOT NULL,
	"effective_from" text,
	"effective_to" text,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reference"."phone_number_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"dial_code" text NOT NULL,
	"national_prefix" text,
	"trunk_prefix" text,
	"min_length" integer,
	"max_length" integer,
	"mobile_prefix_pattern" text,
	"national_format" text,
	"international_format" text,
	"example_mobile" text,
	"example_fixed_line" text,
	"emergency_numbers" jsonb,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reference"."units" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"symbol" text,
	"system" text NOT NULL,
	"quantity_kind" text NOT NULL,
	"base_unit_code" text,
	"conversion_factor_to_base" double precision,
	"common_uses" jsonb,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "geo_address_formats_country_code_idx" ON "geo"."address_formats" USING btree ("country_code");--> statement-breakpoint
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
CREATE INDEX "geo_localities_source_idx" ON "geo"."localities" USING btree ("source","source_id");--> statement-breakpoint
CREATE INDEX "geo_phone_codes_country_id_idx" ON "geo"."phone_codes" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "geo_phone_codes_country_code_idx" ON "geo"."phone_codes" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "geo_phone_codes_dial_code_idx" ON "geo"."phone_codes" USING btree ("dial_code");--> statement-breakpoint
CREATE INDEX "geo_phone_codes_calling_code_idx" ON "geo"."phone_codes" USING btree ("calling_code");--> statement-breakpoint
CREATE INDEX "geo_phone_number_rules_country_code_idx" ON "geo"."phone_number_rules" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "geo_phone_number_rules_dial_code_idx" ON "geo"."phone_number_rules" USING btree ("dial_code");--> statement-breakpoint
CREATE INDEX "geo_postal_code_rules_country_code_idx" ON "geo"."postal_code_rules" USING btree ("country_code");--> statement-breakpoint
CREATE UNIQUE INDEX "geo_states_country_state_code_unique" ON "geo"."states" USING btree ("country_id","state_code");--> statement-breakpoint
CREATE INDEX "geo_states_country_id_idx" ON "geo"."states" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "geo_subregions_region_id_idx" ON "geo"."subregions" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "reference_banking_rules_country_idx" ON "reference"."banking_rules" USING btree ("country_code");--> statement-breakpoint
CREATE UNIQUE INDEX "reference_business_identifiers_country_code_unique" ON "reference"."business_identifiers" USING btree ("country_code","code");--> statement-breakpoint
CREATE INDEX "reference_business_identifiers_country_idx" ON "reference"."business_identifiers" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "reference_business_identifiers_code_idx" ON "reference"."business_identifiers" USING btree ("code");--> statement-breakpoint
CREATE INDEX "reference_business_identifiers_category_idx" ON "reference"."business_identifiers" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "reference_company_types_country_code_unique" ON "reference"."company_types" USING btree ("country_code","code");--> statement-breakpoint
CREATE INDEX "reference_company_types_country_idx" ON "reference"."company_types" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "reference_company_types_code_idx" ON "reference"."company_types" USING btree ("code");--> statement-breakpoint
CREATE INDEX "reference_currency_formats_country_idx" ON "reference"."currency_formats" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "reference_currency_formats_currency_idx" ON "reference"."currency_formats" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "reference_date_time_formats_country_idx" ON "reference"."date_time_formats" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "reference_holidays_country_idx" ON "reference"."holidays" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "reference_holidays_type_idx" ON "reference"."holidays" USING btree ("type");--> statement-breakpoint
CREATE INDEX "reference_phone_rules_country_idx" ON "reference"."phone_number_rules" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "reference_phone_rules_dial_idx" ON "reference"."phone_number_rules" USING btree ("dial_code");--> statement-breakpoint
CREATE UNIQUE INDEX "reference_units_code_unique" ON "reference"."units" USING btree ("code");--> statement-breakpoint
CREATE INDEX "reference_units_category_idx" ON "reference"."units" USING btree ("category");--> statement-breakpoint
CREATE INDEX "reference_units_code_idx" ON "reference"."units" USING btree ("code");