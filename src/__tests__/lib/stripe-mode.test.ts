/**
 * @jest-environment node
 */
import { getStripeKeyMode, isProductionRuntime, prodStripeMisconfig } from "@/lib/stripe-mode";

const ORIGINAL = { key: process.env.STRIPE_SECRET_KEY, env: process.env.VERCEL_ENV };

afterEach(() => {
  process.env.STRIPE_SECRET_KEY = ORIGINAL.key;
  process.env.VERCEL_ENV = ORIGINAL.env;
});

test("classifies the key by prefix", () => {
  process.env.STRIPE_SECRET_KEY = "sk_live_abc";
  expect(getStripeKeyMode()).toBe("live");
  process.env.STRIPE_SECRET_KEY = "sk_test_abc";
  expect(getStripeKeyMode()).toBe("test");
  delete process.env.STRIPE_SECRET_KEY;
  expect(getStripeKeyMode()).toBe("unset");
});

test("isProductionRuntime tracks VERCEL_ENV", () => {
  process.env.VERCEL_ENV = "production";
  expect(isProductionRuntime()).toBe(true);
  process.env.VERCEL_ENV = "preview";
  expect(isProductionRuntime()).toBe(false);
});

test("flags a test-mode key on a production deployment", () => {
  process.env.VERCEL_ENV = "production";
  process.env.STRIPE_SECRET_KEY = "sk_test_abc";
  expect(prodStripeMisconfig()).toMatch(/TEST-mode/);

  process.env.STRIPE_SECRET_KEY = "sk_live_abc";
  expect(prodStripeMisconfig()).toBeNull();

  delete process.env.STRIPE_SECRET_KEY;
  expect(prodStripeMisconfig()).toMatch(/no STRIPE_SECRET_KEY/);
});

test("never flags outside production", () => {
  process.env.VERCEL_ENV = "preview";
  process.env.STRIPE_SECRET_KEY = "sk_test_abc";
  expect(prodStripeMisconfig()).toBeNull();
});
