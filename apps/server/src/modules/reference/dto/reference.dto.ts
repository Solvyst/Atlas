import { z } from "zod";

const paginationDto = z.object({
  search: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(250).optional(),
  offset: z.coerce.number().int().min(0).default(0),
});

/*************************** LIST ADDRESS FORMATS ***************************/
export const listAddressFormatsDto = paginationDto.extend({
  countryId: z.coerce.number().int().positive().optional(),
  countryCode: z.string().trim().length(2).optional(),
});

export type ListAddressFormatsInput = z.infer<typeof listAddressFormatsDto>;
