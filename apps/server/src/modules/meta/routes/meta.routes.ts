import { Router } from "express";

import {
  listCities,
  listCountries,
  listCurrencies,
  listRegions,
  listStates,
  listTimezones,
} from "../controllers/meta.controller.js";

import { metaRateLimit, requireApiKey } from "@/middleware/meta.middleware.js";

const router = Router();

/*************************** META SECURITY ***************************/
router.use(metaRateLimit);
router.use(requireApiKey);

/*************************** META READ ROUTES ***************************/
router.get("/regions", listRegions);
router.get("/countries", listCountries);
router.get("/states", listStates);
router.get("/cities", listCities);
router.get("/currencies", listCurrencies);
router.get("/timezones", listTimezones);

export default router;
