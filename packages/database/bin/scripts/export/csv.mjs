import fs from "node:fs";
import path from "node:path";

import { contributionsRoot, csvExportRoot, workspaceRoot } from "../_shared/paths.mjs";
import { readJsonArray, walkJsonFiles } from "../_shared/json.mjs";

function flattenValue(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function csvEscape(value) {
  const text = flattenValue(value);
  return /[",\n\r]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

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

function exportJsonFile(sourcePath, targetPath) {
  const rows = readJsonArray(sourcePath);
  const count = writeCsv(targetPath, rows);
  console.log(path.relative(workspaceRoot, targetPath) + " (" + count + " rows)");
}

fs.rmSync(csvExportRoot, { recursive: true, force: true });
fs.mkdirSync(csvExportRoot, { recursive: true });

for (const jsonPath of walkJsonFiles(contributionsRoot)) {
  const relative = path.relative(contributionsRoot, jsonPath).replace(/.json$/, ".csv");
  exportJsonFile(jsonPath, path.join(csvExportRoot, relative));
}

console.log("CSV exports generated in " + csvExportRoot);
