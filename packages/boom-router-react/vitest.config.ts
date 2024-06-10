import { defineProject } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineProject({
  plugins: [react({ jsxRuntime: "automatic" })],
  test: {
    name: "boom-router-react",
    setupFiles: "./setup-vitest.ts",
    environment: "jsdom",
  },
});
