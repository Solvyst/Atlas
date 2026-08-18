import http from "http";

import { env } from "./config/env.js";
import { closeRedis, testRedisConnection } from "@solvyst-atlas/cache";
import { pool, testPgConnection } from "@solvyst-atlas/database";
import app from "@/app.js";

const PORT = Number(env.PORT);
const HOST = env.HOST;

(async () => {
  try {
    // Test PG Connection
    await testPgConnection();

    // Test Redis Connection
    await testRedisConnection({
      enabled: env.REDIS_ENABLED,
      url: env.REDIS_URL,
    });

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
        closeRedis();
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
