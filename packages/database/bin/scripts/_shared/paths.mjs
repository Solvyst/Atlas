import path from "node:path";
import { fileURLToPath } from "node:url";

// Current Script Directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Package Root
export const packageRoot = path.resolve(__dirname, "../../..");

// Workspace Root
export const workspaceRoot = path.resolve(packageRoot, "../..");

// Contribution Roots
export const contributionsRoot = path.join(workspaceRoot, "contributions");
export const geoContributionsDir = path.join(contributionsRoot, "geo");
export const taxContributionsDir = path.join(contributionsRoot, "tax");

// CSV Export Root
export const csvExportRoot = path.join(workspaceRoot, "data", "csv");
