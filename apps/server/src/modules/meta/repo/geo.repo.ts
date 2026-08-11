import { db } from "@solvyst-atlas/database";
import { and, asc, eq, ilike, or, type SQL } from "drizzle-orm";

import {
  metaAddressFormats,
  metaCities,
  metaAdminAreas,
  metaCountries,
  metaCurrencies,
  metaLanguages,
  metaLocales,
  metaLocalities,
  metaPhoneCodes,
  metaPhoneNumberRules,
  metaPostalCodeRules,
  metaRegions,
  metaStates,
  metaTimezones,
} from "@solvyst-atlas/database/schema";

import type {
  ListAdminAreasInput,
  ListCitiesInput,
  ListCountriesInput,
  ListCurrenciesInput,
  ListAddressFormatsInput,
  ListLanguagesInput,
  ListLocalesInput,
  ListLocalitiesInput,
  ListPhoneCodesInput,
  ListPhoneNumberRulesInput,
  ListPostalCodeRulesInput,
  ListRegionsInput,
  ListStatesInput,
  ListTimezonesInput,
} from "../dto/meta.dto.js";

function like(value: string) {
  return `%${value}%`;
}

function normalizeDialCode(value: string) {
  const trimmed = value.trim();
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

export class GeoRepo {
  /*************************** FIND COUNTRY BY GEO ***************************/
  static async findCountryByGeo(input: string) {
    const [country] = await db
      .select()
      .from(metaCountries)
      .where(
        or(
          ilike(metaCountries.name, input),
          eq(metaCountries.iso2, input.toUpperCase()),
          eq(metaCountries.iso3, input.toUpperCase()),
        ),
      )
      .limit(1);

    return country;
  }

  /*************************** LIST STATES BY COUNTRY ID ***************************/
  static async listStatesByCountryId(countryId: number) {
    return db
      .select()
      .from(metaStates)
      .where(eq(metaStates.country_id, countryId))
      .orderBy(asc(metaStates.name));
  }

  /*************************** LIST REGIONS ***************************/
  static async listRegions(input: ListRegionsInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      conditions.push(ilike(metaRegions.name, like(input.search)));
    }

    let query = db
      .select()
      .from(metaRegions)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaRegions.name))
      .offset(input.offset);

    if (input.limit) {
      query = query.limit(input.limit);
    }

    return query;
  }

  /*************************** LIST COUNTRIES ***************************/
  static async listCountries(input: ListCountriesInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(metaCountries.name, search),
          ilike(metaCountries.iso2, search),
          ilike(metaCountries.iso3, search),
          ilike(metaCountries.capital, search),
          ilike(metaCountries.currency, search),
          ilike(metaCountries.currency_name, search),
        )!,
      );
    }

    if (input.regionId)
      conditions.push(eq(metaCountries.region_id, input.regionId));
    if (input.subregionId) {
      conditions.push(eq(metaCountries.subregion_id, input.subregionId));
    }
    if (input.currency) {
      conditions.push(eq(metaCountries.currency, input.currency.toUpperCase()));
    }
    if (input.iso2)
      conditions.push(eq(metaCountries.iso2, input.iso2.toUpperCase()));
    if (input.iso3)
      conditions.push(eq(metaCountries.iso3, input.iso3.toUpperCase()));

    let query = db
      .select({
        id: metaCountries.id,
        name: metaCountries.name,
        numeric_code: metaCountries.numeric_code,
        iso2: metaCountries.iso2,
        iso3: metaCountries.iso3,
        currency: metaCountries.currency,
        currency_name: metaCountries.currency_name,
        currency_symbol: metaCountries.currency_symbol,
        region: metaCountries.region,
        emoji: metaCountries.emoji,
      })
      .from(metaCountries)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaCountries.name))
      .offset(input.offset);

    if (input.limit) {
      query = query.limit(input.limit);
    }

    return query;
  }

  /*************************** LIST STATES ***************************/
  static async listStates(input: ListStatesInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      conditions.push(ilike(metaStates.name, like(input.search)));
    }
    if (input.countryId) {
      conditions.push(eq(metaStates.country_id, input.countryId));
    }
    if (input.countryCode) {
      conditions.push(
        eq(metaStates.country_code, input.countryCode.toUpperCase()),
      );
    }
    if (input.parentId)
      conditions.push(eq(metaStates.parent_id, input.parentId));

    let query = db
      .select()
      .from(metaStates)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaStates.name))
      .offset(input.offset);

    if (input.limit) {
      query = query.limit(input.limit);
    }

    return query;
  }

  /*************************** LIST CITIES ***************************/
  static async listCities(input: ListCitiesInput) {
    const conditions: SQL[] = [];

    if (input.stateId) {
      conditions.push(eq(metaCities.state_id, input.stateId));

      if (input.search) {
        conditions.push(ilike(metaCities.name, like(input.search)));
      }

      let query = db
        .select()
        .from(metaCities)
        .$dynamic()
        .where(and(...conditions))
        .orderBy(asc(metaCities.name))
        .offset(input.offset);

      if (input.limit) {
        query = query.limit(input.limit);
      }

      return query;
    }

    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(metaCities.name, search),
          ilike(metaCities.state_name, search),
          ilike(metaCities.country_name, search),
        )!,
      );
    }

    if (input.countryId) {
      conditions.push(eq(metaCities.country_id, input.countryId));
    }
    if (input.countryCode) {
      conditions.push(
        eq(metaCities.country_code, input.countryCode.toUpperCase()),
      );
    }

    let query = db
      .select()
      .from(metaCities)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaCities.name))
      .offset(input.offset);

    if (input.limit) {
      query = query.limit(input.limit);
    }

    return query;
  }

  /*************************** LIST ADMIN AREAS ***************************/
  static async listAdminAreas(input: ListAdminAreasInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      conditions.push(ilike(metaAdminAreas.name, like(input.search)));
    }
    if (input.countryId) {
      conditions.push(eq(metaAdminAreas.country_id, input.countryId));
    }
    if (input.countryCode) {
      conditions.push(
        eq(metaAdminAreas.country_code, input.countryCode.toUpperCase()),
      );
    }
    if (input.parentId) {
      conditions.push(eq(metaAdminAreas.parent_id, input.parentId));
    }
    if (input.type) {
      conditions.push(eq(metaAdminAreas.type, input.type));
    }
    if (input.level) {
      conditions.push(eq(metaAdminAreas.level, input.level));
    }

    let query = db
      .select()
      .from(metaAdminAreas)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaAdminAreas.level), asc(metaAdminAreas.name))
      .offset(input.offset);

    if (input.limit) {
      query = query.limit(input.limit);
    }

    return query;
  }

  /*************************** LIST LOCALITIES ***************************/
  static async listLocalities(input: ListLocalitiesInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      conditions.push(ilike(metaLocalities.name, like(input.search)));
    }
    if (input.countryId) {
      conditions.push(eq(metaLocalities.country_id, input.countryId));
    }
    if (input.countryCode) {
      conditions.push(
        eq(metaLocalities.country_code, input.countryCode.toUpperCase()),
      );
    }
    if (input.adminAreaId) {
      conditions.push(eq(metaLocalities.admin_area_id, input.adminAreaId));
    }
    if (input.type) {
      conditions.push(eq(metaLocalities.type, input.type));
    }
    if (input.settlementsOnly) {
      conditions.push(eq(metaLocalities.is_settlement, 1));
    }

    let query = db
      .select()
      .from(metaLocalities)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaLocalities.name))
      .offset(input.offset);

    if (input.limit) {
      query = query.limit(input.limit);
    }

    return query;
  }

  /*************************** LIST LANGUAGES ***************************/
  static async listLanguages(input: ListLanguagesInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(metaLanguages.code, search),
          ilike(metaLanguages.name, search),
          ilike(metaLanguages.native_name, search),
        )!,
      );
    }
    if (input.code) conditions.push(eq(metaLanguages.code, input.code.toLowerCase()));
    if (input.direction) conditions.push(eq(metaLanguages.direction, input.direction));

    let query = db
      .select()
      .from(metaLanguages)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaLanguages.name))
      .offset(input.offset);

    if (input.limit) query = query.limit(input.limit);
    return query;
  }

  /*************************** LIST LOCALES ***************************/
  static async listLocales(input: ListLocalesInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(metaLocales.code, search),
          ilike(metaLocales.name, search),
          ilike(metaLocales.native_name, search),
        )!,
      );
    }
    if (input.languageCode) {
      conditions.push(eq(metaLocales.language_code, input.languageCode.toLowerCase()));
    }
    if (input.countryCode) {
      conditions.push(eq(metaLocales.country_code, input.countryCode.toUpperCase()));
    }
    if (input.currencyCode) {
      conditions.push(eq(metaLocales.currency_code, input.currencyCode.toUpperCase()));
    }
    if (input.direction) conditions.push(eq(metaLocales.direction, input.direction));

    let query = db
      .select()
      .from(metaLocales)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaLocales.code))
      .offset(input.offset);

    if (input.limit) query = query.limit(input.limit);
    return query;
  }

  /*************************** LIST POSTAL CODE RULES ***************************/
  static async listPostalCodeRules(input: ListPostalCodeRulesInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(metaPostalCodeRules.country_name, search),
          ilike(metaPostalCodeRules.country_code, search),
          ilike(metaPostalCodeRules.format, search),
        )!,
      );
    }
    if (input.countryId) conditions.push(eq(metaPostalCodeRules.country_id, input.countryId));
    if (input.countryCode) {
      conditions.push(eq(metaPostalCodeRules.country_code, input.countryCode.toUpperCase()));
    }
    if (input.requiredOnly) conditions.push(eq(metaPostalCodeRules.is_required, 1));

    let query = db
      .select()
      .from(metaPostalCodeRules)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaPostalCodeRules.country_name))
      .offset(input.offset);

    if (input.limit) query = query.limit(input.limit);
    return query;
  }

  /*************************** LIST PHONE NUMBER RULES ***************************/
  static async listPhoneNumberRules(input: ListPhoneNumberRulesInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      const normalized = normalizeDialCode(input.search);
      conditions.push(
        or(
          ilike(metaPhoneNumberRules.country_name, search),
          ilike(metaPhoneNumberRules.country_code, search),
          ilike(metaPhoneNumberRules.dial_code, like(normalized)),
        )!,
      );
    }
    if (input.countryId) conditions.push(eq(metaPhoneNumberRules.country_id, input.countryId));
    if (input.countryCode) {
      conditions.push(eq(metaPhoneNumberRules.country_code, input.countryCode.toUpperCase()));
    }
    if (input.dialCode) {
      conditions.push(eq(metaPhoneNumberRules.dial_code, normalizeDialCode(input.dialCode)));
    }

    let query = db
      .select()
      .from(metaPhoneNumberRules)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaPhoneNumberRules.dial_code), asc(metaPhoneNumberRules.country_name))
      .offset(input.offset);

    if (input.limit) query = query.limit(input.limit);
    return query;
  }

  /*************************** LIST ADDRESS FORMATS ***************************/
  static async listAddressFormats(input: ListAddressFormatsInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(metaAddressFormats.country_name, search),
          ilike(metaAddressFormats.country_code, search),
        )!,
      );
    }
    if (input.countryId) conditions.push(eq(metaAddressFormats.country_id, input.countryId));
    if (input.countryCode) {
      conditions.push(eq(metaAddressFormats.country_code, input.countryCode.toUpperCase()));
    }

    let query = db
      .select()
      .from(metaAddressFormats)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaAddressFormats.country_name))
      .offset(input.offset);

    if (input.limit) query = query.limit(input.limit);
    return query;
  }

  /*************************** LIST PHONE CODES ***************************/
  static async listPhoneCodes(input: ListPhoneCodesInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      const normalized = normalizeDialCode(input.search);
      conditions.push(
        or(
          ilike(metaPhoneCodes.country_name, search),
          ilike(metaPhoneCodes.country_code, search),
          ilike(metaPhoneCodes.phone_code, search),
          ilike(metaPhoneCodes.dial_code, like(normalized)),
          ilike(metaPhoneCodes.calling_code, like(normalized)),
        )!,
      );
    }
    if (input.countryId) {
      conditions.push(eq(metaPhoneCodes.country_id, input.countryId));
    }
    if (input.countryCode) {
      conditions.push(
        eq(metaPhoneCodes.country_code, input.countryCode.toUpperCase()),
      );
    }
    if (input.dialCode) {
      conditions.push(eq(metaPhoneCodes.dial_code, normalizeDialCode(input.dialCode)));
    }
    if (input.callingCode) {
      conditions.push(
        eq(metaPhoneCodes.calling_code, normalizeDialCode(input.callingCode)),
      );
    }

    let query = db
      .select()
      .from(metaPhoneCodes)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaPhoneCodes.calling_code), asc(metaPhoneCodes.country_name))
      .offset(input.offset);

    if (input.limit) {
      query = query.limit(input.limit);
    }

    return query;
  }

  /*************************** LIST CURRENCIES ***************************/
  static async listCurrencies(input: ListCurrenciesInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(metaCurrencies.code, search),
          ilike(metaCurrencies.name, search),
          ilike(metaCurrencies.symbol, search),
        )!,
      );
    }

    let query = db
      .select()
      .from(metaCurrencies)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaCurrencies.code))
      .offset(input.offset);

    if (input.limit) {
      query = query.limit(input.limit);
    }

    return query;
  }

  /*************************** LIST TIMEZONES ***************************/
  static async listTimezones(input: ListTimezonesInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(metaTimezones.zone_name, search),
          ilike(metaTimezones.gmt_offset_name, search),
          ilike(metaTimezones.abbreviation, search),
          ilike(metaTimezones.tz_name, search),
        )!,
      );
    }

    if (input.countryId) {
      conditions.push(eq(metaTimezones.country_id, input.countryId));
    }
    if (input.zoneName) {
      conditions.push(eq(metaTimezones.zone_name, input.zoneName));
    }

    let query = db
      .select()
      .from(metaTimezones)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(metaTimezones.country_id), asc(metaTimezones.zone_name))
      .offset(input.offset);

    if (input.limit) {
      query = query.limit(input.limit);
    }

    return query;
  }
}
