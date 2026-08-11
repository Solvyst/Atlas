import { z } from "zod";

const paginationDto = z.object({
  search: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(250).optional(),
  offset: z.coerce.number().int().min(0).default(0),
});

/*************************** LIST REGIONS ***************************/
export const listRegionsDto = paginationDto;

/*************************** LIST COUNTRIES ***************************/
export const listCountriesDto = paginationDto.extend({
  regionId: z.coerce.number().int().positive().optional(),
  subregionId: z.coerce.number().int().positive().optional(),
  currency: z.string().trim().min(1).optional(),
  iso2: z.string().trim().length(2).optional(),
  iso3: z.string().trim().length(3).optional(),
});

/*************************** LIST STATES ***************************/
export const listStatesDto = paginationDto.extend({
  countryId: z.coerce.number().int().positive().optional(),
  countryCode: z.string().trim().length(2).optional(),
  parentId: z.coerce.number().int().positive().optional(),
});

/*************************** LIST CITIES ***************************/
export const listCitiesDto = paginationDto.extend({
  countryId: z.coerce.number().int().positive().optional(),
  stateId: z.coerce.number().int().positive().optional(),
  countryCode: z.string().trim().length(2).optional(),
});

/*************************** LIST ADMIN AREAS ***************************/
export const listAdminAreasDto = paginationDto.extend({
  countryId: z.coerce.number().int().positive().optional(),
  countryCode: z.string().trim().length(2).optional(),
  parentId: z.coerce.number().int().positive().optional(),
  type: z.string().trim().min(1).optional(),
  level: z.coerce.number().int().min(1).optional(),
});

/*************************** LIST LOCALITIES ***************************/
export const listLocalitiesDto = paginationDto.extend({
  countryId: z.coerce.number().int().positive().optional(),
  countryCode: z.string().trim().length(2).optional(),
  adminAreaId: z.coerce.number().int().positive().optional(),
  type: z.string().trim().min(1).optional(),
  settlementsOnly: z.coerce.boolean().default(true),
});

/*************************** LIST LANGUAGES ***************************/
export const listLanguagesDto = paginationDto.extend({
  code: z.string().trim().min(2).max(3).optional(),
  direction: z.enum(["ltr", "rtl"]).optional(),
});

/*************************** LIST LOCALES ***************************/
export const listLocalesDto = paginationDto.extend({
  languageCode: z.string().trim().min(2).max(3).optional(),
  countryCode: z.string().trim().length(2).optional(),
  currencyCode: z.string().trim().length(3).optional(),
  direction: z.enum(["ltr", "rtl"]).optional(),
});

/*************************** LIST POSTAL CODE RULES ***************************/
export const listPostalCodeRulesDto = paginationDto.extend({
  countryId: z.coerce.number().int().positive().optional(),
  countryCode: z.string().trim().length(2).optional(),
  requiredOnly: z.coerce.boolean().default(false),
});

/*************************** LIST PHONE NUMBER RULES ***************************/
export const listPhoneNumberRulesDto = paginationDto.extend({
  countryId: z.coerce.number().int().positive().optional(),
  countryCode: z.string().trim().length(2).optional(),
  dialCode: z.string().trim().min(1).optional(),
});

/*************************** LIST ADDRESS FORMATS ***************************/
export const listAddressFormatsDto = paginationDto.extend({
  countryId: z.coerce.number().int().positive().optional(),
  countryCode: z.string().trim().length(2).optional(),
});

/*************************** LIST PHONE CODES ***************************/
export const listPhoneCodesDto = paginationDto.extend({
  countryId: z.coerce.number().int().positive().optional(),
  countryCode: z.string().trim().length(2).optional(),
  dialCode: z.string().trim().min(1).optional(),
  callingCode: z.string().trim().min(1).optional(),
});

/*************************** LIST CURRENCIES ***************************/
export const listCurrenciesDto = paginationDto;

/*************************** LIST TIMEZONES ***************************/
export const listTimezonesDto = paginationDto.extend({
  countryId: z.coerce.number().int().positive().optional(),
  zoneName: z.string().trim().min(1).optional(),
});

export type ListRegionsInput = z.infer<typeof listRegionsDto>;
export type ListCountriesInput = z.infer<typeof listCountriesDto>;
export type ListStatesInput = z.infer<typeof listStatesDto>;
export type ListCitiesInput = z.infer<typeof listCitiesDto>;
export type ListAdminAreasInput = z.infer<typeof listAdminAreasDto>;
export type ListLocalitiesInput = z.infer<typeof listLocalitiesDto>;
export type ListLanguagesInput = z.infer<typeof listLanguagesDto>;
export type ListLocalesInput = z.infer<typeof listLocalesDto>;
export type ListPostalCodeRulesInput = z.infer<typeof listPostalCodeRulesDto>;
export type ListPhoneNumberRulesInput = z.infer<typeof listPhoneNumberRulesDto>;
export type ListAddressFormatsInput = z.infer<typeof listAddressFormatsDto>;
export type ListPhoneCodesInput = z.infer<typeof listPhoneCodesDto>;
export type ListCurrenciesInput = z.infer<typeof listCurrenciesDto>;
export type ListTimezonesInput = z.infer<typeof listTimezonesDto>;
