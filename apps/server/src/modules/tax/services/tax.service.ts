import { AppError } from "@/lib/AppError.js";
import { withPagination } from "@/modules/meta/utils/meta.utils.js";

import type {
  GetTaxCountryFormInput,
  ListTaxCountryFormsInput,
} from "../dto/tax.dto.js";
import { TaxRepo } from "../repo/tax.repo.js";

const DEFAULT_LIST_LIMIT = 100;

function withDefaultLimit<T extends { limit?: number }>(
  query: T,
): T & { limit: number } {
  return { ...query, limit: query.limit ?? DEFAULT_LIST_LIMIT };
}

function mapField(
  field: Awaited<ReturnType<typeof TaxRepo.listFormFieldsByCountry>>[number],
) {
  return {
    code: field.code,
    label: field.label,
    description: field.description,
    category: field.category,
    appliesTo: field.applies_to,
    required: field.required,
    inputType: field.input_type,
    placeholder: field.placeholder,
    normalization: field.normalization,
    validation: field.validation,
    sortOrder: field.sort_order,
  };
}

export class TaxService {
  /*************************** LIST TAX COUNTRY FORMS ***************************/
  static async listCountryForms(query: ListTaxCountryFormsInput) {
    const pagination = withDefaultLimit(query);
    return withPagination(
      await TaxRepo.listCountryForms(pagination),
      pagination,
    );
  }

  /*************************** GET TAX COUNTRY FORM ***************************/
  static async getCountryForm(query: GetTaxCountryFormInput) {
    const form = await TaxRepo.findCountryForm(query);
    if (!form) {
      throw AppError.notFound("Tax country form not found");
    }

    const fields = await TaxRepo.listFormFieldsByCountry(form.country_code);

    return {
      countryCode: form.country_code,
      name: form.country_name,
      version: form.version,
      metadata: form.metadata,
      fields: fields.map(mapField),
    };
  }

}
