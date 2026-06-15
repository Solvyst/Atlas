import { db } from "@/database/kysely.js";

import type {
  ListCitiesInput,
  ListCountriesInput,
  ListCurrenciesInput,
  ListRegionsInput,
  ListStatesInput,
  ListTimezonesInput,
} from "../dto/meta.dto.js";

function like(value: string) {
  return `%${value}%`;
}

export class GeoRepo {
  /*************************** LIST REGIONS ***************************/
  static async listRegions(input: ListRegionsInput) {
    let query = db.selectFrom("meta.regions").selectAll();

    if (input.search) {
      query = query.where("name", "ilike", like(input.search));
    }

    return query
      .orderBy("name", "asc")
      .limit(input.limit)
      .offset(input.offset)
      .execute();
  }

  /*************************** LIST COUNTRIES ***************************/
  static async listCountries(input: ListCountriesInput) {
    let query = db.selectFrom("meta.countries").selectAll();

    if (input.search) {
      const search = like(input.search);
      query = query.where((eb) =>
        eb.or([
          eb("name", "ilike", search),
          eb("iso2", "ilike", search),
          eb("iso3", "ilike", search),
          eb("capital", "ilike", search),
          eb("currency", "ilike", search),
          eb("currency_name", "ilike", search),
        ]),
      );
    }

    if (input.regionId) query = query.where("region_id", "=", input.regionId);
    if (input.subregionId) {
      query = query.where("subregion_id", "=", input.subregionId);
    }
    if (input.currency) {
      query = query.where("currency", "=", input.currency.toUpperCase());
    }
    if (input.iso2) query = query.where("iso2", "=", input.iso2.toUpperCase());
    if (input.iso3) query = query.where("iso3", "=", input.iso3.toUpperCase());

    return query
      .orderBy("name", "asc")
      .limit(input.limit)
      .offset(input.offset)
      .execute();
  }

  /*************************** LIST STATES ***************************/
  static async listStates(input: ListStatesInput) {
    let query = db.selectFrom("meta.states").selectAll();

    if (input.search) {
      query = query.where("name", "ilike", like(input.search));
    }
    if (input.countryId) {
      query = query.where("country_id", "=", input.countryId);
    }
    if (input.countryCode) {
      query = query.where("country_code", "=", input.countryCode.toUpperCase());
    }
    if (input.parentId) query = query.where("parent_id", "=", input.parentId);

    return query
      .orderBy("name", "asc")
      .limit(input.limit)
      .offset(input.offset)
      .execute();
  }

  /*************************** LIST CITIES ***************************/
  static async listCities(input: ListCitiesInput) {
    let query = db.selectFrom("meta.cities").selectAll();

    if (input.stateId) {
      query = query.where("state_id", "=", input.stateId);

      if (input.search) {
        query = query.where("name", "ilike", like(input.search));
      }

      return query
        .orderBy("name", "asc")
        .limit(input.limit)
        .offset(input.offset)
        .execute();
    }

    if (input.search) {
      const search = like(input.search);
      query = query.where((eb) =>
        eb.or([
          eb("name", "ilike", search),
          eb("state_name", "ilike", search),
          eb("country_name", "ilike", search),
        ]),
      );
    }

    if (input.countryId) {
      query = query.where("country_id", "=", input.countryId);
    }
    if (input.countryCode) {
      query = query.where("country_code", "=", input.countryCode.toUpperCase());
    }

    return query
      .orderBy("name", "asc")
      .limit(input.limit)
      .offset(input.offset)
      .execute();
  }

  /*************************** LIST CURRENCIES ***************************/
  static async listCurrencies(input: ListCurrenciesInput) {
    let query = db.selectFrom("meta.currencies").selectAll();

    if (input.search) {
      const search = like(input.search);
      query = query.where((eb) =>
        eb.or([
          eb("code", "ilike", search),
          eb("name", "ilike", search),
          eb("symbol", "ilike", search),
        ]),
      );
    }

    return query
      .orderBy("code", "asc")
      .limit(input.limit)
      .offset(input.offset)
      .execute();
  }

  /*************************** LIST TIMEZONES ***************************/
  static async listTimezones(input: ListTimezonesInput) {
    let query = db.selectFrom("meta.timezones").selectAll();

    if (input.search) {
      const search = like(input.search);
      query = query.where((eb) =>
        eb.or([
          eb("zone_name", "ilike", search),
          eb("gmt_offset_name", "ilike", search),
          eb("abbreviation", "ilike", search),
          eb("tz_name", "ilike", search),
        ]),
      );
    }

    if (input.countryId) {
      query = query.where("country_id", "=", input.countryId);
    }
    if (input.zoneName) {
      query = query.where("zone_name", "=", input.zoneName);
    }

    return query
      .orderBy("country_id", "asc")
      .orderBy("zone_name", "asc")
      .limit(input.limit)
      .offset(input.offset)
      .execute();
  }
}
