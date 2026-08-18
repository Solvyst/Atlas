import { index, integer, jsonb, pgSchema, text } from "drizzle-orm/pg-core";

import type { JsonObject } from "./geo.js";

// Reference Schema
export const referenceSchema = pgSchema("reference");

// Address Formats Table
export const referenceAddressFormats = referenceSchema.table(
  "address_formats",
  {
    country_id: integer("country_id").primaryKey(),
    country_code: text("country_code").notNull(),
    country_name: text("country_name").notNull(),
    format: jsonb("format").$type<JsonObject>().notNull(),
    required_fields: jsonb("required_fields").$type<string[]>().notNull(),
    administrative_area_label: text("administrative_area_label"),
    locality_label: text("locality_label"),
    postal_code_label: text("postal_code_label"),
    source: text("source").notNull(),
  },
  (table) => [
    index("reference_address_formats_country_code_idx").on(table.country_code),
  ],
);

// Reference Select And Insert Types
export type ReferenceAddressFormat =
  typeof referenceAddressFormats.$inferSelect;
export type NewReferenceAddressFormat =
  typeof referenceAddressFormats.$inferInsert;
