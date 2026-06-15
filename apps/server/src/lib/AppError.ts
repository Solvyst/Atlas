export type ErrorType =
  | "VALIDATION_ERROR"
  | "AUTH_ERROR"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMIT"
  | "APP_ERROR"
  | "SERVER_ERROR"
  | "NOT_IMPLEMENTED"
  | "BAD_GATEWAY"
  | "SERVICE_UNAVAILABLE"
  | "GATEWAY_TIMEOUT"
  | "PAYMENT_REQUIRED";

export class AppError extends Error {
  statusCode: number;
  errorType: ErrorType;
  isOperational = true;
  meta?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    errorType: ErrorType = "APP_ERROR",
    meta?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.meta = meta;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // 4xx - Client Errors
  static badRequest(msg = "Bad Request") {
    return new AppError(msg, 400, "VALIDATION_ERROR");
  }

  static unauthorized(msg = "Unauthenticated") {
    return new AppError(msg, 401, "AUTH_ERROR");
  }

  static forbidden(msg = "Forbidden") {
    return new AppError(msg, 403, "FORBIDDEN");
  }

  static notFound(msg = "Not Found") {
    return new AppError(msg, 404, "NOT_FOUND");
  }

  static conflict(msg = "Conflict") {
    return new AppError(msg, 409, "CONFLICT");
  }

  // static unprocessableEntity(msg = "Validation error") {
  //   return new AppError(msg, 422, "VALIDATION_ERROR");
  // }

  static tooManyRequests(msg = "Too Many Requests") {
    return new AppError(msg, 429, "RATE_LIMIT");
  }

  // 5xx - Server Errors
  static internal(msg = "Internal Server Error") {
    return new AppError(msg, 500, "SERVER_ERROR");
  }

  static notImplemented(msg = "Not Implemented") {
    return new AppError(msg, 501, "NOT_IMPLEMENTED");
  }

  static badGateway(msg = "Bad Gateway") {
    return new AppError(msg, 502, "BAD_GATEWAY");
  }

  static serviceUnavailable(msg = "Service Unavailable") {
    return new AppError(msg, 503, "SERVICE_UNAVAILABLE");
  }

  static gatewayTimeout(msg = "Gateway Timeout") {
    return new AppError(msg, 504, "GATEWAY_TIMEOUT");
  }

  static paymentRequired(msg = "Payment Required") {
    return new AppError(msg, 402, "PAYMENT_REQUIRED");
  }

  static unprocessableEntity(msg = "Validation error", meta?: unknown) {
    const e = new AppError(msg, 422, "VALIDATION_ERROR");
    (e as any).meta = meta;
    return e;
  }
}
