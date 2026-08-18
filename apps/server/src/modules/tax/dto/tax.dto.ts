import { z } from "zod";

const paginationDto = z.object({
  search: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(250).optional(),
  offset: z.coerce.number().int().min(0).default(0),
});

/*************************** LIST TAX COUNTRY FORMS ***************************/
export const listTaxCountryFormsDto = paginationDto.extend({
  countryCode: z.string().trim().length(2).optional(),
});

/*************************** GET TAX COUNTRY FORM ***************************/
export const getTaxCountryFormDto = z.object({
  countryCode: z.string().trim().length(2),
});

export type ListTaxCountryFormsInput = z.infer<typeof listTaxCountryFormsDto>;
export type GetTaxCountryFormInput = z.infer<typeof getTaxCountryFormDto>;
