import type { Request, Response } from "express";

import { ApiResponse } from "@/lib/ApiResponse.js";
import { catchAsync } from "@/lib/catchAsync.js";
import {
  listAdminAreasDto,
  listCitiesDto,
  listCountriesDto,
  listCurrenciesDto,
  listLocalitiesDto,
  listRegionsDto,
  listStatesDto,
  listTimezonesDto,
} from "../dto/meta.dto.js";
import { GeoService } from "../services/geo.service.js";

/*************************** GET GEO STATES ***************************/
export const getGeoStates = catchAsync(async (req: Request, res: Response) => {
  const country =
    req.params.country ??
    req.query.country ??
    req.query.geo ??
    req.query.search ??
    req.query.q;

  const result = await GeoService.getGeoStates(String(country ?? ""));
  return ApiResponse(res, result, "Geo states fetched");
});

/*************************** LIST REGIONS ***************************/
export const listRegions = catchAsync(async (req: Request, res: Response) => {
  const query = listRegionsDto.parse(req.query);
  const regions = await GeoService.listRegions(query);
  return ApiResponse(res, regions, "Regions fetched");
});

/*************************** LIST COUNTRIES ***************************/
export const listCountries = catchAsync(async (req: Request, res: Response) => {
  const query = listCountriesDto.parse(req.query);
  const countries = await GeoService.listCountries(query);
  return ApiResponse(res, countries, "Countries fetched");
});

/*************************** LIST STATES ***************************/
export const listStates = catchAsync(async (req: Request, res: Response) => {
  const query = listStatesDto.parse(req.query);
  const states = await GeoService.listStates(query);
  return ApiResponse(res, states, "States fetched");
});

/*************************** LIST CITIES ***************************/
export const listCities = catchAsync(async (req: Request, res: Response) => {
  const query = listCitiesDto.parse(req.query);
  const cities = await GeoService.listCities(query);
  return ApiResponse(res, cities, "Cities fetched");
});

/*************************** LIST ADMIN AREAS ***************************/
export const listAdminAreas = catchAsync(
  async (req: Request, res: Response) => {
    const query = listAdminAreasDto.parse(req.query);
    const adminAreas = await GeoService.listAdminAreas(query);
    return ApiResponse(res, adminAreas, "Admin areas fetched");
  },
);

/*************************** LIST LOCALITIES ***************************/
export const listLocalities = catchAsync(
  async (req: Request, res: Response) => {
    const query = listLocalitiesDto.parse(req.query);
    const localities = await GeoService.listLocalities(query);
    return ApiResponse(res, localities, "Localities fetched");
  },
);

/*************************** LIST CURRENCIES ***************************/
export const listCurrencies = catchAsync(
  async (req: Request, res: Response) => {
    const query = listCurrenciesDto.parse(req.query);
    const currencies = await GeoService.listCurrencies(query);
    return ApiResponse(res, currencies, "Currencies fetched");
  },
);

/*************************** LIST TIMEZONES ***************************/
export const listTimezones = catchAsync(async (req: Request, res: Response) => {
  const query = listTimezonesDto.parse(req.query);
  const timezones = await GeoService.listTimezones(query);
  return ApiResponse(res, timezones, "Timezones fetched");
});
