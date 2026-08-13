import { dataset, runDatabaseImport } from "../_shared/import-db.mjs";
import {
  geoContributionsDir,
} from "../_shared/paths.mjs";
import {
  readContributionArray,
  readJsonDir as readJsonDirFromContributions,
  readOptionalContributionArray,
} from "../_shared/json.mjs";

// Import Constants
const defaultTimestamp = "2014-01-01 12:01:01";
const generatedAdminAreaStartId = 9_000_000;

// Admin-Only Locality Types
const adminOnlyLocalityTypes = new Set([
  "county",
  "regency",
  "prefecture",
  "parish",
  "banner",
  "province",
  "area",
  "oblast",
  "administrative zone",
  "region",
  "abandoned",
  "historical",
  "destroyed",
  "religious",
  "historical_capital",
]);

// Read Geo JSON
function readJson(relativePath) {
  return readContributionArray(geoContributionsDir, relativePath);
}

function readJsonDir(relativeDir) {
  return readJsonDirFromContributions(geoContributionsDir, relativeDir);
}

function optionalJson(relativePath, fallback = []) {
  return readOptionalContributionArray(geoContributionsDir, relativePath, fallback);
}

// Pick WikiData ID
function pickWikiDataId(row) {
  return row.wikiDataId ?? row.wiki_data_id ?? null;
}

// Normalize Admin Level
function normalizeAdminLevel(row, fallbackLevel) {
  return row.level ?? fallbackLevel;
}

// Detect Settlement
function isSettlement(row) {
  return row.type === undefined || row.type === null
    ? Boolean(row.latitude && row.longitude)
    : !adminOnlyLocalityTypes.has(row.type);
}

// Normalize Phone Code
function normalizePhoneCode(phonecode) {
  const raw = String(phonecode ?? "").trim();
  const cleaned = raw.replace(/^\++/, "").replace(/\s+/g, "");
  const [callingCode, ...rest] = cleaned.split("-").filter(Boolean);

  return {
    phone_code: cleaned,
    dial_code: cleaned ? "+" + cleaned : null,
    calling_code: callingCode ? "+" + callingCode : null,
    national_destination_code: rest.length ? rest.join("-") : null,
  };
}

// Build Regions
function buildRegions() {
  return readJson("regions/regions.json").map((region) => ({
    id: region.id,
    name: region.name,
    translations: region.translations,
    created_at: null,
    updated_at: defaultTimestamp,
    flag: 1,
    wiki_data_id: pickWikiDataId(region),
  }));
}

// Build Subregions
function buildSubregions() {
  return readJson("subregions/subregions.json").map((subregion) => ({
    id: subregion.id,
    name: subregion.name,
    translations: subregion.translations,
    region_id: subregion.region_id,
    created_at: null,
    updated_at: defaultTimestamp,
    flag: 1,
    wiki_data_id: pickWikiDataId(subregion),
  }));
}

// Build Countries
function buildCountries(countries) {
  return countries.map((country) => ({
    id: country.id,
    name: country.name,
    iso3: country.iso3,
    numeric_code: country.numeric_code,
    iso2: country.iso2,
    phonecode: country.phonecode,
    capital: country.capital,
    currency: country.currency,
    currency_name: country.currency_name,
    currency_symbol: country.currency_symbol,
    tld: country.tld,
    native: country.native,
    population: country.population,
    gdp: country.gdp,
    region: country.region,
    region_id: country.region_id,
    subregion: country.subregion,
    subregion_id: country.subregion_id,
    nationality: country.nationality,
    area_sq_km: country.area_sq_km,
    postal_code_format: country.postal_code_format,
    postal_code_regex: country.postal_code_regex,
    timezones: country.timezones,
    translations: country.translations,
    latitude: country.latitude,
    longitude: country.longitude,
    emoji: country.emoji,
    emoji_u: country.emojiU,
    created_at: null,
    updated_at: defaultTimestamp,
    flag: 1,
    wiki_data_id: pickWikiDataId(country),
  }));
}

