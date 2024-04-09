import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { Environment } from "@/types";

// In the edge runtime you can use Bindings that are available in your application
// (for more details see:
//    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
//    - https://developers.cloudflare.com/pages/functions/bindings/
// )
//
// KV Example:
// const myKv = getRequestContext().env.MY_KV_NAMESPACE
// await myKv.put('suffix', ' from a KV store!')
// const suffix = await myKv.get('suffix')
// responseText += suffix

export const runtime = "edge";

const app = new Hono<{ Bindings: { NEXT_PUBLIC_BASE_URL: string } }>().basePath("/api");

app.get("/hello", (c) => {
  const ENV = getRequestContext().env as Environment;
  const BASE_URL = ENV?.NEXT_PUBLIC_BASE_URL || "https://example.com";
  return c.json({
    message: "Hello Next.js!",
    base_url: BASE_URL,
    env: c?.env,
  });
});

app.get("/service", async (c) => {
  const ENV = getRequestContext().env as Environment;

  if (!ENV["HONO-PRACTICE"] || !ENV["HONO-PRACTICE"].fetch) {
    return c.json({
      message: "Hello Next.js!",
      error: "No service available",
      env: ENV,
    });
  }
  try {
    const response = await ENV["HONO-PRACTICE"]?.fetch("https://example.com/test", { method: "POST" });
    const test = await response.json();
    return c.json({
      message: "Hello Next.js!",
      text: JSON.stringify(test),
      env: ENV,
    });
  } catch (e) {
    return c.json({
      message: "Hello Next.js!",
      error: "No response from service",
      env: ENV,
    });
  }
});

export const GET = handle(app);
export const POST = handle(app);
