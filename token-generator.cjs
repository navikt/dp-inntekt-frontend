const { execFile } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { createInterface } = require("node:readline/promises");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);
const envPath = path.resolve(__dirname, ".env");
let envText = fs.readFileSync(envPath, "utf-8");

const AZURE_TOKEN_URL =
  "https://azure-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp.teamdagpenger.dp-inntekt-api";

init();

async function init() {
  const browserCommand =
    process.platform === "darwin"
      ? ["open", [AZURE_TOKEN_URL]]
      : process.platform === "win32"
        ? ["cmd", ["/c", "start", "", AZURE_TOKEN_URL]]
        : ["xdg-open", [AZURE_TOKEN_URL]];
  await execFileAsync(...browserCommand);

  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const accessToken = await prompt.question("Lim inn access_token fra nettleseren: ");
  prompt.close();

  if (!accessToken.trim()) {
    console.error("❌ Fant ikke access_token.");
    process.exitCode = 1;
    return;
  }

  setEnvValue("DP_INNTEKT_API_TOKEN", accessToken.trim());
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
