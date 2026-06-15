import type { Application } from "express";

import metaRoutes from "@/modules/meta/routes/meta.routes.js";

export function registerApi(app: Application) {
  // PUBLIC ROUTES
  app.use("/api/v1/meta", metaRoutes);
}
