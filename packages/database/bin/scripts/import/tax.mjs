import { dataset, runDatabaseImport } from "../_shared/import-db.mjs";
import { readGeoCountriesByCode } from "../_shared/geo-countries.mjs";
import { readTaxForms } from "../_shared/tax-forms.mjs";

// Preserve every country-level form, including countries with no verified fields yet.
function buildCountryForms(forms, countriesByCode) {
  return forms.map((form) => {
    const country = countriesByCode.get(form.countryCode);
    return {
      country_code: form.countryCode,
      country_name: form.name ?? country?.name ?? form.countryCode,
      version: form.version,
      metadata: {},
    };
  });
}

// Flatten dynamic form fields into stable rows for indexed API queries.
function buildFormFields(forms) {
  return forms.flatMap((form) =>
    form.fields.map((field, index) => ({
      country_code: form.countryCode,
      code: field.code,
      label: field.label,
      description: field.description,
      category: field.category,
      applies_to: field.appliesTo,
      required: field.required ? "true" : "false",
      input_type: field.inputType,
      placeholder: field.placeholder,
      normalization: field.normalization ?? {},
      validation: field.validation,
      sort_order: index,
    })),
  );
}

const forms = readTaxForms();
const countriesByCode = readGeoCountriesByCode();

const datasets = [
  dataset("tax.country_forms", [
    "country_code",
    "country_name",
    "version",
    "metadata",
  ], buildCountryForms(forms, countriesByCode), ["country_code"]),
  dataset("tax.form_fields", [
    "country_code",
    "code",
    "label",
    "description",
    "category",
    "applies_to",
    "required",
    "input_type",
    "placeholder",
    "normalization",
    "validation",
    "sort_order",
  ], buildFormFields(forms), ["country_code", "code"]),
];

await runDatabaseImport(datasets);
