// Is Blank
export function isBlank(value) {
  return value === undefined || value === null || value === "";
}

// Require Objects
export function requireObjects(relativePath, rows, errors) {
  rows.forEach((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      errors.push(relativePath + "[" + index + "]: row must be an object");
    }
  });
}

// Allow Only Fields
export function allowOnlyFields(relativePath, rows, fields, errors) {
  const allowed = new Set(fields);
  rows.forEach((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return;
    for (const field of Object.keys(row)) {
      if (!allowed.has(field)) {
        errors.push(
          relativePath +
            "[" +
            index +
            "]: unknown field " +
            field +
            ". Add schema, migration, importer, API/docs support before accepting new fields.",
        );
      }
    }
  });
}

// Allow Only Object Fields
export function allowOnlyObjectFields(label, object, fields, errors) {
  const allowed = fields instanceof Set ? fields : new Set(fields);
  for (const field of Object.keys(object)) {
    if (!allowed.has(field)) {
      errors.push(
        label +
          ": unknown field " +
          field +
          ". Add schema, migration, importer, API/docs support before accepting new fields.",
      );
    }
  }
}

// Require Fields
export function requireFields(relativePath, rows, fields, errors) {
  rows.forEach((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return;
    for (const field of fields) {
      if (isBlank(row[field])) {
        errors.push(relativePath + "[" + index + "]: missing " + field);
      }
    }
  });
}

// Validate Rows
export function validateRows(relativePath, rows, spec, requiredFields, errors) {
  requireObjects(relativePath, rows, errors);
  allowOnlyFields(relativePath, rows, spec, errors);
  requireFields(relativePath, rows, requiredFields, errors);
}

// Check Unique
export function checkUnique(relativePath, rows, field, errors) {
  const seen = new Set();
  rows.forEach((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return;
    const value = row[field];
    if (value === undefined || value === null) return;
    if (seen.has(value)) {
      errors.push(
        relativePath + "[" + index + "]: duplicate " + field + " " + value,
      );
    }
    seen.add(value);
  });
}
