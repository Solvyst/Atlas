import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const packageRoot = path.resolve(__dirname, "../../..");
export const workspaceRoot = path.resolve(packageRoot, "../..");
export const contributionsRoot = path.join(workspaceRoot, "contributions");
export const geoContributionsDir = path.join(contributionsRoot, "geo");
export const referenceContributionsDir = path.join(contributionsRoot, "reference");
export const csvExportRoot = path.join(workspaceRoot, "data", "csv");
