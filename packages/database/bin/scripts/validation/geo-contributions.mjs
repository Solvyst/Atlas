import fs from "node:fs";
import path from "node:path";

import { geoContributionsDir } from "../_shared/paths.mjs";
import { readContributionArrayOrErrors, walkJsonFiles } from "../_shared/json.mjs";
import { checkUnique, validateRows } from "../_shared/validation.mjs";

// Required Geo Files
const requiredFiles = [
  path.join("regions", "regions.json"),
  path.join("subregions", "subregions.json"),
  path.join("countries", "countries.json"),
  path.join("states", "states.json"),
  path.join("languages", "languages.json"),
  path.join("phone-codes", "phone-codes.json"),
  path.join("timezones", "timezones.json"),
  path.join("locales", "locales.json"),
];

// Geo Field Specs
const fieldSpecs = {
  regions: [
    "created_at",
    "flag",
    "id",
    "name",
    "translations",
    "updated_at",
    "wikiDataId",
  ],
  subregions: [
    "created_at",
    "flag",
    "id",
    "name",
    "region_id",
    "translations",
    "updated_at",
    "wikiDataId",
  ],
  countries: [
    "area_sq_km",
    "capital",
    "created_at",
    "currency",
    "currency_name",
    "currency_symbol",
    "emoji",
    "emojiU",
    "flag",
    "gdp",
    "id",
    "iso2",
    "iso3",
    "latitude",
    "longitude",
    "name",
    "nationality",
    "native",
    "numeric_code",
    "phonecode",
    "population",
    "postal_code_format",
    "postal_code_regex",
    "region",
    "region_id",
    "subregion",
    "subregion_id",
    "timezones",
    "tld",
    "translations",
    "updated_at",
    "wikiDataId",
  ],
  states: [
    "country_code",
    "country_id",
    "created_at",
    "fips_code",
    "flag",
    "id",
    "iso2",
    "iso3166_2",
    "latitude",
    "level",
    "longitude",
    "name",
    "native",
    "parent_id",
    "population",
    "timezone",
    "translations",
    "type",
    "updated_at",
    "wikiDataId",
  ],
  cities: [
    "country_code",
    "country_id",
    "created_at",
    "flag",
    "id",
    "latitude",
    "level",
    "longitude",
    "name",
    "native",
    "parent_id",
    "population",
    "state_code",
    "state_id",
    "timezone",
    "translations",
    "type",
    "updated_at",
    "wikiDataId",
  ],
  postcodes: [
    "city_id",
    "code",
    "country_code",
    "country_id",
    "created_at",
    "flag",
    "id",
    "latitude",
    "locality_name",
    "longitude",
    "source",
    "state_code",
    "state_id",
    "type",
    "updated_at",
    "wikiDataId",
  ],
  languages: [
    "code",
    "direction",
    "family",
    "is_active",
    "iso639_2",
    "name",
    "native_name",
  ],
  phoneCodes: [
    "calling_code",
    "country_code",
    "country_id",
    "country_name",
    "dial_code",
    "flag",
    "id",
    "is_shared_calling_code",
    "national_destination_code",
    "phone_code",
  ],
  timezones: [
    "abbreviation",
    "country_id",
    "gmt_offset",
    "gmt_offset_name",
    "id",
    "tz_name",
    "zone_name",
  ],
  locales: [
    "code",
    "country_code",
    "currency_code",
    "date_format",
    "direction",
    "first_day_of_week",
    "is_active",
    "language_code",
    "name",
    "native_name",
    "number_system",
    "time_format",
  ],
};

// Validation Errors
const errors = [];

// Read Geo Array
function readArray(relativePath) {
  return readContributionArrayOrErrors(geoContributionsDir, relativePath, errors);
}

// Check Required Files
for (const file of requiredFiles) readArray(file);

const regions = readArray(path.join("regions", "regions.json"));
const subregions = readArray(path.join("subregions", "subregions.json"));
const countries = readArray(path.join("countries", "countries.json"));
const states = readArray(path.join("states", "states.json"));
const languages = readArray(path.join("languages", "languages.json"));
const phoneCodes = readArray(path.join("phone-codes", "phone-codes.json"));
const timezones = readArray(path.join("timezones", "timezones.json"));
const locales = readArray(path.join("locales", "locales.json"));

validateRows("regions/regions.json", regions, fieldSpecs.regions, ["id", "name"], errors);
validateRows("subregions/subregions.json", subregions, fieldSpecs.subregions, [
  "id",
  "name",
  "region_id",
], errors);
validateRows("countries/countries.json", countries, fieldSpecs.countries, [
  "id",
  "name",
  "iso2",
  "iso3",
], errors);
validateRows("states/states.json", states, fieldSpecs.states, [
  "id",
  "name",
  "country_id",
  "country_code",
  "iso2",
], errors);
validateRows("languages/languages.json", languages, fieldSpecs.languages, [
  "code",
  "name",
  "direction",
], errors);
validateRows("phone-codes/phone-codes.json", phoneCodes, fieldSpecs.phoneCodes, [
  "id",
  "country_id",
  "country_code",
  "country_name",
  "phone_code",
  "dial_code",
  "calling_code",
], errors);
validateRows("timezones/timezones.json", timezones, fieldSpecs.timezones, [
  "id",
  "country_id",
  "zone_name",
], errors);
validateRows("locales/locales.json", locales, fieldSpecs.locales, [
  "code",
  "language_code",
  "name",
  "direction",
], errors);

