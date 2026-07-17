import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: false, // Set to false if you want to import global test functions like `describe`, `it`, etc.
    restoreMocks: true, // Automatically restore mocks between tests
    clearMocks: true, // Automatically clear mocks between tests
    mockReset: true, // Automatically reset mocks between tests
  },
});
