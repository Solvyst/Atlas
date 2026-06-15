//Meta
import type {
  MetaCitiesTable,
  MetaCountriesTable,
  MetaCurrenciesTable,
  MetaRegionsTable,
  MetaStatesTable,
  MetaTimezonesTable,
} from "./meta.tables.js";

//DB
export interface DB {
  //Meta
  "meta.regions": MetaRegionsTable;
  "meta.countries": MetaCountriesTable;
  "meta.states": MetaStatesTable;
  "meta.cities": MetaCitiesTable;
  "meta.currencies": MetaCurrenciesTable;
  "meta.timezones": MetaTimezonesTable;
}
