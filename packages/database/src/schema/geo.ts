import {
  bigint,
  doublePrecision,
  index,
  uniqueIndex,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Shared Types
export type JsonObject = Record<string, unknown>;

export type CountryTimezone = {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
};

// Geo Schema
export const geoSchema = pgSchema("geo");

// Regions Table
export const geoRegions = geoSchema.table("regions", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  translations: jsonb("translations").$type<JsonObject>(),
  created_at: timestamp("created_at", { mode: "string" }),
  updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
  flag: integer("flag").notNull(),
  wiki_data_id: text("wiki_data_id"),
});

// Subregions Table
export const geoSubregions = geoSchema.table(
  "subregions",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    translations: jsonb("translations").$type<JsonObject>(),
    region_id: integer("region_id").notNull(),
    created_at: timestamp("created_at", { mode: "string" }),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
    flag: integer("flag").notNull(),
    wiki_data_id: text("wiki_data_id"),
  },
  (table) => [index("geo_subregions_region_id_idx").on(table.region_id)],
);

// Countries Table
export const geoCountries = geoSchema.table(
  "countries",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    iso3: text("iso3"),
    numeric_code: text("numeric_code"),
    iso2: text("iso2"),
    phonecode: text("phonecode"),
    capital: text("capital"),
    currency: text("currency"),
    currency_name: text("currency_name"),
    currency_symbol: text("currency_symbol"),
    tld: text("tld"),
    native: text("native"),
    population: bigint("population", { mode: "number" }),
    gdp: bigint("gdp", { mode: "number" }),
    region: text("region"),
    region_id: integer("region_id"),
    subregion: text("subregion"),
    subregion_id: integer("subregion_id"),
    nationality: text("nationality"),
    area_sq_km: doublePrecision("area_sq_km"),
    postal_code_format: text("postal_code_format"),
    postal_code_regex: text("postal_code_regex"),
    timezones: jsonb("timezones").$type<CountryTimezone[]>(),
    translations: jsonb("translations").$type<JsonObject>(),
    latitude: text("latitude"),
    longitude: text("longitude"),
    emoji: text("emoji"),
    emoji_u: text("emoji_u"),
    created_at: timestamp("created_at", { mode: "string" }),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
    flag: integer("flag").notNull(),
    wiki_data_id: text("wiki_data_id"),
  },
  (table) => [
    uniqueIndex("geo_countries_iso2_unique").on(table.iso2),
    uniqueIndex("geo_countries_iso3_unique").on(table.iso3),
    index("geo_countries_region_id_idx").on(table.region_id),
    index("geo_countries_subregion_id_idx").on(table.subregion_id),
  ],
);

// States Table
export const geoStates = geoSchema.table(
  "states",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    country_id: integer("country_id").notNull(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name"),
    fips_code: text("fips_code"),
    iso2: text("iso2"),
    state_code: text("state_code").notNull(),
    iso3166_2: text("iso3166_2"),
    type: text("type"),
    level: integer("level"),
    parent_id: integer("parent_id"),
    native: text("native"),
    latitude: text("latitude"),
    longitude: text("longitude"),
    timezone: text("timezone"),
    translations: jsonb("translations").$type<JsonObject>(),
    population: bigint("population", { mode: "number" }),
    created_at: timestamp("created_at", { mode: "string" }),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
    flag: integer("flag").notNull(),
    wiki_data_id: text("wiki_data_id"),
  },
  (table) => [
    uniqueIndex("geo_states_country_state_code_unique").on(
      table.country_id,
      table.state_code,
    ),
    index("geo_states_country_id_idx").on(table.country_id),
  ],
);

// Cities Table
export const geoCities = geoSchema.table(
  "cities",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    state_id: integer("state_id").notNull(),
    state_code: text("state_code").notNull(),
    state_name: text("state_name").notNull(),
    country_id: integer("country_id").notNull(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    type: text("type"),
    level: integer("level"),
    parent_id: integer("parent_id"),
    latitude: text("latitude").notNull(),
    longitude: text("longitude").notNull(),
    native: text("native"),
    population: bigint("population", { mode: "number" }),
    timezone: text("timezone"),
    translations: jsonb("translations").$type<JsonObject>(),
    created_at: timestamp("created_at", { mode: "string" }),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
    flag: integer("flag").notNull(),
    wiki_data_id: text("wiki_data_id"),
  },
  (table) => [
    index("geo_cities_country_id_idx").on(table.country_id),
    index("geo_cities_state_id_idx").on(table.state_id),
  ],
);

