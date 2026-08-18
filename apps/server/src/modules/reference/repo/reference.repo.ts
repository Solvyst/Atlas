import { db } from "@solvyst-atlas/database";
import { and, asc, eq, ilike, or, type SQL } from "drizzle-orm";

import { referenceAddressFormats } from "@solvyst-atlas/database/schema";

import type { ListAddressFormatsInput } from "../dto/reference.dto.js";

function like(value: string) {
  return `%${value}%`;
}

export class ReferenceRepo {
  /*************************** LIST ADDRESS FORMATS ***************************/
  static async listAddressFormats(input: ListAddressFormatsInput) {
    const conditions: SQL[] = [];

    if (input.search) {
      const search = like(input.search);
      conditions.push(
        or(
          ilike(referenceAddressFormats.country_name, search),
          ilike(referenceAddressFormats.country_code, search),
        )!,
      );
    }

    if (input.countryId) {
      conditions.push(eq(referenceAddressFormats.country_id, input.countryId));
    }

    if (input.countryCode) {
      conditions.push(
        eq(
          referenceAddressFormats.country_code,
          input.countryCode.toUpperCase(),
        ),
      );
    }

    let query = db
      .select()
      .from(referenceAddressFormats)
      .$dynamic()
      .where(and(...conditions))
      .orderBy(asc(referenceAddressFormats.country_name))
      .offset(input.offset);

    if (input.limit) query = query.limit(input.limit);
    return query;
  }
}
