# dp-inntekt-frontend

Inntektsredigeringsverktøy for saksbehandlere som jobber med dagpenger.  
Applikasjonen gjør det mulig å hente, vise, redigere og validere inntektsopplysninger knyttet til søkere av dagpenger.

## 🚀 Kom i gang

### Sette opp miljøvariabel fil

Ta kopi av `.env.example` og kall filen `.env`

### Installasjon

Installer avhengigheter

```bash
npm install
```

### Kjør applikasjonen lokalt

Start utviklingsserveren med hot module reloading (HMR):

```bash
npm run dev
```

## ⭐️ Godt å vite

### Kjør applikasjonen lokalt mot DEV-backend

By default vil applikasjonen kjøre med [MSW](https://mswjs.io/), som mocke backend endepunkter

```bash
USE_MSW=true
```

Men dersom du ønsker kunne å hente data fra backend i DEV direkte fra localhost, må du oppdatere verdiene for `USE_MSW` og `DP_INNTEKT_API_TOKEN` i `.env`

Hente backend access_token fra:
https://azure-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp.teamdagpenger.dp-inntekt-api

```bash
USE_MSW: false
DP_INNTEKT_API_TOKEN: access_token
```

### Kjør tester

```bash
npm run test
```

### Kjør test coverage

```bash
npm run coverage
```

## ✉️ Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot:

- John Martin Lindseth, john.martin.lindseth@nav.no

## IntelliJ Prettier and Eslint configuration

1. Set Prettier as the default formatter:
   1. Preferences > Settings > Languages & Frameworks > JavaScript / TypeScript > Prettier
   2. Select Automatic Prettier configuration
   3. Select Run on save
2. Enable “On Save” Formatting:
   1. Go to: Preferences / Settings > Tools > Actions on Save
   2. Enable: Run Prettier, Reformat code and Optimize imports
3. In Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
   1. Select Automatic ESLint Configuration
   2. Select Run eslint --fix on save
