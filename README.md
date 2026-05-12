# dp-inntekt-frontend

Inntektsredigeringsverktøy for saksbehandlere som jobber med dagpenger.

## Kom i gang

Kopier `.env.example` til `.env`, installer avhengigheter og start appen:

```bash
pnpm install
pnpm run dev
```

## Kjør lokalt mot DEV-backend

Som standard brukes [MSW](https://mswjs.io/) for mock-data. For å hente data fra DEV-backend trenger du et access token.

**Med script** (anbefalt) — installer Playwright én gang:

```bash
pnpm exec playwright install chromium
```

Generer token (åpner nettleser for innlogging):

```bash
pnpm run token
```

**Manuelt** — hent token fra:
https://azure-token-generator.intern.dev.nav.no/api/obo\?aud\=dev-gcp.teamdagpenger.dp-inntekt-api

og oppdater `.env`:

```
USE_MSW=false
DP_INNTEKT_API_TOKEN=<access_token>
```

## Testing

```bash
pnpm run test
pnpm run coverage
```

## IntelliJ-oppsett

- **Prettier**: Settings > Languages & Frameworks > JavaScript > Prettier → Automatic, Run on save
- **ESLint**: Settings > Languages & Frameworks > JavaScript > ESLint → Automatic, Run on save
- **Actions on Save**: Settings > Tools > Actions on Save → aktiver Prettier, Reformat code, Optimize imports

## Henvendelser

John Martin Lindseth — john.martin.lindseth@nav.no
