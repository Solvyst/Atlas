import cors from "cors";

import { AppError } from "@/lib/AppError.js";
import { env } from "./env.js";

/*************************** CORS CONFIGURATION ***************************/
const configureCors = () => {
  const origins = [
    env.WEB_URL,
    ...(env.CORS_ORIGINS?.split(",").map((origin) => origin.trim()) ?? []),
  ].filter((origin): origin is string => Boolean(origin));

  return cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (origins.includes(origin)) return callback(null, true);
      return callback(AppError.forbidden("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-api-key",
      "x-org-public-id",
      "x-workspace-public-id",
    ],
  });
};

export default configureCors;
