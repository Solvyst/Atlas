import type { Request, Response } from "express";
import { HealthService } from "./health.service.js";

export const checks = (req: Request, res: Response) => {
  const basic = HealthService.getBasicInfo();
  return res.json({
    basic,
  });
};
