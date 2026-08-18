import type { Request, Response } from "express";

import { ApiResponse } from "@/lib/ApiResponse.js";
import { catchAsync } from "@/lib/catchAsync.js";

import {
  getTaxCountryFormDto,
  listTaxCountryFormsDto,
} from "../dto/tax.dto.js";
import { TaxService } from "../services/tax.service.js";

/*************************** LIST TAX COUNTRY FORMS ***************************/
export const listTaxCountryForms = catchAsync(
  async (req: Request, res: Response) => {
    const query = listTaxCountryFormsDto.parse(req.query);
    return ApiResponse(
      res,
      await TaxService.listCountryForms(query),
      "Tax country forms fetched",
    );
  },
);

/*************************** GET TAX COUNTRY FORM ***************************/
export const getTaxCountryForm = catchAsync(
  async (req: Request, res: Response) => {
    const params = getTaxCountryFormDto.parse(req.params);
    return ApiResponse(
      res,
      await TaxService.getCountryForm(params),
      "Tax country form fetched",
    );
  },
);
