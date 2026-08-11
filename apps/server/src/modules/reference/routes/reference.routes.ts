import { Router } from "express";

import { metaRateLimit, requireApiKey } from "@/middleware/meta.middleware.js";

import {
  listBankingRules,
  listBusinessIdentifiers,
  listCompanyTypes,
  listCurrencyFormats,
  listDateTimeFormats,
  listHolidays,
  listPhoneNumberRules,
  listUnits,
} from "../controllers/reference.controller.js";

const router = Router();

/*************************** REFERENCE SECURITY ***************************/
router.use(metaRateLimit);
router.use(requireApiKey);

/*************************** REFERENCE READ ROUTES ***************************/
router.get("/currency-formats", listCurrencyFormats);
router.get("/phone-number-rules", listPhoneNumberRules);
router.get("/business-identifiers", listBusinessIdentifiers);
router.get("/banking-rules", listBankingRules);
router.get("/date-time-formats", listDateTimeFormats);
router.get("/company-types", listCompanyTypes);
router.get("/units", listUnits);
router.get("/holidays", listHolidays);

export default router;
