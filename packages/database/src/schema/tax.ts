import {
  boolean,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import type { JsonObject } from "./geo.js";

// TYPES
export type TaxEntityType = "PERSON" | "ORGANIZATION";

export type TaxFieldCategory =
  | "TAX_IDENTIFIER"
  | "TAX_REGISTRATION"
  | "BUSINESS_IDENTIFIER";

export type TaxInputType = "TEXT";

export type TaxFieldValidation = {
  pattern: string | null;
  minLength: number | null;
  maxLength: number | null;
};

export type TaxFieldNormalization = {
  trim?: boolean;
  uppercase?: boolean;
  removeSpaces?: boolean;
};

// TAX SCHEMA
export const taxSchema = pgSchema("tax");

/*************************** COUNTRY FORMS ***************************/
export const taxCountryForms = taxSchema.table(
  "country_forms",
  {
    country_code: text("country_code").primaryKey(),

    country_name: text("country_name").notNull(),

    version: integer("version").notNull(),

    metadata: jsonb("metadata").$type<JsonObject>().notNull().default({}),
  },
  (table) => [index("tax_country_forms_version_idx").on(table.version)],
);

/*************************** FORM FIELDS ***************************/
export const taxFormFields = taxSchema.table(
  "form_fields",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    country_code: text("country_code")
      .notNull()
      .references(() => taxCountryForms.country_code, {
        onDelete: "cascade",
      }),

    code: text("code").notNull(),

    label: text("label").notNull(),

    description: text("description").notNull(),

    category: text("category").$type<TaxFieldCategory>().notNull(),

    applies_to: jsonb("applies_to").$type<TaxEntityType[]>().notNull(),

    required: boolean("required").notNull().default(false),

    input_type: text("input_type").$type<TaxInputType>().notNull(),

    placeholder: text("placeholder"),

    normalization: jsonb("normalization")
      .$type<TaxFieldNormalization>()
      .notNull()
      .default({}),

    validation: jsonb("validation").$type<TaxFieldValidation>().notNull(),

    sort_order: integer("sort_order").notNull().default(0),
  },
  (table) => [
    uniqueIndex("tax_form_fields_country_code_unique").on(
      table.country_code,
      table.code,
    ),

    index("tax_form_fields_country_idx").on(table.country_code),

    index("tax_form_fields_code_idx").on(table.code),

    index("tax_form_fields_category_idx").on(table.category),
  ],
);

/*************************** TYPES ***************************/
export type TaxCountryForm = typeof taxCountryForms.$inferSelect;
export type NewTaxCountryForm = typeof taxCountryForms.$inferInsert;

export type TaxFormField = typeof taxFormFields.$inferSelect;
export type NewTaxFormField = typeof taxFormFields.$inferInsert;
