import { AppError } from "@/lib/AppError.js";

import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodError } from "zod";

const isProd = process.env.NODE_ENV === "production";

// Convert ZodError into an AppError with details
function prettyPath(path: ReadonlyArray<PropertyKey>): string {
  const joined = path
    .map((p) => {
      if (typeof p === "number") return `[${p}]`;
      if (typeof p === "symbol") return p.description ?? "symbol";
      return String(p);
    })
    .join(".");
  return joined.replace(".[", "[");
}

export function fromZod(err: ZodError) {
  const issues = err.issues.map((i) => ({
    field:
      i.path && i.path.length
        ? prettyPath(i.path as ReadonlyArray<PropertyKey>)
        : "",
    code: i.code,
    message: i.message || "Invalid value",
  }));

  const fieldErrors: Record<string, string[]> = {};
  for (const it of issues) {
    const key = it.field || "_global";
    (fieldErrors[key] ||= []).push(it.message);
  }

  const aerr = AppError.unprocessableEntity("Validation error");
  (aerr as any).meta = {
    summary: `${issues.length} validation error${issues.length > 1 ? "s" : ""}`,
    issues,
    fieldErrors,
  };
  return aerr;
}

// Normalize any error into an AppError
function normalize(err: any): AppError {
  if (err instanceof AppError) return err;

  // Zod validation
  if (err instanceof ZodError || err?.name === "ZodError") {
    return fromZod(err);
  }

  // Mongo duplicate key
  if (err?.name === "MongoServerError" && err?.code === 11000) {
    const aerr = AppError.conflict("Duplicate value");
    (aerr as any).meta = { keyValue: err.keyValue };
    return aerr;
  }

  // Mongo cast error
  if (err?.name === "CastError") {
    const aerr = AppError.badRequest("Invalid id");
    (aerr as any).meta = { path: err.path, value: err.value };
    return aerr;
  }

  // Fallback
  const aerr = AppError.internal(err?.message || "Something went wrong");
  (aerr as any).stack = err?.stack ?? aerr.stack;
  return aerr;
}

// 404 handler
export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => next(AppError.notFound("Route not found"));

// Main error handler
export const errorMiddleware: ErrorRequestHandler = (
  rawErr,
  _req,
  res,
  _next,
) => {
  const err = normalize(rawErr);

  const body: any = {
    success: false,
    message: err.message,
    code: err.errorType,
  };

  if ((err as any).meta) body.meta = (err as any).meta;

  if (!isProd) body.stack = err.stack;

  res.status(err.statusCode).json(body);
};

export default errorMiddleware;
