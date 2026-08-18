import { db } from "@solvyst-atlas/database";
import { and, asc, eq, ilike, or, type SQL } from "drizzle-orm";

import { taxCountryForms, taxFormFields } from "@solvyst-atlas/database/schema";

import type {
  GetTaxCountryFormInput,
  ListTaxCountryFormsInput,
} from "../dto/tax.dto.js";

function like(value: string) {
  return `%${value}%`;
}

function applyLimit<T extends { limit: (value: number) => T }>(
  query: T,
  limit?: number,
) {
  return limit ? query.limit(limit) : query;
}

export class TaxRepo {
  /*************************** LIST TAX COUNTRY FORMS ***************************/
  static async listCountryForms(input: ListTaxCountryFormsInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(taxCountryForms.country_code, search),
          ilike(taxCountryForms.country_name, search),
        )!,
      );
    }
    if (input.countryCode) {
      conditions.push(
        eq(taxCountryForms.country_code, input.countryCode.toUpperCase()),
      );
    }

    const query = db
      .select()
      .from(taxCountryForms)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(taxCountryForms.country_name))
      .offset(input.offset);

    return applyLimit(query, input.limit);
  }

  /*************************** FIND TAX COUNTRY FORM ***************************/
  static async findCountryForm(input: GetTaxCountryFormInput) {
    const [form] = await db
      .select()
      .from(taxCountryForms)
      .where(eq(taxCountryForms.country_code, input.countryCode.toUpperCase()))
      .limit(1);

    return form;
  }

  /*************************** LIST TAX FORM FIELDS BY COUNTRY ***************************/
  static async listFormFieldsByCountry(countryCode: string) {
    return db
      .select()
      .from(taxFormFields)
      .where(eq(taxFormFields.country_code, countryCode.toUpperCase()))
      .orderBy(asc(taxFormFields.sort_order), asc(taxFormFields.code));
  }
}
