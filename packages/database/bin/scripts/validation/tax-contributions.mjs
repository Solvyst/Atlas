import path from "node:path";

import { taxContributionsDir } from "../_shared/paths.mjs";
import { readContributionObjectOrErrors } from "../_shared/json.mjs";
import { listTaxCountryDirs } from "../_shared/tax-forms.mjs";
import { allowOnlyObjectFields, isBlank } from "../_shared/validation.mjs";

const allowedRootFields = new Set(["countryCode", "version", "name", "fields"]);
const allowedFieldFields = new Set([
  "appliesTo",
  "category",
  "code",
  "description",
  "inputType",
  "label",
  "normalization",
  "placeholder",
  "required",
  "validation",
]);
const allowedValidationFields = new Set(["pattern", "minLength", "maxLength"]);
const allowedNormalizationFields = new Set(["trim", "uppercase", "removeSpaces"]);
const allowedCategories = new Set([
  "TAX_IDENTIFIER",
  "TAX_REGISTRATION",
  "BUSINESS_IDENTIFIER",
]);
const allowedAppliesTo = new Set(["PERSON", "ORGANIZATION"]);
const allowedInputTypes = new Set(["TEXT"]);

const errors = [];

function validateValidation(label, validation) {
  if (!validation || typeof validation !== "object" || Array.isArray(validation)) {
    errors.push(label + ": validation must be an object");
    return;
  }

  allowOnlyObjectFields(
    label + ".validation",
    validation,
    allowedValidationFields,
    errors,
  );

  if (typeof validation.pattern !== "string" && validation.pattern !== null) {
    errors.push(label + ": validation.pattern must be string or null");
  }
  if (!Number.isInteger(validation.minLength) && validation.minLength !== null) {
    errors.push(label + ": validation.minLength must be integer or null");
  }
  if (!Number.isInteger(validation.maxLength) && validation.maxLength !== null) {
    errors.push(label + ": validation.maxLength must be integer or null");
  }
  if (
    Number.isInteger(validation.minLength) &&
    Number.isInteger(validation.maxLength) &&
    validation.minLength > validation.maxLength
  ) {
    errors.push(label + ": validation.minLength cannot exceed maxLength");
  }
}

function validateNormalization(label, normalization) {
  if (normalization === undefined || normalization === null) return;
  if (
    typeof normalization !== "object" ||
    Array.isArray(normalization)
  ) {
    errors.push(label + ": normalization must be an object when provided");
    return;
  }

  allowOnlyObjectFields(
    label + ".normalization",
    normalization,
    allowedNormalizationFields,
    errors,
  );

  for (const [field, value] of Object.entries(normalization)) {
    if (typeof value !== "boolean") {
      errors.push(label + ": normalization." + field + " must be boolean");
    }
  }
}

function validateField(relativePath, field, index, seenCodes) {
  const label = relativePath + ".fields[" + index + "]";

  if (!field || typeof field !== "object" || Array.isArray(field)) {
    errors.push(label + ": field must be an object");
    return;
  }

  allowOnlyObjectFields(label, field, allowedFieldFields, errors);

  // Required field keys are checked separately so null placeholders remain valid.
  for (const requiredField of [
    "code",
    "label",
    "description",
    "category",
    "appliesTo",
    "required",
    "inputType",
    "placeholder",
    "validation",
  ]) {
    if (field[requiredField] === undefined) {
      errors.push(label + ": missing " + requiredField);
    }
  }

  if (!/^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/.test(field.code ?? "")) {
    errors.push(label + ": code must be uppercase machine-readable format");
  } else if (seenCodes.has(field.code)) {
    errors.push(label + ": duplicate code " + field.code);
  } else {
    seenCodes.add(field.code);
  }

  if (isBlank(field.label)) errors.push(label + ": label is required");
  if (isBlank(field.description)) errors.push(label + ": description is required");
  if (!allowedCategories.has(field.category)) {
    errors.push(label + ": invalid category " + field.category);
  }
  if (
    !Array.isArray(field.appliesTo) ||
    field.appliesTo.length === 0 ||
    field.appliesTo.some((value) => !allowedAppliesTo.has(value))
  ) {
    errors.push(label + ": appliesTo must contain PERSON and/or ORGANIZATION");
  }
  if (typeof field.required !== "boolean") {
    errors.push(label + ": required must be boolean");
  }
  if (!allowedInputTypes.has(field.inputType)) {
    errors.push(label + ": invalid inputType " + field.inputType);
  }
  if (typeof field.placeholder !== "string" && field.placeholder !== null) {
    errors.push(label + ": placeholder must be string or null");
  }

  validateValidation(label, field.validation);
  validateNormalization(label, field.normalization);
}

const countryDirs = listTaxCountryDirs();

if (!countryDirs.length) {
  errors.push("tax: missing contributions/tax directory");
} else {
  // Validate each tax/<ISO2>/forms.json file against the contribution contract.
  for (const countryDir of countryDirs) {
    const countryCode = countryDir.name;
    const relativePath = path.join(countryCode, "forms.json");

    if (!/^[A-Z]{2}$/.test(countryCode)) {
      errors.push(countryCode + ": directory must be uppercase ISO alpha-2");
    }

    const form = readContributionObjectOrErrors(
      taxContributionsDir,
      relativePath,
      errors,
    );
    if (!form) continue;

    allowOnlyObjectFields(relativePath, form, allowedRootFields, errors);

    if (form.countryCode !== countryCode) {
      errors.push(relativePath + ": countryCode must match directory " + countryCode);
    }
    if (!Number.isInteger(form.version) || form.version <= 0) {
      errors.push(relativePath + ": version must be a positive integer");
    }
    if (form.name !== undefined && isBlank(form.name)) {
      errors.push(relativePath + ": name must be non-empty when provided");
    }
    if (!Array.isArray(form.fields)) {
      errors.push(relativePath + ": fields must be an array");
      continue;
    }

    // Field codes must be stable and unique inside each country's form.
    const seenCodes = new Set();
    form.fields.forEach((field, index) => {
      validateField(relativePath, field, index, seenCodes);
    });
  }
}

if (errors.length) {
  console.error("Tax contribution validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}

console.log("Tax contributions valid");
