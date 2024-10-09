import { defineConfig } from "cypress";

export default defineConfig({
  retries: 3,
  e2e: {
    baseUrl: "http://localhost:5173/",
    setupNodeEvents(on, config) {},
    env: {
      backendUrl: "http://localhost:8000/",
    },
  },
});
