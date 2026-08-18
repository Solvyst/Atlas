import { HttpClient } from "./http.js";
import { MetaClient } from "./meta.js";
import { ReferenceClient } from "./reference.js";
import { TaxClient } from "./tax.js";
import type { AtlasClientOptions } from "./types.js";

/*************************** ROOT SDK CLIENT ***************************/
export class SolvystAtlasClient {
  readonly meta: MetaClient;
  readonly reference: ReferenceClient;
  readonly tax: TaxClient;

  constructor(options: AtlasClientOptions) {
    const http = new HttpClient(options);
    this.meta = new MetaClient(http);
    this.reference = new ReferenceClient(http);
    this.tax = new TaxClient(http);
  }
}

/*************************** CLIENT FACTORY ***************************/
export function createSolvystAtlasClient(options: AtlasClientOptions) {
  return new SolvystAtlasClient(options);
}