// Admin Areas Table
export const geoAdminAreas = geoSchema.table(
  "admin_areas",
  {
    id: integer("id").primaryKey(),
    source: text("source").notNull(),
    source_id: text("source_id").notNull(),
    country_id: integer("country_id").notNull(),
    country_code: text("country_code").notNull(),
    parent_id: integer("parent_id"),
    name: text("name").notNull(),
    code: text("code"),
    iso3166_2: text("iso3166_2"),
    type: text("type").notNull(),
    level: integer("level").notNull(),
    native: text("native"),
    latitude: text("latitude"),
    longitude: text("longitude"),
    timezone: text("timezone"),
    translations: jsonb("translations").$type<JsonObject>(),
    population: bigint("population", { mode: "number" }),
    created_at: timestamp("created_at", { mode: "string" }),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
    flag: integer("flag").notNull(),
    wiki_data_id: text("wiki_data_id"),
  },
  (table) => [
    index("geo_admin_areas_country_id_idx").on(table.country_id),
    index("geo_admin_areas_country_parent_idx").on(
      table.country_id,
      table.parent_id,
    ),
    index("geo_admin_areas_country_level_idx").on(
      table.country_id,
      table.level,
    ),
    index("geo_admin_areas_country_type_idx").on(table.country_id, table.type),
    index("geo_admin_areas_parent_id_idx").on(table.parent_id),
    index("geo_admin_areas_source_idx").on(table.source, table.source_id),
  ],
);

