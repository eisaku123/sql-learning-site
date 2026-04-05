import Stripe from "stripe";
import { prisma } from "@/lib/db";

export async function getStripeMode(): Promise<"test" | "live"> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "stripe_mode" } });
  return setting?.value === "live" ? "live" : "test";
}

export async function getStripeClient(): Promise<Stripe> {
  const mode = await getStripeMode();
  const key =
    mode === "live"
      ? process.env.STRIPE_SECRET_KEY_LIVE!
      : process.env.STRIPE_SECRET_KEY_TEST!;
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

export async function getStripePriceId(): Promise<string> {
  const mode = await getStripeMode();
  return mode === "live"
    ? process.env.STRIPE_PRICE_ID_LIVE!
    : process.env.STRIPE_PRICE_ID_TEST!;
}

export async function getStripeWebhookSecret(): Promise<string> {
  const mode = await getStripeMode();
  return mode === "live"
    ? process.env.STRIPE_WEBHOOK_SECRET_LIVE!
    : process.env.STRIPE_WEBHOOK_SECRET_TEST!;
}
