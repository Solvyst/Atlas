import { Router } from "express";

import { metaRateLimit, requireApiKey } from "@/middleware/meta.middleware.js";

import {
  getTaxCountryForm,
  listTaxCountryForms,
} from "../controllers/tax.controller.js";

const router = Router();

// TAX SECURITY
router.use(metaRateLimit);
router.use(requireApiKey);

/*************************** TAX READ ROUTES ***************************/
router.get("/forms", listTaxCountryForms);
router.get("/forms/:countryCode", getTaxCountryForm);

export default router;