checkUnique("regions/regions.json", regions, "id", errors);
checkUnique("subregions/subregions.json", subregions, "id", errors);
checkUnique("countries/countries.json", countries, "id", errors);
checkUnique("states/states.json", states, "id", errors);
checkUnique("languages/languages.json", languages, "code", errors);
checkUnique("phone-codes/phone-codes.json", phoneCodes, "id", errors);
checkUnique("timezones/timezones.json", timezones, "id", errors);
checkUnique("locales/locales.json", locales, "code", errors);

// Foreign Key Sets
const countryIds = new Set(countries.map((country) => country.id));
const countryCodes = new Set(countries.map((country) => country.iso2));
const stateIds = new Set(states.map((state) => state.id));

// Validate Phone Code Relations
for (const [index, phoneCode] of phoneCodes.entries()) {
  if (!countryIds.has(phoneCode.country_id)) {
    errors.push(
      "phone-codes/phone-codes.json[" +
        index +
        "]: unknown country_id " +
        phoneCode.country_id,
    );
  }
  if (!countryCodes.has(phoneCode.country_code)) {
    errors.push(
      "phone-codes/phone-codes.json[" +
        index +
        "]: unknown country_code " +
        phoneCode.country_code,
    );
  }
}

// Validate Locale Relations
const languageCodes = new Set(languages.map((language) => language.code));

for (const [index, locale] of locales.entries()) {
  if (!languageCodes.has(locale.language_code)) {
    errors.push(
      "locales/locales.json[" +
        index +
        "]: unknown language_code " +
        locale.language_code,
    );
  }
  if (locale.country_code && !countryCodes.has(locale.country_code)) {
    errors.push(
      "locales/locales.json[" +
        index +
        "]: unknown country_code " +
        locale.country_code,
    );
  }
}

// Validate Timezone Relations
for (const [index, timezone] of timezones.entries()) {
  if (!countryIds.has(timezone.country_id)) {
    errors.push(
      "timezones/timezones.json[" +
        index +
        "]: unknown country_id " +
        timezone.country_id,
    );
  }
}

// Validate State Relations
for (const [index, state] of states.entries()) {
  if (!countryIds.has(state.country_id)) {
    errors.push(
      "states/states.json[" + index + "]: unknown country_id " + state.country_id,
    );
  }
  if (!countryCodes.has(state.country_code)) {
    errors.push(
      "states/states.json[" +
        index +
        "]: unknown country_code " +
        state.country_code,
    );
  }
}

// Validate City Files
const citiesDir = path.join(geoContributionsDir, "cities");
if (!fs.existsSync(citiesDir)) {
  errors.push("cities: missing directory");
} else {
  for (const entry of fs.readdirSync(citiesDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    const relativePath = path.join("cities", entry.name);
    const rows = readArray(relativePath);
    validateRows(relativePath, rows, fieldSpecs.cities, [
      "id",
      "name",
      "state_id",
      "country_id",
      "country_code",
      "latitude",
      "longitude",
    ], errors);
    checkUnique(relativePath, rows, "id", errors);

    rows.forEach((city, index) => {
      if (!stateIds.has(city.state_id)) {
        errors.push(
          relativePath + "[" + index + "]: unknown state_id " + city.state_id,
        );
      }
      if (!countryIds.has(city.country_id)) {
        errors.push(
          relativePath +
            "[" +
            index +
            "]: unknown country_id " +
            city.country_id,
        );
      }
    });
  }
}

// Validate Postcode Files
const postcodesDir = path.join(geoContributionsDir, "postcodes");
if (fs.existsSync(postcodesDir)) {
  for (const filePath of walkJsonFiles(postcodesDir)) {
    const relativePath = path.relative(geoContributionsDir, filePath);
    const rows = readArray(relativePath);
    validateRows(relativePath, rows, fieldSpecs.postcodes, [
      "code",
      "country_id",
      "country_code",
    ], errors);
    checkUnique(relativePath, rows, "id", errors);
  }
}

// Print Validation Result
if (errors.length) {
  console.error("Geo contribution validation failed:");
  for (const error of errors.slice(0, 200)) console.error("- " + error);
  if (errors.length > 200)
    console.error("...and " + (errors.length - 200) + " more errors");
  process.exit(1);
}

console.log("Geo contributions valid");
