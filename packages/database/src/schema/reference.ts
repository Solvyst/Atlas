import {
  doublePrecision,
  index,
  uniqueIndex,
  integer,
  jsonb,
  pgSchema,
  text,
} from "drizzle-orm/pg-core";

import type { JsonObject } from "./geo.js";

export const referenceSchema = pgSchema("reference");

export const referenceCurrencyFormats = referenceSchema.table(
  "currency_formats",
  {
    id: text("id").primaryKey(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    currency_code: text("currency_code").notNull(),
    currency_symbol: text("currency_symbol"),
    decimal_digits: integer("decimal_digits").notNull(),
    symbol_position: text("symbol_position").notNull(),
    symbol_spacing: integer("symbol_spacing").notNull().default(0),
    decimal_separator: text("decimal_separator").notNull(),
    grouping_separator: text("grouping_separator").notNull(),
    grouping_pattern: text("grouping_pattern").notNull(),
    positive_pattern: text("positive_pattern").notNull(),
    negative_pattern: text("negative_pattern").notNull(),
    example: text("example").notNull(),
    source: text("source").notNull(),
  },
  (table) => [
    index("reference_currency_formats_country_idx").on(table.country_code),
    index("reference_currency_formats_currency_idx").on(table.currency_code),
  ],
);

export const referencePhoneNumberRules = referenceSchema.table(
  "phone_number_rules",
  {
    id: text("id").primaryKey(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    dial_code: text("dial_code").notNull(),
    national_prefix: text("national_prefix"),
    trunk_prefix: text("trunk_prefix"),
    min_length: integer("min_length"),
    max_length: integer("max_length"),
    mobile_prefix_pattern: text("mobile_prefix_pattern"),
    national_format: text("national_format"),
    international_format: text("international_format"),
    example_mobile: text("example_mobile"),
    example_fixed_line: text("example_fixed_line"),
    emergency_numbers: jsonb("emergency_numbers").$type<JsonObject>(),
    source: text("source").notNull(),
  },
  (table) => [
    index("reference_phone_rules_country_idx").on(table.country_code),
    index("reference_phone_rules_dial_idx").on(table.dial_code),
  ],
);

export const referenceBusinessIdentifiers = referenceSchema.table(
  "business_identifiers",
  {
    id: text("id").primaryKey(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    local_name: text("local_name"),
    category: text("category").notNull(),
    issuing_authority: text("issuing_authority"),
    validation_regex: text("validation_regex"),
    example: text("example"),
    checksum_supported: integer("checksum_supported").notNull().default(0),
    is_required_for_business: integer("is_required_for_business").notNull().default(0),
    source_url: text("source_url"),
    notes: text("notes"),
  },
  (table) => [
    uniqueIndex("reference_business_identifiers_country_code_unique").on(
      table.country_code,
      table.code,
    ),
    index("reference_business_identifiers_country_idx").on(table.country_code),
    index("reference_business_identifiers_code_idx").on(table.code),
    index("reference_business_identifiers_category_idx").on(table.category),
  ],
);

export const referenceBankingRules = referenceSchema.table(
  "banking_rules",
  {
    id: text("id").primaryKey(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    iban_supported: integer("iban_supported").notNull().default(0),
    iban_length: integer("iban_length"),
    swift_supported: integer("swift_supported").notNull().default(1),
    local_bank_code_label: text("local_bank_code_label"),
    local_bank_code_regex: text("local_bank_code_regex"),
    routing_code_label: text("routing_code_label"),
    routing_code_regex: text("routing_code_regex"),
    account_number_min_length: integer("account_number_min_length"),
    account_number_max_length: integer("account_number_max_length"),
    example: jsonb("example").$type<JsonObject>(),
    source: text("source").notNull(),
  },
  (table) => [index("reference_banking_rules_country_idx").on(table.country_code)],
);

export const referenceDateTimeFormats = referenceSchema.table(
  "date_time_formats",
  {
    country_code: text("country_code").primaryKey(),
    country_name: text("country_name").notNull(),
    date_format: text("date_format").notNull(),
    time_format: text("time_format").notNull(),
    datetime_format: text("datetime_format").notNull(),
    first_day_of_week: integer("first_day_of_week").notNull(),
    weekend_days: jsonb("weekend_days").$type<string[]>().notNull(),
    default_timezone: text("default_timezone"),
    timezone_strategy: text("timezone_strategy").notNull(),
    source: text("source").notNull(),
  },
  (table) => [index("reference_date_time_formats_country_idx").on(table.country_code)],
);

export const referenceCompanyTypes = referenceSchema.table(
  "company_types",
  {
    id: text("id").primaryKey(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    local_name: text("local_name"),
    liability_type: text("liability_type"),
    registration_body: text("registration_body"),
    min_owners: integer("min_owners"),
    max_owners: integer("max_owners"),
    source: text("source").notNull(),
  },
  (table) => [
    uniqueIndex("reference_company_types_country_code_unique").on(
      table.country_code,
      table.code,
    ),
    index("reference_company_types_country_idx").on(table.country_code),
    index("reference_company_types_code_idx").on(table.code),
  ],
);

export const referenceUnits = referenceSchema.table(
  "units",
  {
    id: text("id").primaryKey(),
    category: text("category").notNull(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    symbol: text("symbol"),
    system: text("system").notNull(),
    quantity_kind: text("quantity_kind").notNull(),
    base_unit_code: text("base_unit_code"),
    conversion_factor_to_base: doublePrecision("conversion_factor_to_base"),
    common_uses: jsonb("common_uses").$type<string[]>(),
    source: text("source").notNull(),
  },
  (table) => [
    uniqueIndex("reference_units_code_unique").on(table.code),
    index("reference_units_category_idx").on(table.category),
    index("reference_units_code_idx").on(table.code),
  ],
);

export const referenceHolidays = referenceSchema.table(
  "holidays",
  {
    id: text("id").primaryKey(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    subdivision_code: text("subdivision_code"),
    name: text("name").notNull(),
    local_name: text("local_name"),
    type: text("type").notNull(),
    date_rule: text("date_rule").notNull(),
    month: integer("month"),
    day: integer("day"),
    observed_rule: text("observed_rule"),
    is_national: integer("is_national").notNull().default(1),
    effective_from: text("effective_from"),
    effective_to: text("effective_to"),
    source: text("source").notNull(),
  },
  (table) => [
    index("reference_holidays_country_idx").on(table.country_code),
    index("reference_holidays_type_idx").on(table.type),
  ],
);

export type ReferenceCurrencyFormat = typeof referenceCurrencyFormats.$inferSelect;
export type NewReferenceCurrencyFormat = typeof referenceCurrencyFormats.$inferInsert;
export type ReferencePhoneNumberRule = typeof referencePhoneNumberRules.$inferSelect;
export type NewReferencePhoneNumberRule = typeof referencePhoneNumberRules.$inferInsert;
export type ReferenceBusinessIdentifier = typeof referenceBusinessIdentifiers.$inferSelect;
export type NewReferenceBusinessIdentifier = typeof referenceBusinessIdentifiers.$inferInsert;
export type ReferenceBankingRule = typeof referenceBankingRules.$inferSelect;
export type NewReferenceBankingRule = typeof referenceBankingRules.$inferInsert;
export type ReferenceDateTimeFormat = typeof referenceDateTimeFormats.$inferSelect;
export type NewReferenceDateTimeFormat = typeof referenceDateTimeFormats.$inferInsert;
export type ReferenceCompanyType = typeof referenceCompanyTypes.$inferSelect;
export type NewReferenceCompanyType = typeof referenceCompanyTypes.$inferInsert;
export type ReferenceUnit = typeof referenceUnits.$inferSelect;
export type NewReferenceUnit = typeof referenceUnits.$inferInsert;
export type ReferenceHoliday = typeof referenceHolidays.$inferSelect;
export type NewReferenceHoliday = typeof referenceHolidays.$inferInsert;
