import { HttpClient } from "./http.js";
import type {
  ListTaxFormsQuery,
  PaginatedResult,
  TaxCountryForm,
  TaxCountryFormResult,
} from "./types.js";

/*************************** TAX API CLIENT ***************************/
export class TaxClient {
  constructor(private readonly http: HttpClient) {}

  /*************************** COUNTRY FORMS ***************************/
  forms(query?: ListTaxFormsQuery) {
    return this.http.get<PaginatedResult<TaxCountryForm>>(
      "/api/v1/tax/forms",
      query,
    );
  }

  /*************************** COUNTRY FORM ***************************/
  form(countryCode: string) {
    return this.http.get<TaxCountryFormResult>(
      `/api/v1/tax/forms/${countryCode}`,
    );
  }

}
