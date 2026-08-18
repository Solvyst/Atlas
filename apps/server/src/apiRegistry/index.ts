import type { Application } from "express";

import metaRoutes from "@/modules/meta/routes/meta.routes.js";
import referenceRoutes from "@/modules/reference/routes/reference.routes.js";
import taxRoutes from "@/modules/tax/routes/tax.routes.js";

export function registerApi(app: Application) {
  // PUBLIC ROUTES
  app.use("/api/v1/meta", metaRoutes);
  app.use("/api/v1/reference", referenceRoutes);
  app.use("/api/v1/tax", taxRoutes);
}
