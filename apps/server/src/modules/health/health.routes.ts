import { Router } from "express";
import { checks } from "./health.controller.js";

const router = Router();

router.get("/", checks);

export default router;
