import { Router } from "express";

import {
  getGeoStates,
  listAddressFormats,
  listAdminAreas,
  listCities,
  listCountries,
  listCurrencies,
  listLanguages,
  listLocales,
  listLocalities,
  listPhoneCodes,
  listPhoneNumberRules,
  listPostalCodeRules,
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
router.get("/geo=:country", getGeoStates);
router.get("/geo", getGeoStates);
router.get("/regions", listRegions);
router.get("/countries", listCountries);
router.get("/states", listStates);
router.get("/cities", listCities);
router.get("/admin-areas", listAdminAreas);
router.get("/localities", listLocalities);
router.get("/languages", listLanguages);
router.get("/locales", listLocales);
router.get("/postal-code-rules", listPostalCodeRules);
router.get("/phone-number-rules", listPhoneNumberRules);
router.get("/address-formats", listAddressFormats);
router.get("/phone-codes", listPhoneCodes);
router.get("/currencies", listCurrencies);
router.get("/timezones", listTimezones);

export default router;
