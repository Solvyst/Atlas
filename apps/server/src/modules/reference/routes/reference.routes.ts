import { Router } from "express";

import { metaRateLimit, requireApiKey } from "@/middleware/meta.middleware.js";

import { listAddressFormats } from "../controllers/reference.controller.js";

const router = Router();

/*************************** REFERENCE SECURITY ***************************/
router.use(metaRateLimit);
router.use(requireApiKey);

/*************************** REFERENCE READ ROUTES ***************************/
router.get("/address-formats", listAddressFormats);

export default router;
