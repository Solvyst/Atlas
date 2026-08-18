import { geoContributionsDir } from "./paths.mjs";
import { readContributionArray } from "./json.mjs";

// Read Geo Countries Indexed By ISO2
export function readGeoCountriesByCode() {
  return new Map(
    readContributionArray(geoContributionsDir, "countries/countries.json")
      .filter((country) => country.iso2)
      .map((country) => [country.iso2, country]),
  );
}
