import { getRuntimeEnv } from "@/lib/cloudflare/env";

export async function verifyTurnstile(token: string, ip?: string | null) {
  const env = await getRuntimeEnv();
  const secret = env?.TURNSTILE_SECRET_KEY ?? process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { success: true, skipped: true };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);

  if (ip) {
    body.set("remoteip", ip);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const payload = (await response.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };

  return {
    success: payload.success,
    skipped: false,
    errors: payload["error-codes"] ?? [],
  };
}