// Localities Table
export const geoLocalities = geoSchema.table(
  "localities",
  {
    id: integer("id").primaryKey(),
    source: text("source").notNull(),
    source_id: text("source_id").notNull(),
    country_id: integer("country_id").notNull(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    admin_area_id: integer("admin_area_id"),
    admin_area_code: text("admin_area_code"),
    admin_area_name: text("admin_area_name"),
    parent_id: integer("parent_id"),
    name: text("name").notNull(),
    type: text("type"),
    level: integer("level"),
    is_settlement: integer("is_settlement").notNull(),
    latitude: text("latitude"),
    longitude: text("longitude"),
    native: text("native"),
    population: bigint("population", { mode: "number" }),
    timezone: text("timezone"),
    translations: jsonb("translations").$type<JsonObject>(),
    created_at: timestamp("created_at", { mode: "string" }),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
    flag: integer("flag").notNull(),
    wiki_data_id: text("wiki_data_id"),
  },
  (table) => [
    index("geo_localities_country_id_idx").on(table.country_id),
    index("geo_localities_admin_area_id_idx").on(table.admin_area_id),
    index("geo_localities_country_type_idx").on(table.country_id, table.type),
    index("geo_localities_settlement_idx").on(table.is_settlement),
    index("geo_localities_source_idx").on(table.source, table.source_id),
  ],
);

// Languages Table
export const geoLanguages = geoSchema.table(
  "languages",
  {
    code: text("code").primaryKey(),
    iso639_2: text("iso639_2"),
    name: text("name").notNull(),
    native_name: text("native_name"),
    direction: text("direction").notNull().default("ltr"),
    family: text("family"),
    is_active: integer("is_active").notNull().default(1),
  },
  (table) => [index("geo_languages_name_idx").on(table.name)],
);

// Locales Table
export const geoLocales = geoSchema.table(
  "locales",
  {
    code: text("code").primaryKey(),
    language_code: text("language_code").notNull(),
    country_code: text("country_code"),
    name: text("name").notNull(),
    native_name: text("native_name"),
    direction: text("direction").notNull().default("ltr"),
    date_format: text("date_format"),
    time_format: text("time_format"),
    first_day_of_week: integer("first_day_of_week"),
    currency_code: text("currency_code"),
    number_system: text("number_system").notNull().default("latn"),
    is_active: integer("is_active").notNull().default(1),
  },
  (table) => [
    index("geo_locales_language_idx").on(table.language_code),
    index("geo_locales_country_idx").on(table.country_code),
  ],
);

// Postal Code Rules Table
export const geoPostalCodeRules = geoSchema.table(
  "postal_code_rules",
  {
    country_id: integer("country_id").primaryKey(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    format: text("format"),
    regex: text("regex"),
    example: text("example"),
    is_required: integer("is_required").notNull().default(0),
    is_supported: integer("is_supported").notNull().default(1),
    source: text("source").notNull(),
  },
  (table) => [
    index("geo_postal_code_rules_country_code_idx").on(table.country_code),
  ],
);

// Phone Number Rules Table
export const geoPhoneNumberRules = geoSchema.table(
  "phone_number_rules",
  {
    country_id: integer("country_id").primaryKey(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    dial_code: text("dial_code").notNull(),
    min_length: integer("min_length"),
    max_length: integer("max_length"),
    national_prefix: text("national_prefix"),
    trunk_prefix: text("trunk_prefix"),
    example: text("example"),
    validation_regex: text("validation_regex"),
    source: text("source").notNull(),
  },
  (table) => [
    index("geo_phone_number_rules_country_code_idx").on(table.country_code),
    index("geo_phone_number_rules_dial_code_idx").on(table.dial_code),
  ],
);

// Address Formats Table
export const geoAddressFormats = geoSchema.table(
  "address_formats",
  {
    country_id: integer("country_id").primaryKey(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    format: jsonb("format").$type<JsonObject>().notNull(),
    required_fields: jsonb("required_fields").$type<string[]>().notNull(),
    administrative_area_label: text("administrative_area_label"),
    locality_label: text("locality_label"),
    postal_code_label: text("postal_code_label"),
    source: text("source").notNull(),
  },
  (table) => [
    index("geo_address_formats_country_code_idx").on(table.country_code),
  ],
);

// Phone Codes Table
export const geoPhoneCodes = geoSchema.table(
  "phone_codes",
  {
    id: integer("id").primaryKey(),
    country_id: integer("country_id").notNull(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    phone_code: text("phone_code").notNull(),
    dial_code: text("dial_code").notNull(),
    calling_code: text("calling_code").notNull(),
    national_destination_code: text("national_destination_code"),
    is_shared_calling_code: integer("is_shared_calling_code").notNull(),
    flag: integer("flag").notNull(),
  },
  (table) => [
    index("geo_phone_codes_country_id_idx").on(table.country_id),
    index("geo_phone_codes_country_code_idx").on(table.country_code),
    index("geo_phone_codes_dial_code_idx").on(table.dial_code),
    index("geo_phone_codes_calling_code_idx").on(table.calling_code),
  ],
);

// Currencies Table
export const geoCurrencies = geoSchema.table("currencies", {
  code: text("code").primaryKey(),
  name: text("name"),
  symbol: text("symbol"),
});

// Timezones Table
export const geoTimezones = geoSchema.table("timezones", {
  id: integer("id").primaryKey(),
  country_id: integer("country_id").notNull(),
  zone_name: text("zone_name").notNull(),
  gmt_offset: integer("gmt_offset"),
  gmt_offset_name: text("gmt_offset_name"),
  abbreviation: text("abbreviation"),
  tz_name: text("tz_name"),
});

// Geo Select And Insert Types
export type GeoRegion = typeof geoRegions.$inferSelect;
export type NewGeoRegion = typeof geoRegions.$inferInsert;
export type GeoSubregion = typeof geoSubregions.$inferSelect;
export type NewGeoSubregion = typeof geoSubregions.$inferInsert;
export type GeoCountry = typeof geoCountries.$inferSelect;
export type NewGeoCountry = typeof geoCountries.$inferInsert;
export type GeoState = typeof geoStates.$inferSelect;
export type NewGeoState = typeof geoStates.$inferInsert;
export type GeoCity = typeof geoCities.$inferSelect;
export type NewGeoCity = typeof geoCities.$inferInsert;
export type GeoAdminArea = typeof geoAdminAreas.$inferSelect;
export type NewGeoAdminArea = typeof geoAdminAreas.$inferInsert;
export type GeoLocality = typeof geoLocalities.$inferSelect;
export type NewGeoLocality = typeof geoLocalities.$inferInsert;
export type GeoLanguage = typeof geoLanguages.$inferSelect;
export type NewGeoLanguage = typeof geoLanguages.$inferInsert;
export type GeoLocale = typeof geoLocales.$inferSelect;
export type NewGeoLocale = typeof geoLocales.$inferInsert;
export type GeoPostalCodeRule = typeof geoPostalCodeRules.$inferSelect;
export type NewGeoPostalCodeRule = typeof geoPostalCodeRules.$inferInsert;
export type GeoPhoneNumberRule = typeof geoPhoneNumberRules.$inferSelect;
export type NewGeoPhoneNumberRule = typeof geoPhoneNumberRules.$inferInsert;
export type GeoAddressFormat = typeof geoAddressFormats.$inferSelect;
export type NewGeoAddressFormat = typeof geoAddressFormats.$inferInsert;
export type GeoPhoneCode = typeof geoPhoneCodes.$inferSelect;
export type NewGeoPhoneCode = typeof geoPhoneCodes.$inferInsert;
export type GeoCurrency = typeof geoCurrencies.$inferSelect;
export type NewGeoCurrency = typeof geoCurrencies.$inferInsert;
export type GeoTimezone = typeof geoTimezones.$inferSelect;
export type NewGeoTimezone = typeof geoTimezones.$inferInsert;
