# Node.js SDK

`@solvyst/atlas` is a typed Node.js client for Solvyst Atlas APIs. It hides `x-api-key`, query-string creation, response envelope parsing, timeouts, and API error handling.

## Build Locally

```sh
pnpm sdk:build
```

## Usage

```ts
import { SolvystAtlasClient } from "@solvyst/atlas";

const atlas = new SolvystAtlasClient({
  baseUrl: "https://atlasv1.solvyst.com",
  apiKey: process.env.ATLAS_API_KEY!,
});

const countries = await atlas.meta.countries({ search: "india", limit: 10 });
const states = await atlas.meta.states({ countryCode: "IN" });
const phoneCodes = await atlas.meta.phoneCodes({ dialCode: "+91" });
```

## Local Development

```ts
const atlas = new SolvystAtlasClient({
  baseUrl: "http://localhost:3100",
  apiKey: process.env.ATLAS_API_KEY!,
});
```

## Meta Methods

```ts
atlas.meta.geo("india")
atlas.meta.regions({ search: "asia" })
atlas.meta.countries({ iso2: "IN" })
atlas.meta.states({ countryCode: "IN" })
atlas.meta.cities({ stateId: 4026 })
atlas.meta.adminAreas({ countryCode: "US", type: "county" })
atlas.meta.localities({ countryCode: "IN", search: "bhubaneswar" })
atlas.meta.languages({ code: "hi" })
atlas.meta.locales({ countryCode: "IN" })
atlas.meta.phoneCodes({ dialCode: "+91" })
atlas.meta.currencies({ search: "INR" })
atlas.meta.timezones({ countryId: 101 })
```

## Reference Methods

```ts
atlas.reference.addressFormats({ countryCode: "IN" })
```

## Error Handling

Non-2xx responses throw `SolvystAtlasError`.

```ts
import { SolvystAtlasError } from "@solvyst/atlas";

try {
  await atlas.meta.states({});
} catch (error) {
  if (error instanceof SolvystAtlasError) {
    console.log(error.status, error.message);
  }
}
```
