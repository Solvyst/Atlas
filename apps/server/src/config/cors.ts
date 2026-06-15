import cors from "cors";

import { env } from "./env.js";

/*************************** CORS CONFIGURATION ***************************/
const configureCors = () => {
  const origins = [env.WEB_URL, env.ATLASKIT_API_URL].filter(
    (origin): origin is string => Boolean(origin),
  );

  return cors({
    origin: origins,
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
