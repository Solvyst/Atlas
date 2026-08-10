import http from "http";
import "dotenv/config";

import app from "@/app.js";
import { pool, testPgConnection } from "@atlaskit/database";
import { env } from "./config/env.js";

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
      console.log(`API listening on http://${prettyHost}:${PORT}`);
    });

    const shutdown = async (signal: NodeJS.Signals) => {
      console.log(`${signal} received. Closing server...`);
      server.close(async (error) => {
        if (error) {
          console.error(error);
          process.exit(1);
        }

        await pool.end();
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
