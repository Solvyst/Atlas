import { SolvystAtlasError } from "./errors.js";
import type {
  AtlasClientOptions,
  AtlasResponse,
  FetchLike,
  QueryParams,
  QueryValue,
} from "./types.js";

/*************************** DEFAULT CLIENT CONFIG ***************************/
const DEFAULT_BASE_URL = "https://atlasv1.solvyst.com";
const DEFAULT_TIMEOUT_MS = 30_000;

/*************************** URL HELPERS ***************************/
function normalizeBaseUrl(baseUrl?: string) {
  return (baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function resolveFetch(fetchImpl?: FetchLike) {
  const runtimeFetch = fetchImpl ?? globalThis.fetch;
  if (!runtimeFetch) {
    throw new Error(
      "A fetch implementation is required. Use Node.js 18+ or pass options.fetch.",
    );
  }
  return runtimeFetch;
}

function appendQuery(url: URL, query?: QueryParams) {
  if (!query) return;

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value as Exclude<QueryValue, undefined>));
  }
}

/*************************** RESPONSE HELPERS ***************************/
async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/*************************** HTTP CLIENT ***************************/
export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: FetchLike;
  private readonly headers?: HeadersInit;
  private readonly timeoutMs: number;

  constructor(options: AtlasClientOptions) {
    if (!options.apiKey?.trim()) {
      throw new Error("apiKey is required");
    }

    this.apiKey = options.apiKey;
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.fetchImpl = resolveFetch(options.fetch);
    this.headers = options.headers;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  /*************************** GET REQUEST ***************************/
  async get<T>(path: string, query?: QueryParams): Promise<T> {
    const url = new URL(path, `${this.baseUrl}/`);
    appendQuery(url, query);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": this.apiKey,
          ...this.headers,
        },
        signal: controller.signal,
      });

      const body = await readJson(response);

      if (!response.ok) {
        const message =
          body && typeof body === "object" && "message" in body
            ? String((body as { message?: unknown }).message)
            : `Solvyst Atlas request failed with status ${response.status}`;
        throw new SolvystAtlasError(message, response.status, body);
      }

      // Atlas APIs return an envelope. Raw JSON is still supported for future
      // endpoints that may intentionally return a direct payload.
      if (!body || typeof body !== "object" || !("success" in body)) {
        return body as T;
      }

      const envelope = body as AtlasResponse<T>;
      return envelope.data;
    } catch (error) {
      if (error instanceof SolvystAtlasError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new SolvystAtlasError("Solvyst Atlas request timed out", 408);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}
