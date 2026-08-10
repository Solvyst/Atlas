import {
  bigint,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type JsonObject = Record<string, unknown>;

export type CountryTimezone = {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
};

export const metaSchema = pgSchema("meta");

export const metaRegions = metaSchema.table("regions", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  translations: jsonb("translations").$type<JsonObject>(),
  created_at: timestamp("created_at", { mode: "string" }),
  updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
  flag: integer("flag").notNull(),
  wiki_data_id: text("wiki_data_id"),
});

export const metaSubregions = metaSchema.table(
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
  (table) => [index("meta_subregions_region_id_idx").on(table.region_id)],
);

export const metaCountries = metaSchema.table(
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
    index("meta_countries_region_id_idx").on(table.region_id),
    index("meta_countries_subregion_id_idx").on(table.subregion_id),
  ],
);

export const metaStates = metaSchema.table(
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
  (table) => [index("meta_states_country_id_idx").on(table.country_id)],
);

export const metaCities = metaSchema.table(
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
    index("meta_cities_country_id_idx").on(table.country_id),
    index("meta_cities_state_id_idx").on(table.state_id),
  ],
);

export const metaAdminAreas = metaSchema.table(
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
    index("meta_admin_areas_country_id_idx").on(table.country_id),
    index("meta_admin_areas_country_parent_idx").on(
      table.country_id,
      table.parent_id,
    ),
    index("meta_admin_areas_country_level_idx").on(
      table.country_id,
      table.level,
    ),
    index("meta_admin_areas_country_type_idx").on(table.country_id, table.type),
    index("meta_admin_areas_parent_id_idx").on(table.parent_id),
    index("meta_admin_areas_source_idx").on(table.source, table.source_id),
  ],
);

export const metaLocalities = metaSchema.table(
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
    index("meta_localities_country_id_idx").on(table.country_id),
    index("meta_localities_admin_area_id_idx").on(table.admin_area_id),
    index("meta_localities_country_type_idx").on(table.country_id, table.type),
    index("meta_localities_settlement_idx").on(table.is_settlement),
    index("meta_localities_source_idx").on(table.source, table.source_id),
  ],
);

export const metaCurrencies = metaSchema.table("currencies", {
  code: text("code").primaryKey(),
  name: text("name"),
  symbol: text("symbol"),
});

export const metaTimezones = metaSchema.table("timezones", {
  id: integer("id").primaryKey(),
  country_id: integer("country_id").notNull(),
  zone_name: text("zone_name").notNull(),
  gmt_offset: integer("gmt_offset"),
  gmt_offset_name: text("gmt_offset_name"),
  abbreviation: text("abbreviation"),
  tz_name: text("tz_name"),
});

export type MetaRegion = typeof metaRegions.$inferSelect;
export type NewMetaRegion = typeof metaRegions.$inferInsert;
export type MetaSubregion = typeof metaSubregions.$inferSelect;
export type NewMetaSubregion = typeof metaSubregions.$inferInsert;
export type MetaCountry = typeof metaCountries.$inferSelect;
export type NewMetaCountry = typeof metaCountries.$inferInsert;
export type MetaState = typeof metaStates.$inferSelect;
export type NewMetaState = typeof metaStates.$inferInsert;
export type MetaCity = typeof metaCities.$inferSelect;
export type NewMetaCity = typeof metaCities.$inferInsert;
export type MetaAdminArea = typeof metaAdminAreas.$inferSelect;
export type NewMetaAdminArea = typeof metaAdminAreas.$inferInsert;
export type MetaLocality = typeof metaLocalities.$inferSelect;
export type NewMetaLocality = typeof metaLocalities.$inferInsert;
export type MetaCurrency = typeof metaCurrencies.$inferSelect;
export type NewMetaCurrency = typeof metaCurrencies.$inferInsert;
export type MetaTimezone = typeof metaTimezones.$inferSelect;
export type NewMetaTimezone = typeof metaTimezones.$inferInsert;
