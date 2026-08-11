import { z } from "zod";

const paginationDto = z.object({
  search: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(250).optional(),
  offset: z.coerce.number().int().min(0).default(0),
});

/*************************** LIST CURRENCY FORMATS ***************************/
export const listCurrencyFormatsDto = paginationDto.extend({
  countryCode: z.string().trim().min(2).max(3).optional(),
  currencyCode: z.string().trim().length(3).optional(),
});

/*************************** LIST PHONE NUMBER RULES ***************************/
export const listReferencePhoneNumberRulesDto = paginationDto.extend({
  countryCode: z.string().trim().length(2).optional(),
  dialCode: z.string().trim().min(1).optional(),
});

/*************************** LIST BUSINESS IDENTIFIERS ***************************/
export const listBusinessIdentifiersDto = paginationDto.extend({
  countryCode: z.string().trim().length(2).optional(),
  code: z.string().trim().min(1).optional(),
  category: z.enum(["tax", "company", "compliance", "other"]).optional(),
});

/*************************** LIST BANKING RULES ***************************/
export const listBankingRulesDto = paginationDto.extend({
  countryCode: z.string().trim().length(2).optional(),
  ibanSupported: z.coerce.boolean().optional(),
});

/*************************** LIST DATE-TIME FORMATS ***************************/
export const listDateTimeFormatsDto = paginationDto.extend({
  countryCode: z.string().trim().length(2).optional(),
  timezoneStrategy: z.enum(["single", "multiple"]).optional(),
});

/*************************** LIST COMPANY TYPES ***************************/
export const listCompanyTypesDto = paginationDto.extend({
  countryCode: z.string().trim().length(2).optional(),
  code: z.string().trim().min(1).optional(),
  liabilityType: z.string().trim().min(1).optional(),
});

/*************************** LIST UNITS ***************************/
export const listUnitsDto = paginationDto.extend({
  category: z.string().trim().min(1).optional(),
  code: z.string().trim().min(1).optional(),
  system: z.string().trim().min(1).optional(),
});

/*************************** LIST HOLIDAYS ***************************/
export const listHolidaysDto = paginationDto.extend({
  countryCode: z.string().trim().length(2).optional(),
  subdivisionCode: z.string().trim().min(2).optional(),
  type: z.string().trim().min(1).optional(),
  nationalOnly: z.coerce.boolean().default(false),
});

export type ListCurrencyFormatsInput = z.infer<typeof listCurrencyFormatsDto>;
export type ListReferencePhoneNumberRulesInput = z.infer<
  typeof listReferencePhoneNumberRulesDto
>;
export type ListBusinessIdentifiersInput = z.infer<
  typeof listBusinessIdentifiersDto
>;
export type ListBankingRulesInput = z.infer<typeof listBankingRulesDto>;
export type ListDateTimeFormatsInput = z.infer<typeof listDateTimeFormatsDto>;
export type ListCompanyTypesInput = z.infer<typeof listCompanyTypesDto>;
export type ListUnitsInput = z.infer<typeof listUnitsDto>;
export type ListHolidaysInput = z.infer<typeof listHolidaysDto>;
