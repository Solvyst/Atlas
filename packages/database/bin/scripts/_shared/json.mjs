import fs from "node:fs";
import path from "node:path";

// Read Any JSON File
export function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Read JSON Object
export function readJsonObject(filePath, label = filePath) {
  const row = readJsonFile(filePath);
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error(label + " must contain a JSON object");
  }
  return row;
}

// Read JSON Array
export function readJsonArray(filePath, label = filePath) {
  const rows = readJsonFile(filePath);
  if (!Array.isArray(rows)) throw new Error(label + " must contain a JSON array");
  return rows;
}

// Read Required Contribution Object
export function readContributionObject(rootDir, relativePath) {
  const filePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error("Missing contribution dataset: " + filePath);
  }
  return readJsonObject(filePath, relativePath);
}

// Read Required Contribution Array
export function readContributionArray(rootDir, relativePath) {
  const filePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error("Missing contribution dataset: " + filePath);
  }
  return readJsonArray(filePath, relativePath);
}

// Read Contribution Object With Errors
export function readContributionObjectOrErrors(rootDir, relativePath, errors) {
  const filePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(filePath)) {
    errors.push(relativePath + ": missing file");
    return null;
  }

  try {
    return readJsonObject(filePath, relativePath);
  } catch (error) {
    errors.push(relativePath + ": invalid JSON - " + error.message);
    return null;
  }
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

// List Contribution Directories
export function listContributionDirs(rootDir) {
  if (!fs.existsSync(rootDir)) return [];
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));
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
