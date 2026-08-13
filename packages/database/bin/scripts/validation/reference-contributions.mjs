import fs from "node:fs";
import path from "node:path";

import { referenceContributionsDir } from "../_shared/paths.mjs";
import { readJsonArray } from "../_shared/json.mjs";
import { allowOnlyFields, isBlank } from "../_shared/validation.mjs";

// Reference Validation Specs
const specs = {
  "currency-formats.json": {
    required: [
      "id",
      "country_code",
      "country_name",
      "currency_code",
      "decimal_digits",
      "symbol_position",
      "decimal_separator",
      "grouping_separator",
      "grouping_pattern",
      "example",
      "source",
    ],
    allowed: [
      "country_code",
      "country_name",
      "currency_code",
      "currency_symbol",
      "decimal_digits",
      "decimal_separator",
      "example",
      "grouping_pattern",
      "grouping_separator",
      "id",
      "negative_pattern",
      "positive_pattern",
      "source",
      "symbol_position",
      "symbol_spacing",
    ],
  },
  "phone-number-rules.json": {
    required: [
      "id",
      "country_code",
      "country_name",
      "dial_code",
      "source",
    ],
    allowed: [
      "country_code",
      "country_name",
      "dial_code",
      "emergency_numbers",
      "example_fixed_line",
      "example_mobile",
      "id",
      "international_format",
      "max_length",
      "min_length",
      "mobile_prefix_pattern",
      "national_format",
      "national_prefix",
      "source",
      "trunk_prefix",
    ],
  },
  "business-identifiers.json": {
    required: [
      "id",
      "country_code",
      "country_name",
      "code",
      "name",
      "category",
    ],
    allowed: [
      "category",
      "checksum_supported",
      "code",
      "country_code",
      "country_name",
      "example",
      "id",
      "is_required_for_business",
      "issuing_authority",
      "local_name",
      "name",
      "notes",
      "source_url",
      "validation_regex",
    ],
  },
  "banking-rules.json": {
    required: [
      "id",
      "country_code",
      "country_name",
      "iban_supported",
      "swift_supported",
      "source",
    ],
    allowed: [
      "account_number_max_length",
      "account_number_min_length",
      "country_code",
      "country_name",
      "example",
      "iban_length",
      "iban_supported",
      "id",
      "local_bank_code_label",
      "local_bank_code_regex",
      "routing_code_label",
      "routing_code_regex",
      "source",
      "swift_supported",
    ],
  },
  "date-time-formats.json": {
    required: [
      "country_code",
      "country_name",
      "date_format",
      "time_format",
      "datetime_format",
      "first_day_of_week",
      "weekend_days",
      "timezone_strategy",
      "source",
    ],
    allowed: [
      "country_code",
      "country_name",
      "date_format",
      "datetime_format",
      "default_timezone",
      "first_day_of_week",
      "source",
      "time_format",
      "timezone_strategy",
      "weekend_days",
    ],
  },
  "company-types.json": {
    required: [
      "id",
      "country_code",
      "country_name",
      "code",
      "name",
      "source",
    ],
    allowed: [
      "code",
      "country_code",
      "country_name",
      "id",
      "liability_type",
      "local_name",
      "max_owners",
      "min_owners",
      "name",
      "registration_body",
      "source",
    ],
  },
  "units.json": {
    required: [
      "id",
      "category",
      "code",
      "name",
      "system",
      "quantity_kind",
      "source",
    ],
    allowed: [
      "base_unit_code",
      "category",
      "code",
      "common_uses",
      "conversion_factor_to_base",
      "id",
      "name",
      "quantity_kind",
      "source",
      "symbol",
      "system",
    ],
  },
  "holidays.json": {
    required: [
      "id",
      "country_code",
      "country_name",
      "name",
      "type",
      "date_rule",
      "source",
    ],
    allowed: [
      "country_code",
      "country_name",
      "date_rule",
      "day",
      "effective_from",
      "effective_to",
      "id",
      "is_national",
      "local_name",
      "month",
      "name",
      "observed_rule",
      "source",
      "subdivision_code",
      "type",
    ],
  },
};

// Validation Errors
const errors = [];

// Validate Reference Files
for (const [fileName, spec] of Object.entries(specs)) {
  const filePath = path.join(referenceContributionsDir, fileName);
  if (!fs.existsSync(filePath)) {
    errors.push(fileName + ": missing file");
    continue;
  }

  let rows;
  try {
    rows = readJsonArray(filePath, fileName);
  } catch (error) {
    errors.push(fileName + ": invalid JSON - " + error.message);
    continue;
  }

  if (!Array.isArray(rows)) {
    errors.push(fileName + ": root must be a JSON array");
    continue;
  }

  allowOnlyFields(fileName, rows, spec.allowed, errors);

  const ids = new Set();
  rows.forEach((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      errors.push(fileName + "[" + index + "]: row must be an object");
      return;
    }

    for (const field of spec.required) {
      if (isBlank(row[field])) {
        errors.push(fileName + "[" + index + "]: missing " + field);
      }
    }

    const uniqueKey = row.id ?? row.country_code;
    if (!isBlank(uniqueKey)) {
      if (ids.has(uniqueKey))
        errors.push(fileName + "[" + index + "]: duplicate key " + uniqueKey);
      ids.add(uniqueKey);
    }

    if (row.country_code && !/^[A-Z]{2,3}$/.test(row.country_code)) {
      errors.push(
        fileName +
          "[" +
          index +
          "]: country_code must be uppercase ISO-like code",
      );
    }

    if (row.dial_code && !/^\+[0-9]+$/.test(row.dial_code)) {
      errors.push(fileName + "[" + index + "]: dial_code must look like +91");
    }
  });
}

// Print Validation Result
if (errors.length) {
  console.error("Reference contribution validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}

console.log("Reference contributions valid");
