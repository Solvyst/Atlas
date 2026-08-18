import { ReferenceRepo } from "../repo/reference.repo.js";

import type { ListAddressFormatsInput } from "../dto/reference.dto.js";

const DEFAULT_LIST_LIMIT = 100;

function withDefaultLimit<T extends { limit?: number }>(
  query: T,
): T & { limit: number } {
  return {
    ...query,
    limit: query.limit ?? DEFAULT_LIST_LIMIT,
  };
}

function withPagination<T>(
  items: T[],
  query: { limit: number; offset: number },
) {
  return {
    items,
    page: {
      limit: query.limit,
      offset: query.offset,
      returned: items.length,
    },
  };
}

export class ReferenceService {
  /*************************** LIST ADDRESS FORMATS ***************************/
  static async listAddressFormats(query: ListAddressFormatsInput) {
    const pagination = withDefaultLimit(query);
    const items = await ReferenceRepo.listAddressFormats(pagination);
    return withPagination(items, pagination);
  }
}
