import { AppError } from "@/lib/AppError.js";
import type {
  ListCitiesInput,
  ListCountriesInput,
  ListCurrenciesInput,
  ListRegionsInput,
  ListStatesInput,
  ListTimezonesInput,
} from "../dto/meta.dto.js";
import { GeoRepo } from "../repo/geo.repo.js";
import { withPagination } from "../utils/meta.utils.js";

export class GeoService {
  /*************************** LIST REGIONS ***************************/
  static async listRegions(query: ListRegionsInput) {
    const items = await GeoRepo.listRegions(query);
    return withPagination(items, query);
  }

  /*************************** LIST COUNTRIES ***************************/
  static async listCountries(query: ListCountriesInput) {
    const items = await GeoRepo.listCountries(query);
    return withPagination(items, query);
  }

  /*************************** LIST STATES ***************************/
  static async listStates(query: ListStatesInput) {
    if (!query.countryCode && !query.countryId && !query.search) {
      throw AppError.badRequest("countryCode, countryId or search is required");
    }

    const items = await GeoRepo.listStates(query);
    return withPagination(items, query);
  }

  /*************************** LIST CITIES ***************************/
  static async listCities(query: ListCitiesInput) {
    if (!query.stateId && !query.search) {
      throw AppError.badRequest("stateId or search is required");
    }

    const safeQuery =
      query.search && !query.stateId && !query.countryCode && !query.countryId
        ? { ...query, limit: Math.min(query.limit, 20) }
        : query;

    const items = await GeoRepo.listCities(safeQuery);
    return withPagination(items, safeQuery);
  }

  /*************************** LIST CURRENCIES ***************************/
  static async listCurrencies(query: ListCurrenciesInput) {
    const items = await GeoRepo.listCurrencies(query);
    return withPagination(items, query);
  }

  /*************************** LIST TIMEZONES ***************************/
  static async listTimezones(query: ListTimezonesInput) {
    const items = await GeoRepo.listTimezones(query);
    return withPagination(items, query);
  }
}
