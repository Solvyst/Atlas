import { HttpClient } from "./http.js";
import type {
  AddressFormat,
  AdminArea,
  City,
  Country,
  Currency,
  GeoStatesResult,
  Language,
  ListAddressFormatsQuery,
  ListAdminAreasQuery,
  ListCitiesQuery,
  ListCountriesQuery,
  ListCurrenciesQuery,
  ListLanguagesQuery,
  ListLocalesQuery,
  ListLocalitiesQuery,
  ListPhoneCodesQuery,
  ListPhoneNumberRulesQuery,
  ListPostalCodeRulesQuery,
  ListRegionsQuery,
  ListStatesQuery,
  ListTimezonesQuery,
  Locale,
  Locality,
  PaginatedResult,
  PhoneCode,
  PhoneNumberRule,
  PostalCodeRule,
  Region,
  State,
  Timezone,
} from "./types.js";

/*************************** META API CLIENT ***************************/
export class MetaClient {
  constructor(private readonly http: HttpClient) {}

  /*************************** GEO SUMMARY ***************************/
  geo(country: string) {
    return this.http.get<GeoStatesResult>("/api/v1/meta/geo", { country });
  }

  /*************************** CORE GEO LISTS ***************************/
  regions(query?: ListRegionsQuery) {
    return this.http.get<PaginatedResult<Region>>("/api/v1/meta/regions", query);
  }

  countries(query?: ListCountriesQuery) {
    return this.http.get<PaginatedResult<Country>>(
      "/api/v1/meta/countries",
      query,
    );
  }

  states(query: ListStatesQuery) {
    return this.http.get<PaginatedResult<State>>("/api/v1/meta/states", query);
  }

  cities(query: ListCitiesQuery) {
    return this.http.get<PaginatedResult<City>>("/api/v1/meta/cities", query);
  }

  adminAreas(query: ListAdminAreasQuery) {
    return this.http.get<PaginatedResult<AdminArea>>(
      "/api/v1/meta/admin-areas",
      query,
    );
  }

  localities(query: ListLocalitiesQuery) {
    return this.http.get<PaginatedResult<Locality>>(
      "/api/v1/meta/localities",
      query,
    );
  }

  /*************************** LOCALIZATION LISTS ***************************/
  languages(query?: ListLanguagesQuery) {
    return this.http.get<PaginatedResult<Language>>(
      "/api/v1/meta/languages",
      query,
    );
  }

  locales(query?: ListLocalesQuery) {
    return this.http.get<PaginatedResult<Locale>>("/api/v1/meta/locales", query);
  }

  currencies(query?: ListCurrenciesQuery) {
    return this.http.get<PaginatedResult<Currency>>(
      "/api/v1/meta/currencies",
      query,
    );
  }

  timezones(query?: ListTimezonesQuery) {
    return this.http.get<PaginatedResult<Timezone>>(
      "/api/v1/meta/timezones",
      query,
    );
  }

  /*************************** COUNTRY RULES ***************************/
  postalCodeRules(query?: ListPostalCodeRulesQuery) {
    return this.http.get<PaginatedResult<PostalCodeRule>>(
      "/api/v1/meta/postal-code-rules",
      query,
    );
  }

  phoneNumberRules(query?: ListPhoneNumberRulesQuery) {
    return this.http.get<PaginatedResult<PhoneNumberRule>>(
      "/api/v1/meta/phone-number-rules",
      query,
    );
  }

  addressFormats(query?: ListAddressFormatsQuery) {
    return this.http.get<PaginatedResult<AddressFormat>>(
      "/api/v1/meta/address-formats",
      query,
    );
  }

  phoneCodes(query?: ListPhoneCodesQuery) {
    return this.http.get<PaginatedResult<PhoneCode>>(
      "/api/v1/meta/phone-codes",
      query,
    );
  }
}
