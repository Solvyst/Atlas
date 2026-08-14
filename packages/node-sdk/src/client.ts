import { HttpClient } from "./http.js";
import { MetaClient } from "./meta.js";
import type { AtlasClientOptions } from "./types.js";

/*************************** ROOT SDK CLIENT ***************************/
export class SolvystAtlasClient {
  readonly meta: MetaClient;

  constructor(options: AtlasClientOptions) {
    const http = new HttpClient(options);
    this.meta = new MetaClient(http);
  }
}

/*************************** CLIENT FACTORY ***************************/
export function createSolvystAtlasClient(options: AtlasClientOptions) {
  return new SolvystAtlasClient(options);
}
