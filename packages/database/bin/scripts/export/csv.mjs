import fs from "node:fs";
import path from "node:path";

import { contributionsRoot, csvExportRoot, workspaceRoot } from "../_shared/paths.mjs";
import { readJsonFile, walkJsonFiles } from "../_shared/json.mjs";

// Flatten CSV Value
function flattenValue(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

// Escape CSV Value
function csvEscape(value) {
  const text = flattenValue(value);
  return /[",\n\r]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

// Collect CSV Columns
function collectColumns(rows) {
  const columns = [];
  const seen = new Set();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (seen.has(key)) continue;
      seen.add(key);
      columns.push(key);
    }
  }
  return columns;
}

// Write CSV File
function writeCsv(outPath, rows) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const columns = collectColumns(rows);
  const lines = [
    columns.map(csvEscape).join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ];
  fs.writeFileSync(outPath, lines.join("\n") + "\n");
  return rows.length;
}

// Export JSON File
function exportJsonFile(sourcePath, targetPath) {
  const json = readJsonFile(sourcePath);
  const rows = Array.isArray(json) ? json : [json];
  const count = writeCsv(targetPath, rows);
  console.log(path.relative(workspaceRoot, targetPath) + " (" + count + " rows)");
}

// Rebuild CSV Export Folder
fs.rmSync(csvExportRoot, { recursive: true, force: true });
fs.mkdirSync(csvExportRoot, { recursive: true });

// Export Contribution JSON Files
for (const jsonPath of walkJsonFiles(contributionsRoot)) {
  const relative = path.relative(contributionsRoot, jsonPath).replace(/.json$/, ".csv");
  exportJsonFile(jsonPath, path.join(csvExportRoot, relative));
}

console.log("CSV exports generated in " + csvExportRoot);
