import type { AtlasErrorBody } from "./types.js";

/*************************** SDK ERROR ***************************/
export class SolvystAtlasError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly body?: AtlasErrorBody | unknown;

  constructor(message: string, status: number, body?: AtlasErrorBody | unknown) {
    super(message);
    this.name = "SolvystAtlasError";
    this.status = status;
    this.body = body;

    if (body && typeof body === "object" && "code" in body) {
      this.code = String((body as AtlasErrorBody).code);
    }
  }
}