// Build States
function buildStates(states) {
  return states.map((state) => ({
    id: state.id,
    name: state.name,
    country_id: state.country_id,
    country_code: state.country_code,
    country_name: state.country_name,
    fips_code: state.fips_code,
    iso2: state.iso2,
    state_code: state.iso2,
    iso3166_2: state.iso3166_2,
    type: state.type,
    level: state.level,
    parent_id: state.parent_id,
    native: state.native,
    latitude: state.latitude,
    longitude: state.longitude,
    timezone: state.timezone,
    translations: state.translations,
    population: state.population,
    created_at: null,
    updated_at: defaultTimestamp,
    flag: 1,
    wiki_data_id: pickWikiDataId(state),
  }));
}

// Build Cities
function buildCities(countries, statesById, cities) {
  return cities.map((city) => {
    const state = statesById.get(city.state_id);
    const country = countries.get(city.country_id);

    return {
      id: city.id,
      name: city.name,
      state_id: city.state_id,
      state_code: city.state_code ?? state?.iso2,
      state_name: city.state_name ?? state?.name,
      country_id: city.country_id,
      country_code: city.country_code,
      country_name: city.country_name ?? country?.name,
      type: city.type,
      level: city.level,
      parent_id: city.parent_id,
      latitude: city.latitude,
      longitude: city.longitude,
      native: city.native,
      population: city.population,
      timezone: city.timezone ?? state?.timezone,
      translations: city.translations,
      created_at: null,
      updated_at: defaultTimestamp,
      flag: 1,
      wiki_data_id: pickWikiDataId(city),
    };
  });
}

// Build Admin Areas
function buildAdminAreas(states) {
  const adminAreas = states.map((state) => ({
    id: state.id,
    source: "countries-states-cities-database:states",
    source_id: String(state.id),
    country_id: state.country_id,
    country_code: state.country_code,
    parent_id: state.parent_id,
    name: state.name,
    code: state.iso2,
    iso3166_2: state.iso3166_2,
    type: state.type || "state",
    level: normalizeAdminLevel(state, 1),
    native: state.native,
    latitude: state.latitude,
    longitude: state.longitude,
    timezone: state.timezone,
    translations: state.translations,
    population: state.population,
    created_at: null,
    updated_at: defaultTimestamp,
    flag: 1,
    wiki_data_id: pickWikiDataId(state),
  }));

  for (const [index, county] of optionalJson("counties/US.json").entries()) {
    adminAreas.push({
      id: generatedAdminAreaStartId + index,
      source: "countries-states-cities-database:counties/US",
      source_id: `US:${county.state_id}:${county.name}`,
      country_id: county.country_id,
      country_code: county.country_code,
      parent_id: county.state_id,
      name: county.name,
      code: null,
      iso3166_2: null,
      type: county.type || "county",
      level: normalizeAdminLevel(county, 2),
      native: county.native,
      latitude: county.latitude,
      longitude: county.longitude,
      timezone: county.timezone,
      translations: county.translations,
      population: county.population,
      created_at: null,
      updated_at: defaultTimestamp,
      flag: 1,
      wiki_data_id: pickWikiDataId(county),
    });
  }

  return adminAreas;
}

// Build Localities
function buildLocalities(countries, statesById, cities) {
  return cities.map((city) => {
    const state = statesById.get(city.state_id);
    const country = countries.get(city.country_id);

    return {
      id: city.id,
      source: "countries-states-cities-database:cities",
      source_id: String(city.id),
      country_id: city.country_id,
      country_code: city.country_code,
      country_name: city.country_name ?? country?.name,
      admin_area_id: city.state_id,
      admin_area_code: city.state_code ?? state?.iso2,
      admin_area_name: city.state_name ?? state?.name,
      parent_id: city.parent_id,
      name: city.name,
      type: city.type,
      level: city.level,
      is_settlement: isSettlement(city) ? 1 : 0,
      latitude: city.latitude,
      longitude: city.longitude,
      native: city.native,
      population: city.population,
      timezone: city.timezone ?? state?.timezone,
      translations: city.translations,
      created_at: null,
      updated_at: defaultTimestamp,
      flag: 1,
      wiki_data_id: pickWikiDataId(city),
    };
  });
}

