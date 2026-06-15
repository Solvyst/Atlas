import http from "http";
import "dotenv/config";

import app from "@/app.js";
import { env } from "./config/env.js";
import { testPgConnection } from "./database/pg.js";

const PORT = Number(env.PORT);
const HOST = env.HOST;

(async () => {
  try {
    // Test PG Connection
    await testPgConnection();

    // HTTP server
    const server = http.createServer(app);
    server.keepAliveTimeout = 65_000;
    server.headersTimeout = 66_000;

    // Listen Server
    server.listen(PORT, HOST, () => {
      const prettyHost = HOST === "0.0.0.0" ? "localhost" : HOST;
      console.log(`🚀 API listening on http://${prettyHost}:${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
