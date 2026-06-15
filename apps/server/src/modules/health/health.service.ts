export class HealthService {
  static getBasicInfo() {
    return {
      server: "ok",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION ?? "dev",
    };
  }
}
