import express, { type Application } from "express";

import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { registerApi } from "./apiRegistry/index.js";

import healthRoutes from "@/modules/health/health.routes.js";

import { errorMiddleware, notFoundHandler } from "./middleware/error.js";
import configureCors from "./config/cors.js";

const app: Application = express();

//Middlewares
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf?.toString("utf8");
    },
    limit: "400kb",
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(compression());
app.use(configureCors());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} // HTTP request logger middleware for development environment

/*************************** SOLVYST ATLAS ROOT ***************************/
app.get("/", (_req, res) => {
  res.type("text/plain");

  return res.status(200).send(`\n  **********************************************************************\n  *                                                                    *\n  *                    S O L V Y S T   A T L A S                       *\n  *                                                                    *\n  *                Production Metadata API is running                   *\n  *                                                                    *\n  **********************************************************************\n\n  STATUS   ONLINE\n  VERSION  v1\n  HEALTH   /health\n  BASE     /api/v1/meta\n`);
});
// API Gateway
app.use("/health", healthRoutes);
registerApi(app);

// Error Handling
app.use(notFoundHandler);
app.use(errorMiddleware);

export default app;
