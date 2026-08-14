import { SolvystAtlasClient } from "../dist/index.js";

const atlas = new SolvystAtlasClient({
  baseUrl: process.env.ATLAS_BASE_URL ?? "http://localhost:3100",
  apiKey: process.env.ATLAS_API_KEY,
});

const countries = await atlas.meta.countries({ search: "india", limit: 5 });
console.log(countries);
