import type { Request, Response } from "express";

import { ApiResponse } from "@/lib/ApiResponse.js";
import { catchAsync } from "@/lib/catchAsync.js";

import {
  listBankingRulesDto,
  listBusinessIdentifiersDto,
  listCompanyTypesDto,
  listCurrencyFormatsDto,
  listDateTimeFormatsDto,
  listHolidaysDto,
  listReferencePhoneNumberRulesDto,
  listUnitsDto,
} from "../dto/reference.dto.js";
import { ReferenceService } from "../services/reference.service.js";

/*************************** LIST CURRENCY FORMATS ***************************/
export const listCurrencyFormats = catchAsync(
  async (req: Request, res: Response) => {
    const query = listCurrencyFormatsDto.parse(req.query);
    return ApiResponse(
      res,
      await ReferenceService.listCurrencyFormats(query),
      "Currency formats fetched",
    );
  },
);

/*************************** LIST PHONE NUMBER RULES ***************************/
export const listPhoneNumberRules = catchAsync(
  async (req: Request, res: Response) => {
    const query = listReferencePhoneNumberRulesDto.parse(req.query);
    return ApiResponse(
      res,
      await ReferenceService.listPhoneNumberRules(query),
      "Phone number rules fetched",
    );
  },
);

/*************************** LIST BUSINESS IDENTIFIERS ***************************/
export const listBusinessIdentifiers = catchAsync(
  async (req: Request, res: Response) => {
    const query = listBusinessIdentifiersDto.parse(req.query);
    return ApiResponse(
      res,
      await ReferenceService.listBusinessIdentifiers(query),
      "Business identifiers fetched",
    );
  },
);

/*************************** LIST BANKING RULES ***************************/
export const listBankingRules = catchAsync(
  async (req: Request, res: Response) => {
    const query = listBankingRulesDto.parse(req.query);
    return ApiResponse(
      res,
      await ReferenceService.listBankingRules(query),
      "Banking rules fetched",
    );
  },
);

/*************************** LIST DATE-TIME FORMATS ***************************/
export const listDateTimeFormats = catchAsync(
  async (req: Request, res: Response) => {
    const query = listDateTimeFormatsDto.parse(req.query);
    return ApiResponse(
      res,
      await ReferenceService.listDateTimeFormats(query),
      "Date-time formats fetched",
    );
  },
);

/*************************** LIST COMPANY TYPES ***************************/
export const listCompanyTypes = catchAsync(
  async (req: Request, res: Response) => {
    const query = listCompanyTypesDto.parse(req.query);
    return ApiResponse(
      res,
      await ReferenceService.listCompanyTypes(query),
      "Company types fetched",
    );
  },
);

/*************************** LIST UNITS ***************************/
export const listUnits = catchAsync(async (req: Request, res: Response) => {
  const query = listUnitsDto.parse(req.query);
  return ApiResponse(
    res,
    await ReferenceService.listUnits(query),
    "Units fetched",
  );
});

/*************************** LIST HOLIDAYS ***************************/
export const listHolidays = catchAsync(async (req: Request, res: Response) => {
  const query = listHolidaysDto.parse(req.query);
  return ApiResponse(
    res,
    await ReferenceService.listHolidays(query),
    "Holidays fetched",
  );
});
