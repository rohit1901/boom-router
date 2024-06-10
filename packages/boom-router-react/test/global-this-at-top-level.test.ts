/**
 * @vitest-environment node
 */

import { test, expect } from "vitest";

test("use-browser-location should work in node environment", () => {
  expect(() => import("boom-router/use-browser-location")).not.toThrow();
});

test("boom-router should work in node environment", () => {
  expect(() => import("boom-router")).not.toThrow();
});
