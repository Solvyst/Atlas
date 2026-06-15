import express, { type Application } from "express";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import { registerApi } from "./apiRegistry/index.js";

import healthRoutes from "@/modules/health/health.routes.js";

import { errorMiddleware, notFoundHandler } from "./middleware/error.js";
import configureCors from "./config/cors.js";

const app: Application = express();
dotenv.config({ debug: false });

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
app.use(configureCors());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} // HTTP request logger middleware for development environment

// API Gateway
app.use("/health", healthRoutes);
registerApi(app);

// Error Handling
app.use(notFoundHandler);
app.use(errorMiddleware);

export default app;
