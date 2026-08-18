import { HttpClient } from "./http.js";
import type {
  AddressFormat,
  ListAddressFormatsQuery,
  PaginatedResult,
} from "./types.js";

/*************************** REFERENCE API CLIENT ***************************/
export class ReferenceClient {
  constructor(private readonly http: HttpClient) {}

  /*************************** ADDRESS FORMATS ***************************/
  addressFormats(query?: ListAddressFormatsQuery) {
    return this.http.get<PaginatedResult<AddressFormat>>(
      "/api/v1/reference/address-formats",
      query,
    );
  }
}
