/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://www.geo-fs.com",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Loose origin check — not a strong guarantee, but filters out casual abuse
    const origin = request.headers.get("Origin");
    if (origin !== "https://www.geo-fs.com") {
      return new Response("Forbidden", { status: 403 });
    }

    // Rate limit: 5 requests per IP per hour
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const key = `ratelimit:${ip}`;
    const count = parseInt((await env.RATE_LIMIT.get(key)) || "0", 10);
    if (count >= 20) {
      return new Response("Too many requests", { status: 429 });
    }
    await env.RATE_LIMIT.put(key, String(count + 1), { expirationTtl: 3600 });

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const discordRes = await fetch(env.DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return new Response(discordRes.ok ? "OK" : "Discord rejected the request", {
      status: discordRes.ok ? 200 : 502,
      headers: { "Access-Control-Allow-Origin": "https://www.geo-fs.com" },
    });
  },
};