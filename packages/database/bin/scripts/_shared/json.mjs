import fs from "node:fs";
import path from "node:path";

// Read JSON Array
export function readJsonArray(filePath, label = filePath) {
  const rows = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(rows)) throw new Error(label + " must contain a JSON array");
  return rows;
}

// Read Required Contribution Array
export function readContributionArray(rootDir, relativePath) {
  const filePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error("Missing contribution dataset: " + filePath);
  }
  return readJsonArray(filePath, relativePath);
}

// Read Optional Contribution Array
export function readOptionalContributionArray(rootDir, relativePath, fallback = []) {
  const filePath = path.join(rootDir, relativePath);
  return fs.existsSync(filePath) ? readJsonArray(filePath, relativePath) : fallback;
}

// Read Contribution Array With Errors
export function readContributionArrayOrErrors(rootDir, relativePath, errors) {
  const filePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(filePath)) {
    errors.push(relativePath + ": missing file");
    return [];
  }

  try {
    return readJsonArray(filePath, relativePath);
  } catch (error) {
    errors.push(relativePath + ": invalid JSON - " + error.message);
    return [];
  }
}

// Read JSON Directory
export function readJsonDir(rootDir, relativeDir) {
  const dir = path.join(rootDir, relativeDir);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => readContributionArray(rootDir, path.join(relativeDir, entry.name)));
}

// Walk JSON Files
export function walkJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walkJsonFiles(entryPath);
      return entry.isFile() && entry.name.endsWith(".json") ? [entryPath] : [];
    })
    .sort();
}
