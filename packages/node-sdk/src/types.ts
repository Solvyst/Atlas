/*************************** SHARED HTTP TYPES ***************************/
export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type AtlasClientOptions = {
  apiKey: string;
  baseUrl?: string;
  fetch?: FetchLike;
  headers?: HeadersInit;
  timeoutMs?: number;
};

/*************************** API ENVELOPE TYPES ***************************/
export type AtlasResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type AtlasErrorBody = {
  success?: false;
  message?: string;
  code?: string;
  errorType?: string;
  errors?: unknown;
  meta?: unknown;
};

/*************************** PAGINATION TYPES ***************************/
export type PaginationQuery = {
  search?: string;
  limit?: number;
  offset?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  limit: number;
  offset: number;
  count: number;
  hasMore: boolean;
};

/*************************** META QUERY TYPES ***************************/
export type ListRegionsQuery = PaginationQuery;

export type ListCountriesQuery = PaginationQuery & {
  regionId?: number;
  subregionId?: number;
  currency?: string;
  iso2?: string;
  iso3?: string;
};

export type ListStatesQuery = PaginationQuery & {
  countryId?: number;
  countryCode?: string;
  parentId?: number;
};

export type ListCitiesQuery = PaginationQuery & {
  countryId?: number;
  stateId?: number;
  countryCode?: string;
};

export type ListAdminAreasQuery = PaginationQuery & {
  countryId?: number;
  countryCode?: string;
  parentId?: number;
  type?: string;
  level?: number;
};

export type ListLocalitiesQuery = PaginationQuery & {
  countryId?: number;
  countryCode?: string;
  adminAreaId?: number;
  type?: string;
  settlementsOnly?: boolean;
};

export type ListLanguagesQuery = PaginationQuery & {
  code?: string;
  direction?: "ltr" | "rtl";
};

export type ListLocalesQuery = PaginationQuery & {
  languageCode?: string;
  countryCode?: string;
  currencyCode?: string;
  direction?: "ltr" | "rtl";
};

export type ListPostalCodeRulesQuery = PaginationQuery & {
  countryId?: number;
  countryCode?: string;
  requiredOnly?: boolean;
};

export type ListPhoneNumberRulesQuery = PaginationQuery & {
  countryId?: number;
  countryCode?: string;
  dialCode?: string;
};

export type ListAddressFormatsQuery = PaginationQuery & {
  countryId?: number;
  countryCode?: string;
};

export type ListPhoneCodesQuery = PaginationQuery & {
  countryId?: number;
  countryCode?: string;
  dialCode?: string;
  callingCode?: string;
};

export type ListCurrenciesQuery = PaginationQuery;

export type ListTimezonesQuery = PaginationQuery & {
  countryId?: number;
  zoneName?: string;
};

/*************************** META RECORD TYPES ***************************/
export type AtlasRecord = Record<string, unknown>;
export type Region = AtlasRecord;
export type Country = AtlasRecord;
export type State = AtlasRecord;
export type City = AtlasRecord;
export type AdminArea = AtlasRecord;
export type Locality = AtlasRecord;
export type Language = AtlasRecord;
export type Locale = AtlasRecord;
export type PostalCodeRule = AtlasRecord;
export type PhoneNumberRule = AtlasRecord;
export type AddressFormat = AtlasRecord;
export type PhoneCode = AtlasRecord;
export type Currency = AtlasRecord;
export type Timezone = AtlasRecord;

export type GeoStatesResult = {
  country: Country;
  states: State[];
};
