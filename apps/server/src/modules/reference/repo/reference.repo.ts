import { db } from "@solvyst-atlas/database";
import { and, asc, eq, ilike, or, type SQL } from "drizzle-orm";

import {
  referenceBankingRules,
  referenceBusinessIdentifiers,
  referenceCompanyTypes,
  referenceCurrencyFormats,
  referenceDateTimeFormats,
  referenceHolidays,
  referencePhoneNumberRules,
  referenceUnits,
} from "@solvyst-atlas/database/schema";

import type {
  ListBankingRulesInput,
  ListBusinessIdentifiersInput,
  ListCompanyTypesInput,
  ListCurrencyFormatsInput,
  ListDateTimeFormatsInput,
  ListHolidaysInput,
  ListReferencePhoneNumberRulesInput,
  ListUnitsInput,
} from "../dto/reference.dto.js";

function like(value: string) {
  return `%${value}%`;
}

function normalizeDialCode(value: string) {
  const trimmed = value.trim();
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

function applyLimit<T extends { limit: (value: number) => T }>(
  query: T,
  limit?: number,
) {
  return limit ? query.limit(limit) : query;
}

export class ReferenceRepo {
  /*************************** LIST CURRENCY FORMATS ***************************/
  static async listCurrencyFormats(input: ListCurrencyFormatsInput) {
    const conditions: SQL[] = [];
    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(referenceCurrencyFormats.country_name, search),
          ilike(referenceCurrencyFormats.country_code, search),
          ilike(referenceCurrencyFormats.currency_code, search),
          ilike(referenceCurrencyFormats.currency_symbol, search),
        )!,
      );
    }
    if (input.countryCode) {
      conditions.push(
        eq(
          referenceCurrencyFormats.country_code,
          input.countryCode.toUpperCase(),
        ),
      );
    }
    if (input.currencyCode) {
      conditions.push(
        eq(
          referenceCurrencyFormats.currency_code,
          input.currencyCode.toUpperCase(),
        ),
      );
    }

    const query = db
      .select()
      .from(referenceCurrencyFormats)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(referenceCurrencyFormats.country_name))
      .offset(input.offset);
    return applyLimit(query, input.limit);
  }

  /*************************** LIST PHONE NUMBER RULES ***************************/
  static async listPhoneNumberRules(input: ListReferencePhoneNumberRulesInput) {
    const conditions: SQL[] = [];
    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(referencePhoneNumberRules.country_name, search),
          ilike(referencePhoneNumberRules.country_code, search),
          ilike(
            referencePhoneNumberRules.dial_code,
            like(normalizeDialCode(input.search)),
          ),
        )!,
      );
    }
    if (input.countryCode)
      conditions.push(
        eq(
          referencePhoneNumberRules.country_code,
          input.countryCode.toUpperCase(),
        ),
      );
    if (input.dialCode)
      conditions.push(
        eq(
          referencePhoneNumberRules.dial_code,
          normalizeDialCode(input.dialCode),
        ),
      );

    const query = db
      .select()
      .from(referencePhoneNumberRules)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(referencePhoneNumberRules.country_name))
      .offset(input.offset);
    return applyLimit(query, input.limit);
  }

  /*************************** LIST BUSINESS IDENTIFIERS ***************************/
  static async listBusinessIdentifiers(input: ListBusinessIdentifiersInput) {
    const conditions: SQL[] = [];
    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(referenceBusinessIdentifiers.country_name, search),
          ilike(referenceBusinessIdentifiers.code, search),
          ilike(referenceBusinessIdentifiers.name, search),
          ilike(referenceBusinessIdentifiers.issuing_authority, search),
        )!,
      );
    }
    if (input.countryCode)
      conditions.push(
        eq(
          referenceBusinessIdentifiers.country_code,
          input.countryCode.toUpperCase(),
        ),
      );
    if (input.code)
      conditions.push(
        eq(referenceBusinessIdentifiers.code, input.code.toUpperCase()),
      );
    if (input.category)
      conditions.push(
        eq(referenceBusinessIdentifiers.category, input.category),
      );

    const query = db
      .select()
      .from(referenceBusinessIdentifiers)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(
        asc(referenceBusinessIdentifiers.country_code),
        asc(referenceBusinessIdentifiers.code),
      )
      .offset(input.offset);
    return applyLimit(query, input.limit);
  }

  /*************************** LIST BANKING RULES ***************************/
  static async listBankingRules(input: ListBankingRulesInput) {
    const conditions: SQL[] = [];
    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(referenceBankingRules.country_name, search),
          ilike(referenceBankingRules.country_code, search),
          ilike(referenceBankingRules.local_bank_code_label, search),
          ilike(referenceBankingRules.routing_code_label, search),
        )!,
      );
    }
    if (input.countryCode)
      conditions.push(
        eq(referenceBankingRules.country_code, input.countryCode.toUpperCase()),
      );
    if (input.ibanSupported !== undefined)
      conditions.push(
        eq(referenceBankingRules.iban_supported, input.ibanSupported ? 1 : 0),
      );

    const query = db
      .select()
      .from(referenceBankingRules)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(referenceBankingRules.country_name))
      .offset(input.offset);
    return applyLimit(query, input.limit);
  }

  /*************************** LIST DATE-TIME FORMATS ***************************/
  static async listDateTimeFormats(input: ListDateTimeFormatsInput) {
    const conditions: SQL[] = [];
    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(referenceDateTimeFormats.country_name, search),
          ilike(referenceDateTimeFormats.country_code, search),
          ilike(referenceDateTimeFormats.default_timezone, search),
        )!,
      );
    }
    if (input.countryCode)
      conditions.push(
        eq(
          referenceDateTimeFormats.country_code,
          input.countryCode.toUpperCase(),
        ),
      );
    if (input.timezoneStrategy)
      conditions.push(
        eq(referenceDateTimeFormats.timezone_strategy, input.timezoneStrategy),
      );

    const query = db
      .select()
      .from(referenceDateTimeFormats)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(referenceDateTimeFormats.country_name))
      .offset(input.offset);
    return applyLimit(query, input.limit);
  }

  /*************************** LIST COMPANY TYPES ***************************/
  static async listCompanyTypes(input: ListCompanyTypesInput) {
    const conditions: SQL[] = [];
    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(referenceCompanyTypes.country_name, search),
          ilike(referenceCompanyTypes.code, search),
          ilike(referenceCompanyTypes.name, search),
          ilike(referenceCompanyTypes.registration_body, search),
        )!,
      );
    }
    if (input.countryCode)
      conditions.push(
        eq(referenceCompanyTypes.country_code, input.countryCode.toUpperCase()),
      );
    if (input.code)
      conditions.push(eq(referenceCompanyTypes.code, input.code.toUpperCase()));
    if (input.liabilityType)
      conditions.push(
        eq(referenceCompanyTypes.liability_type, input.liabilityType),
      );

    const query = db
      .select()
      .from(referenceCompanyTypes)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(
        asc(referenceCompanyTypes.country_code),
        asc(referenceCompanyTypes.name),
      )
      .offset(input.offset);
    return applyLimit(query, input.limit);
  }

  /*************************** LIST UNITS ***************************/
  static async listUnits(input: ListUnitsInput) {
    const conditions: SQL[] = [];
    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(referenceUnits.code, search),
          ilike(referenceUnits.name, search),
          ilike(referenceUnits.symbol, search),
          ilike(referenceUnits.quantity_kind, search),
        )!,
      );
    }
    if (input.category)
      conditions.push(eq(referenceUnits.category, input.category));
    if (input.code) conditions.push(eq(referenceUnits.code, input.code));
    if (input.system) conditions.push(eq(referenceUnits.system, input.system));

    const query = db
      .select()
      .from(referenceUnits)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(referenceUnits.category), asc(referenceUnits.code))
      .offset(input.offset);
    return applyLimit(query, input.limit);
  }

  /*************************** LIST HOLIDAYS ***************************/
  static async listHolidays(input: ListHolidaysInput) {
    const conditions: SQL[] = [];
    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(referenceHolidays.country_name, search),
          ilike(referenceHolidays.country_code, search),
          ilike(referenceHolidays.name, search),
        )!,
      );
    }
    if (input.countryCode)
      conditions.push(
        eq(referenceHolidays.country_code, input.countryCode.toUpperCase()),
      );
    if (input.subdivisionCode)
      conditions.push(
        eq(
          referenceHolidays.subdivision_code,
          input.subdivisionCode.toUpperCase(),
        ),
      );
    if (input.type) conditions.push(eq(referenceHolidays.type, input.type));
    if (input.nationalOnly)
      conditions.push(eq(referenceHolidays.is_national, 1));

    const query = db
      .select()
      .from(referenceHolidays)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(
        asc(referenceHolidays.country_code),
        asc(referenceHolidays.month),
        asc(referenceHolidays.day),
        asc(referenceHolidays.name),
      )
      .offset(input.offset);
    return applyLimit(query, input.limit);
  }
}
