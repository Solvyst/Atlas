import { db } from "@solvyst-atlas/database";
import { and, asc, eq, ilike, or, type SQL } from "drizzle-orm";

import {
  geoAddressFormats,
  geoCities,
  geoAdminAreas,
  geoCountries,
  geoCurrencies,
  geoLanguages,
  geoLocales,
  geoLocalities,
  geoPhoneCodes,
  geoPhoneNumberRules,
  geoPostalCodeRules,
  geoRegions,
  geoStates,
  geoTimezones,
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
      .from(geoCountries)
      .where(
        or(
          ilike(geoCountries.name, input),
          eq(geoCountries.iso2, input.toUpperCase()),
          eq(geoCountries.iso3, input.toUpperCase()),
        ),
      )
      .limit(1);

    return country;
  }

  /*************************** LIST STATES BY COUNTRY ID ***************************/
  static async listStatesByCountryId(countryId: number) {
    return db
      .select()
      .from(geoStates)
      .where(eq(geoStates.country_id, countryId))
      .orderBy(asc(geoStates.name));
  }

  /*************************** LIST REGIONS ***************************/
  static async listRegions(input: ListRegionsInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      conditions.push(ilike(geoRegions.name, like(input.search)));
    }

    let query = db
      .select()
      .from(geoRegions)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoRegions.name))
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
          ilike(geoCountries.name, search),
          ilike(geoCountries.iso2, search),
          ilike(geoCountries.iso3, search),
          ilike(geoCountries.capital, search),
          ilike(geoCountries.currency, search),
          ilike(geoCountries.currency_name, search),
        )!,
      );
    }

    if (input.regionId)
      conditions.push(eq(geoCountries.region_id, input.regionId));
    if (input.subregionId) {
      conditions.push(eq(geoCountries.subregion_id, input.subregionId));
    }
    if (input.currency) {
      conditions.push(eq(geoCountries.currency, input.currency.toUpperCase()));
    }
    if (input.iso2)
      conditions.push(eq(geoCountries.iso2, input.iso2.toUpperCase()));
    if (input.iso3)
      conditions.push(eq(geoCountries.iso3, input.iso3.toUpperCase()));

    let query = db
      .select({
        id: geoCountries.id,
        name: geoCountries.name,
        numeric_code: geoCountries.numeric_code,
        iso2: geoCountries.iso2,
        iso3: geoCountries.iso3,
        currency: geoCountries.currency,
        currency_name: geoCountries.currency_name,
        currency_symbol: geoCountries.currency_symbol,
        region: geoCountries.region,
        emoji: geoCountries.emoji,
      })
      .from(geoCountries)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoCountries.name))
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
      conditions.push(ilike(geoStates.name, like(input.search)));
    }
    if (input.countryId) {
      conditions.push(eq(geoStates.country_id, input.countryId));
    }
    if (input.countryCode) {
      conditions.push(
        eq(geoStates.country_code, input.countryCode.toUpperCase()),
      );
    }
    if (input.parentId)
      conditions.push(eq(geoStates.parent_id, input.parentId));

    let query = db
      .select()
      .from(geoStates)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoStates.name))
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
      conditions.push(eq(geoCities.state_id, input.stateId));

      if (input.search) {
        conditions.push(ilike(geoCities.name, like(input.search)));
      }

      let query = db
        .select()
        .from(geoCities)
        .$dynamic()
        .where(and(...conditions))
        .orderBy(asc(geoCities.name))
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
          ilike(geoCities.name, search),
          ilike(geoCities.state_name, search),
          ilike(geoCities.country_name, search),
        )!,
      );
    }

    if (input.countryId) {
      conditions.push(eq(geoCities.country_id, input.countryId));
    }
    if (input.countryCode) {
      conditions.push(
        eq(geoCities.country_code, input.countryCode.toUpperCase()),
      );
    }

    let query = db
      .select()
      .from(geoCities)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoCities.name))
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
      conditions.push(ilike(geoAdminAreas.name, like(input.search)));
    }
    if (input.countryId) {
      conditions.push(eq(geoAdminAreas.country_id, input.countryId));
    }
    if (input.countryCode) {
      conditions.push(
        eq(geoAdminAreas.country_code, input.countryCode.toUpperCase()),
      );
    }
    if (input.parentId) {
      conditions.push(eq(geoAdminAreas.parent_id, input.parentId));
    }
    if (input.type) {
      conditions.push(eq(geoAdminAreas.type, input.type));
    }
    if (input.level) {
      conditions.push(eq(geoAdminAreas.level, input.level));
    }

    let query = db
      .select()
      .from(geoAdminAreas)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoAdminAreas.level), asc(geoAdminAreas.name))
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
      conditions.push(ilike(geoLocalities.name, like(input.search)));
    }
    if (input.countryId) {
      conditions.push(eq(geoLocalities.country_id, input.countryId));
    }
    if (input.countryCode) {
      conditions.push(
        eq(geoLocalities.country_code, input.countryCode.toUpperCase()),
      );
    }
    if (input.adminAreaId) {
      conditions.push(eq(geoLocalities.admin_area_id, input.adminAreaId));
    }
    if (input.type) {
      conditions.push(eq(geoLocalities.type, input.type));
    }
    if (input.settlementsOnly) {
      conditions.push(eq(geoLocalities.is_settlement, 1));
    }

    let query = db
      .select()
      .from(geoLocalities)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoLocalities.name))
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
          ilike(geoLanguages.code, search),
          ilike(geoLanguages.name, search),
          ilike(geoLanguages.native_name, search),
        )!,
      );
    }
    if (input.code) conditions.push(eq(geoLanguages.code, input.code.toLowerCase()));
    if (input.direction) conditions.push(eq(geoLanguages.direction, input.direction));

    let query = db
      .select()
      .from(geoLanguages)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoLanguages.name))
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
          ilike(geoLocales.code, search),
          ilike(geoLocales.name, search),
          ilike(geoLocales.native_name, search),
        )!,
      );
    }
    if (input.languageCode) {
      conditions.push(eq(geoLocales.language_code, input.languageCode.toLowerCase()));
    }
    if (input.countryCode) {
      conditions.push(eq(geoLocales.country_code, input.countryCode.toUpperCase()));
    }
    if (input.currencyCode) {
      conditions.push(eq(geoLocales.currency_code, input.currencyCode.toUpperCase()));
    }
    if (input.direction) conditions.push(eq(geoLocales.direction, input.direction));

    let query = db
      .select()
      .from(geoLocales)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoLocales.code))
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
          ilike(geoPostalCodeRules.country_name, search),
          ilike(geoPostalCodeRules.country_code, search),
          ilike(geoPostalCodeRules.format, search),
        )!,
      );
    }
    if (input.countryId) conditions.push(eq(geoPostalCodeRules.country_id, input.countryId));
    if (input.countryCode) {
      conditions.push(eq(geoPostalCodeRules.country_code, input.countryCode.toUpperCase()));
    }
    if (input.requiredOnly) conditions.push(eq(geoPostalCodeRules.is_required, 1));

    let query = db
      .select()
      .from(geoPostalCodeRules)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoPostalCodeRules.country_name))
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
          ilike(geoPhoneNumberRules.country_name, search),
          ilike(geoPhoneNumberRules.country_code, search),
          ilike(geoPhoneNumberRules.dial_code, like(normalized)),
        )!,
      );
    }
    if (input.countryId) conditions.push(eq(geoPhoneNumberRules.country_id, input.countryId));
    if (input.countryCode) {
      conditions.push(eq(geoPhoneNumberRules.country_code, input.countryCode.toUpperCase()));
    }
    if (input.dialCode) {
      conditions.push(eq(geoPhoneNumberRules.dial_code, normalizeDialCode(input.dialCode)));
    }

    let query = db
      .select()
      .from(geoPhoneNumberRules)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoPhoneNumberRules.dial_code), asc(geoPhoneNumberRules.country_name))
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
          ilike(geoAddressFormats.country_name, search),
          ilike(geoAddressFormats.country_code, search),
        )!,
      );
    }
    if (input.countryId) conditions.push(eq(geoAddressFormats.country_id, input.countryId));
    if (input.countryCode) {
      conditions.push(eq(geoAddressFormats.country_code, input.countryCode.toUpperCase()));
    }

    let query = db
      .select()
      .from(geoAddressFormats)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoAddressFormats.country_name))
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
          ilike(geoPhoneCodes.country_name, search),
          ilike(geoPhoneCodes.country_code, search),
          ilike(geoPhoneCodes.phone_code, search),
          ilike(geoPhoneCodes.dial_code, like(normalized)),
          ilike(geoPhoneCodes.calling_code, like(normalized)),
        )!,
      );
    }
    if (input.countryId) {
      conditions.push(eq(geoPhoneCodes.country_id, input.countryId));
    }
    if (input.countryCode) {
      conditions.push(
        eq(geoPhoneCodes.country_code, input.countryCode.toUpperCase()),
      );
    }
    if (input.dialCode) {
      conditions.push(eq(geoPhoneCodes.dial_code, normalizeDialCode(input.dialCode)));
    }
    if (input.callingCode) {
      conditions.push(
        eq(geoPhoneCodes.calling_code, normalizeDialCode(input.callingCode)),
      );
    }

    let query = db
      .select()
      .from(geoPhoneCodes)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoPhoneCodes.calling_code), asc(geoPhoneCodes.country_name))
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
          ilike(geoCurrencies.code, search),
          ilike(geoCurrencies.name, search),
          ilike(geoCurrencies.symbol, search),
        )!,
      );
    }

    let query = db
      .select()
      .from(geoCurrencies)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoCurrencies.code))
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
          ilike(geoTimezones.zone_name, search),
          ilike(geoTimezones.gmt_offset_name, search),
          ilike(geoTimezones.abbreviation, search),
          ilike(geoTimezones.tz_name, search),
        )!,
      );
    }

    if (input.countryId) {
      conditions.push(eq(geoTimezones.country_id, input.countryId));
    }
    if (input.zoneName) {
      conditions.push(eq(geoTimezones.zone_name, input.zoneName));
    }

    let query = db
      .select()
      .from(geoTimezones)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(geoTimezones.country_id), asc(geoTimezones.zone_name))
      .offset(input.offset);

    if (input.limit) {
      query = query.limit(input.limit);
    }

    return query;
  }
}
