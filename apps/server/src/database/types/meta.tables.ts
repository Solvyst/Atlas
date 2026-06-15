import type { Generated, Insertable, Selectable, Updateable } from "kysely";

//Json Object
export type JsonObject = Record<string, unknown>;

//Country Timezone
export type CountryTimezone = {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
};

//Meta Region Table
export interface MetaRegionsTable {
  id: number;
  name: string;
  translations: JsonObject | null;
  created_at: string | null;
  updated_at: Generated<string>;
  flag: Generated<number>;
  wiki_data_id: string | null;
}

//Meta Country Table
export interface MetaCountriesTable {
  id: number;
  name: string;
  iso3: string | null;
  numeric_code: string | null;
  iso2: string | null;
  phonecode: string | null;
  capital: string | null;
  currency: string | null;
  currency_name: string | null;
  currency_symbol: string | null;
  tld: string | null;
  native: string | null;
  population: number | null;
  gdp: number | null;
  region: string | null;
  region_id: number | null;
  subregion: string | null;
  subregion_id: number | null;
  nationality: string | null;
  area_sq_km: number | null;
  postal_code_format: string | null;
  postal_code_regex: string | null;
  timezones: CountryTimezone[] | null;
  translations: JsonObject | null;
  latitude: string | null;
  longitude: string | null;
  emoji: string | null;
  emoji_u: string | null;
  created_at: string | null;
  updated_at: Generated<string>;
  flag: Generated<number>;
  wiki_data_id: string | null;
}

//Meta State Table
export interface MetaStatesTable {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  parent_id: number | null;
}

//Meta City Table
export interface MetaCitiesTable {
  id: number;
  name: string;
  state_id: number;
  state_code: string;
  state_name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  latitude: string;
  longitude: string;
  native: string | null;
  timezone: string | null;
  wiki_data_id: string | null;
}

//Meta Currency Table
export interface MetaCurrenciesTable {
  code: string;
  name: string | null;
  symbol: string | null;
}

//Meta Timezone Table
export interface MetaTimezonesTable {
  id: Generated<number>;
  country_id: number;
  zone_name: string;
  gmt_offset: number | null;
  gmt_offset_name: string | null;
  abbreviation: string | null;
  tz_name: string | null;
}

//Meta Selectable Rows
export type MetaRegionRow = Selectable<MetaRegionsTable>;
export type MetaCountryRow = Selectable<MetaCountriesTable>;
export type MetaStateRow = Selectable<MetaStatesTable>;
export type MetaCityRow = Selectable<MetaCitiesTable>;
export type MetaCurrencyRow = Selectable<MetaCurrenciesTable>;
export type MetaTimezoneRow = Selectable<MetaTimezonesTable>;

//Meta Insertable Rows
export type NewMetaRegion = Insertable<MetaRegionsTable>;
export type NewMetaCountry = Insertable<MetaCountriesTable>;
export type NewMetaState = Insertable<MetaStatesTable>;
export type NewMetaCity = Insertable<MetaCitiesTable>;
export type NewMetaCurrency = Insertable<MetaCurrenciesTable>;
export type NewMetaTimezone = Insertable<MetaTimezonesTable>;

//Meta Updateable Rows
export type MetaRegionUpdate = Updateable<MetaRegionsTable>;
export type MetaCountryUpdate = Updateable<MetaCountriesTable>;
export type MetaStateUpdate = Updateable<MetaStatesTable>;
export type MetaCityUpdate = Updateable<MetaCitiesTable>;
export type MetaCurrencyUpdate = Updateable<MetaCurrenciesTable>;
export type MetaTimezoneUpdate = Updateable<MetaTimezonesTable>;
