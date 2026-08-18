import fs from "node:fs";
import path from "node:path";

import { readContributionObject, listContributionDirs } from "./json.mjs";
import { taxContributionsDir } from "./paths.mjs";

// Read Tax Country Form Files
export function readTaxForms() {
  if (!fs.existsSync(taxContributionsDir)) {
    throw new Error("Missing contribution dataset: " + taxContributionsDir);
  }

  return listContributionDirs(taxContributionsDir).map((entry) =>
    readContributionObject(
      taxContributionsDir,
      path.join(entry.name, "forms.json"),
    ),
  );
}

// List Tax Country Directories
export function listTaxCountryDirs() {
  return listContributionDirs(taxContributionsDir);
}
