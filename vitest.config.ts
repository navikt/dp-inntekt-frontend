import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      exclude: ["node_modules", "build"],
      reporter: ["text"], //  You can add more reporters like 'html', 'lcov', etc.
    },
    exclude: ["node_modules", "build"],
  },
});
