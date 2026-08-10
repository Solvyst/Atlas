import { GeoRepo } from "../repo/geo.repo.js";
import { withPagination } from "../utils/meta.utils.js";
import { AppError } from "@/lib/AppError.js";

import type {
  ListAdminAreasInput,
  ListCitiesInput,
  ListCountriesInput,
  ListCurrenciesInput,
  ListLocalitiesInput,
  ListRegionsInput,
  ListStatesInput,
  ListTimezonesInput,
} from "../dto/meta.dto.js";

const DEFAULT_LIST_LIMIT = 100;
const GLOBAL_CITY_SEARCH_LIMIT = 20;

function withDefaultLimit<T extends { limit?: number }>(
  query: T,
  defaultLimit = DEFAULT_LIST_LIMIT,
): T & { limit: number } {
  return {
    ...query,
    limit: query.limit ?? defaultLimit,
  };
}

export class GeoService {
  /*************************** GET GEO STATES ***************************/
  static async getGeoStates(country: string) {
    const value = country.trim();
    if (!value) throw AppError.badRequest("country is required");

    const found = await GeoRepo.findCountryByGeo(value);
    if (!found) throw AppError.notFound("Country not found");

    const states = await GeoRepo.listStatesByCountryId(found.id);

    return {
      country: found,
      states,
    };
  }

  /*************************** LIST REGIONS ***************************/
  static async listRegions(query: ListRegionsInput) {
    const pagination = withDefaultLimit(query);
    const items = await GeoRepo.listRegions(pagination);
    return withPagination(items, pagination);
  }

  /*************************** LIST COUNTRIES ***************************/
  static async listCountries(query: ListCountriesInput) {
    const pagination = withDefaultLimit(query);
    const items = await GeoRepo.listCountries(pagination);
    return withPagination(items, pagination);
  }

  /*************************** LIST STATES ***************************/
  static async listStates(query: ListStatesInput) {
    if (!query.countryCode && !query.countryId && !query.search) {
      throw AppError.badRequest("countryCode, countryId or search is required");
    }

    const pagination = withDefaultLimit(query);
    const items = await GeoRepo.listStates(pagination);
    return withPagination(items, pagination);
  }

  /*************************** LIST CITIES ***************************/
  static async listCities(query: ListCitiesInput) {
    if (!query.stateId && !query.search) {
      throw AppError.badRequest("stateId or search is required");
    }

    const pagination = withDefaultLimit(
      {
        ...query,
        limit:
          query.stateId === undefined
            ? Math.min(
                query.limit ?? GLOBAL_CITY_SEARCH_LIMIT,
                GLOBAL_CITY_SEARCH_LIMIT,
              )
            : query.limit,
      },
      DEFAULT_LIST_LIMIT,
    );

    const items = await GeoRepo.listCities(pagination);
    return withPagination(items, pagination);
  }

  /*************************** LIST ADMIN AREAS ***************************/
  static async listAdminAreas(query: ListAdminAreasInput) {
    if (
      !query.countryCode &&
      !query.countryId &&
      !query.parentId &&
      !query.search
    ) {
      throw AppError.badRequest(
        "countryCode, countryId, parentId or search is required",
      );
    }

    const pagination = withDefaultLimit(query);
    const items = await GeoRepo.listAdminAreas(pagination);
    return withPagination(items, pagination);
  }

  /*************************** LIST LOCALITIES ***************************/
  static async listLocalities(query: ListLocalitiesInput) {
    if (
      !query.countryCode &&
      !query.countryId &&
      !query.adminAreaId &&
      !query.search
    ) {
      throw AppError.badRequest(
        "countryCode, countryId, adminAreaId or search is required",
      );
    }

    const pagination = withDefaultLimit(
      {
        ...query,
        limit:
          query.adminAreaId === undefined
            ? Math.min(
                query.limit ?? GLOBAL_CITY_SEARCH_LIMIT,
                GLOBAL_CITY_SEARCH_LIMIT,
              )
            : query.limit,
      },
      DEFAULT_LIST_LIMIT,
    );

    const items = await GeoRepo.listLocalities(pagination);
    return withPagination(items, pagination);
  }

  /*************************** LIST CURRENCIES ***************************/
  static async listCurrencies(query: ListCurrenciesInput) {
    const pagination = withDefaultLimit(query);
    const items = await GeoRepo.listCurrencies(pagination);
    return withPagination(items, pagination);
  }

  /*************************** LIST TIMEZONES ***************************/
  static async listTimezones(query: ListTimezonesInput) {
    const pagination = withDefaultLimit(query);
    const items = await GeoRepo.listTimezones(pagination);
    return withPagination(items, pagination);
  }
}
