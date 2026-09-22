import { reactRouter } from "@react-router/dev/vite";
import path from "path";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base:
    process.env.NODE_ENV === "production"
      ? "https://cdn.nav.no/teamdagpenger/dp-inntekt-frontend/client/"
      : "/",
  plugins: [reactRouter(), tsconfigPaths(), devtoolsJson()],
  build: {
    manifest: true,
    sourcemap: process.env.NODE_ENV !== "production",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
});
