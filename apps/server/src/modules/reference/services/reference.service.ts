import { withPagination } from "@/modules/meta/utils/meta.utils.js";

import type {
  ListBankingRulesInput,
  ListBusinessIdentifiersInput,
  ListCompanyTypesInput,
  ListCurrencyFormatsInput,
  ListDateTimeFormatsInput,
  ListHolidaysInput,
  ListReferencePhoneNumberRulesInput,
  ListUnitsInput,
} from "../dto/reference.dto.js";
import { ReferenceRepo } from "../repo/reference.repo.js";

const DEFAULT_LIST_LIMIT = 100;

function withDefaultLimit<T extends { limit?: number }>(
  query: T,
): T & { limit: number } {
  return { ...query, limit: query.limit ?? DEFAULT_LIST_LIMIT };
}

export class ReferenceService {
  /*************************** LIST CURRENCY FORMATS ***************************/
  static async listCurrencyFormats(query: ListCurrencyFormatsInput) {
    const pagination = withDefaultLimit(query);
    return withPagination(
      await ReferenceRepo.listCurrencyFormats(pagination),
      pagination,
    );
  }

  /*************************** LIST PHONE NUMBER RULES ***************************/
  static async listPhoneNumberRules(query: ListReferencePhoneNumberRulesInput) {
    const pagination = withDefaultLimit(query);
    return withPagination(
      await ReferenceRepo.listPhoneNumberRules(pagination),
      pagination,
    );
  }

  /*************************** LIST BUSINESS IDENTIFIERS ***************************/
  static async listBusinessIdentifiers(query: ListBusinessIdentifiersInput) {
    const pagination = withDefaultLimit(query);
    return withPagination(
      await ReferenceRepo.listBusinessIdentifiers(pagination),
      pagination,
    );
  }

  /*************************** LIST BANKING RULES ***************************/
  static async listBankingRules(query: ListBankingRulesInput) {
    const pagination = withDefaultLimit(query);
    return withPagination(
      await ReferenceRepo.listBankingRules(pagination),
      pagination,
    );
  }

  /*************************** LIST DATE-TIME FORMATS ***************************/
  static async listDateTimeFormats(query: ListDateTimeFormatsInput) {
    const pagination = withDefaultLimit(query);
    return withPagination(
      await ReferenceRepo.listDateTimeFormats(pagination),
      pagination,
    );
  }

  /*************************** LIST COMPANY TYPES ***************************/
  static async listCompanyTypes(query: ListCompanyTypesInput) {
    const pagination = withDefaultLimit(query);
    return withPagination(
      await ReferenceRepo.listCompanyTypes(pagination),
      pagination,
    );
  }

  /*************************** LIST UNITS ***************************/
  static async listUnits(query: ListUnitsInput) {
    const pagination = withDefaultLimit(query);
    return withPagination(
      await ReferenceRepo.listUnits(pagination),
      pagination,
    );
  }

  /*************************** LIST HOLIDAYS ***************************/
  static async listHolidays(query: ListHolidaysInput) {
    const pagination = withDefaultLimit(query);
    return withPagination(
      await ReferenceRepo.listHolidays(pagination),
      pagination,
    );
  }
}
