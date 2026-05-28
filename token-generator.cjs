const { chromium } = require("playwright-chromium");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const envPath = path.resolve(__dirname, ".env");
let envText = fs.readFileSync(envPath, "utf-8");

const AZURE_TOKEN_URL =
  "https://azure-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp.teamdagpenger.dp-inntekt-api";

const PROFILE_DIR = path.join(os.homedir(), ".dp-inntekt-token-profile");

init();

async function init() {
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
  });

  const page = await context.newPage();
  const tokenResponsePromise = page.waitForResponse(
    (res) => res.url().includes("/api/obo") && res.status() === 200,
    { timeout: 120_000 }
  );

  await page.goto(AZURE_TOKEN_URL);

  const tokenResponse = await tokenResponsePromise;
  const json = await tokenResponse.json();

  await context.close();

  if (!json.access_token) {
    console.error("❌ Fant ikke access_token i responsen.");
    process.exit(1);
  }

  setEnvValue("DP_INNTEKT_API_TOKEN", json.access_token);
}

function setEnvValue(key, value) {
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (envText.match(regex)) {
    envText = envText.replace(regex, `${key}=${value}`);
  } else {
    envText += `\n${key}=${value}`;
  }

  fs.writeFileSync(envPath, envText, "utf-8");
  console.info(`✅ ${key}`);
}
