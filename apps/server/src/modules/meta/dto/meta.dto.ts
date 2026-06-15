import { z } from "zod";

const paginationDto = z.object({
  search: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
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
export type ListCurrenciesInput = z.infer<typeof listCurrenciesDto>;
export type ListTimezonesInput = z.infer<typeof listTimezonesDto>;