// Build Currencies
function buildCurrencies(countries) {
  const byCode = new Map();

  for (const country of countries) {
    if (!country.currency) continue;
    if (!byCode.has(country.currency)) {
      byCode.set(country.currency, {
        code: country.currency,
        name: country.currency_name,
        symbol: country.currency_symbol,
      });
    }
  }

  return [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code));
}

// Build Postal Code Example
function postalCodeExample(format) {
  if (!format) return null;
  return String(format)
    .replace(/#/g, "1")
    .replace(/@/g, "A")
    .replace(/[A-Z]/g, "A")
    .replace(/[0-9]/g, "1");
}

// Build Postal Code Rules
function buildPostalCodeRules(countries) {
  return countries.map((country) => ({
    country_id: country.id,
    country_code: country.iso2,
    country_name: country.name,
    format: country.postal_code_format,
    regex: country.postal_code_regex,
    example: postalCodeExample(country.postal_code_format),
    is_required:
      country.postal_code_format || country.postal_code_regex ? 1 : 0,
    is_supported:
      country.postal_code_format || country.postal_code_regex ? 1 : 0,
    source: "countries-states-cities-database:countries.postal_code_*",
  }));
}

// Build Phone Number Rules
function buildPhoneNumberRules(countries) {
  return countries
    .filter((country) => country.phonecode)
    .map((country) => {
      const phone = normalizePhoneCode(country.phonecode);
      return {
        country_id: country.id,
        country_code: country.iso2,
        country_name: country.name,
        dial_code: phone.dial_code,
        min_length: null,
        max_length: null,
        national_prefix: null,
        trunk_prefix: null,
        example: null,
        validation_regex: null,
        source: "countries-states-cities-database:countries.phonecode",
      };
    });
}

// Build Address Formats
function buildAddressFormats(countries) {
  return countries.map((country) => {
    const hasPostalCode = Boolean(
      country.postal_code_format || country.postal_code_regex,
    );
    return {
      country_id: country.id,
      country_code: country.iso2,
      country_name: country.name,
      format: {
        lines: [
          "recipient",
          "address_line_1",
          "address_line_2",
          "locality administrative_area postal_code",
          "country",
        ],
      },
      required_fields: hasPostalCode
        ? ["recipient", "address_line_1", "locality", "country", "postal_code"]
        : ["recipient", "address_line_1", "locality", "country"],
      administrative_area_label: "State/Province/Region",
      locality_label: "City/Town/Locality",
      postal_code_label: hasPostalCode ? "Postal code" : null,
      source: "solvyst-atlas:derived-country-address-starter",
    };
  });
}

// Load Geo Source Data
const countries = readJson("countries/countries.json");
const states = readJson("states/states.json");
const cities = readJsonDir("cities");
const countriesById = new Map(countries.map((country) => [country.id, country]));
const statesById = new Map(states.map((state) => [state.id, state]));

// Geo Dataset Imports
const datasets = [
  dataset("geo.regions", [
    "id",
    "name",
    "translations",
    "created_at",
    "updated_at",
    "flag",
    "wiki_data_id",
  ], buildRegions()),
  dataset("geo.subregions", [
    "id",
    "name",
    "translations",
    "region_id",
    "created_at",
    "updated_at",
    "flag",
    "wiki_data_id",
  ], buildSubregions()),
  dataset("geo.countries", [
    "id",
    "name",
    "iso3",
    "numeric_code",
    "iso2",
    "phonecode",
    "capital",
    "currency",
    "currency_name",
    "currency_symbol",
    "tld",
    "native",
    "population",
    "gdp",
    "region",
    "region_id",
    "subregion",
    "subregion_id",
    "nationality",
    "area_sq_km",
    "postal_code_format",
    "postal_code_regex",
    "timezones",
    "translations",
    "latitude",
    "longitude",
    "emoji",
    "emoji_u",
    "created_at",
    "updated_at",
    "flag",
    "wiki_data_id",
  ], buildCountries(countries)),
  dataset("geo.states", [
    "id",
    "name",
    "country_id",
    "country_code",
    "country_name",
    "fips_code",
    "iso2",
    "state_code",
    "iso3166_2",
    "type",
    "level",
    "parent_id",
    "native",
    "latitude",
    "longitude",
    "timezone",
    "translations",
    "population",
    "created_at",
    "updated_at",
    "flag",
    "wiki_data_id",
  ], buildStates(states)),
  dataset("geo.cities", [
    "id",
    "name",
    "state_id",
    "state_code",
    "state_name",
    "country_id",
    "country_code",
    "country_name",
    "type",
    "level",
    "parent_id",
    "latitude",
    "longitude",
    "native",
    "population",
    "timezone",
    "translations",
    "created_at",
    "updated_at",
    "flag",
    "wiki_data_id",
  ], buildCities(countriesById, statesById, cities)),
  dataset("geo.admin_areas", [
    "id",
    "source",
    "source_id",
    "country_id",
    "country_code",
    "parent_id",
    "name",
    "code",
    "iso3166_2",
    "type",
    "level",
    "native",
    "latitude",
    "longitude",
    "timezone",
    "translations",
    "population",
    "created_at",
    "updated_at",
    "flag",
    "wiki_data_id",
  ], buildAdminAreas(states)),
  dataset("geo.localities", [
    "id",
    "source",
    "source_id",
    "country_id",
    "country_code",
    "country_name",
    "admin_area_id",
    "admin_area_code",
    "admin_area_name",
    "parent_id",
    "name",
    "type",
    "level",
    "is_settlement",
    "latitude",
    "longitude",
    "native",
    "population",
    "timezone",
    "translations",
    "created_at",
    "updated_at",
    "flag",
    "wiki_data_id",
  ], buildLocalities(countriesById, statesById, cities)),
  dataset("geo.currencies", ["code", "name", "symbol"], buildCurrencies(countries), ["code"]),
  dataset("geo.timezones", [
    "id",
    "country_id",
    "zone_name",
    "gmt_offset",
    "gmt_offset_name",
    "abbreviation",
    "tz_name",
  ], readJson("timezones/timezones.json")),
  dataset("geo.phone_codes", [
    "id",
    "country_id",
    "country_code",
    "country_name",
    "phone_code",
    "dial_code",
    "calling_code",
    "national_destination_code",
    "is_shared_calling_code",
    "flag",
  ], readJson("phone-codes/phone-codes.json")),
  dataset("geo.languages", [
    "code",
    "iso639_2",
    "name",
    "native_name",
    "direction",
    "family",
    "is_active",
  ], readJson("languages/languages.json"), ["code"]),
  dataset("geo.locales", [
    "code",
    "language_code",
    "country_code",
    "name",
    "native_name",
    "direction",
    "date_format",
    "time_format",
    "first_day_of_week",
    "currency_code",
    "number_system",
    "is_active",
  ], readJson("locales/locales.json"), ["code"]),
  dataset("geo.postal_code_rules", [
    "country_id",
    "country_code",
    "country_name",
    "format",
    "regex",
    "example",
    "is_required",
    "is_supported",
    "source",
  ], buildPostalCodeRules(countries), ["country_id"]),
  dataset("geo.phone_number_rules", [
    "country_id",
    "country_code",
    "country_name",
    "dial_code",
    "min_length",
    "max_length",
    "national_prefix",
    "trunk_prefix",
    "example",
    "validation_regex",
    "source",
  ], buildPhoneNumberRules(countries), ["country_id"]),
  dataset("geo.address_formats", [
    "country_id",
    "country_code",
    "country_name",
    "format",
    "required_fields",
    "administrative_area_label",
    "locality_label",
    "postal_code_label",
    "source",
  ], buildAddressFormats(countries), ["country_id"]),
];

// Run Geo Import
await runDatabaseImport(datasets);
