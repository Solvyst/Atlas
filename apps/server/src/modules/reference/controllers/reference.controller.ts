import type { Request, Response } from "express";

import { ApiResponse } from "@/lib/ApiResponse.js";
import { catchAsync } from "@/lib/catchAsync.js";

import { listAddressFormatsDto } from "../dto/reference.dto.js";
import { ReferenceService } from "../services/reference.service.js";

/*************************** LIST ADDRESS FORMATS ***************************/
export const listAddressFormats = catchAsync(
  async (req: Request, res: Response) => {
    const query = listAddressFormatsDto.parse(req.query);
    const formats = await ReferenceService.listAddressFormats(query);
    return ApiResponse(res, formats, "Address formats fetched");
  },
);
