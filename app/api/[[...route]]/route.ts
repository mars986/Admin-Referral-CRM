import { Hono } from "hono";
import { handle } from "hono/vercel";
import Stripe from "stripe";
import { z } from "zod";
import { getRuntimeEnv, getServerConfig } from "@/lib/cloudflare/env";
import { getVariantPrice } from "@/lib/cart";
import {
  createFormSubmission,
  createLead,
  createNote,
  createOrder,
  createReferral,
  createTask,
  deleteLead,
  exportLeadsToCsv,
  getDashboardSnapshot,
  getLead,
  getPipeline,
  getReportsSnapshot,
  handleStripePurchase,
  listActivityLogs,
  listContacts,
  listEmailLogs,
  listEmailTemplates,
  listFiles,
  listLeads,
  listOrders,
  listReferrals,
  listTasks,
  movePipelineLead,
  resendEmailLog,
  sendTestEmail,
  updateContact,
  updateEmailTemplate,
  updateLead,
  updateShipment,
  updateTask,
  uploadFile,
} from "@/lib/crm/service";
import {
  createPayout,
  createReferralCode,
  createReferralLead,
  createReferralPartner,
  exportReferralReportCsv,
  getFraudReview,
  getPartnerPortalSnapshot,
  getReferralAdminDashboard,
  listCommissions,
  listPayouts,
  listReferralAuditLogs,
  listReferralCodes,
  listReferralConversions,
  listReferralLeads,
  listReferralPartners,
  recordReferralClick,
  updateCommission,
  updatePayout,
  updateReferralCode,
  updateReferralLead,
  updateReferralPartner,
  validateReferralCode,
} from "@/lib/referrals/service";
import {
  REFERRAL_ACCESS_DISCOUNT_PERCENT,
  REFERRAL_ACCESS_DISCOUNT_RATE,
} from "@/lib/referrals/constants";
import { products } from "@/lib/site-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api");

const checkoutSessionSchema = z.object({
  referralCode: z.string().trim().min(1),
  items: z.array(
    z.object({
      productSlug: z.string().trim().min(1),
      variantLabel: z.string().trim().min(1),
      quantity: z.coerce.number().int().min(1).max(20).default(1),
    }),
  ).min(1).max(20),
});

type CheckoutLineItem = {
  quantity: number;
  price_data: {
    currency: "usd";
    unit_amount: number;
    product_data: {
      name: string;
      description: string;
      images?: string[];
      metadata: Record<string, string>;
    };
  };
};

type StripeCheckoutSessionResponse = {
  id?: string;
  url?: string;
  error?: {
    message?: string;
  };
};

function cents(value: number) {
  return Math.max(0, Math.round(value * 100));
}

function dollarsFromMetadata(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getActorEmail(request: Request) {
  return (
    request.headers.get("cf-access-authenticated-user-email") ??
    request.headers.get("x-admin-email")
  );
}

function appendStripeCheckoutParams(
  params: URLSearchParams,
  lineItems: CheckoutLineItem[],
  metadata: Stripe.MetadataParam,
  config: Awaited<ReturnType<typeof getServerConfig>>,
) {
  params.set("mode", "payment");
  params.set("success_url", `${config.appUrl}/cart?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${config.appUrl}/cart?checkout=cancelled`);
  params.set("phone_number_collection[enabled]", "true");
  params.set("shipping_address_collection[allowed_countries][0]", "US");
  params.set(
    "custom_text[submit][message]",
    `Referral Access ${REFERRAL_ACCESS_DISCOUNT_PERCENT}% discount has been applied.`,
  );

  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(`metadata[${key}]`, String(value));
      params.set(`payment_intent_data[metadata][${key}]`, String(value));
    }
  });

  lineItems.forEach((item, index) => {
    const prefix = `line_items[${index}]`;
    params.set(`${prefix}[quantity]`, String(item.quantity));
    params.set(`${prefix}[price_data][currency]`, item.price_data.currency);
    params.set(`${prefix}[price_data][unit_amount]`, String(item.price_data.unit_amount));
    params.set(`${prefix}[price_data][product_data][name]`, item.price_data.product_data.name);
    params.set(`${prefix}[price_data][product_data][description]`, item.price_data.product_data.description);

    item.price_data.product_data.images?.forEach((image, imageIndex) => {
      params.set(`${prefix}[price_data][product_data][images][${imageIndex}]`, image);
    });

    Object.entries(item.price_data.product_data.metadata).forEach(([key, value]) => {
      params.set(`${prefix}[price_data][product_data][metadata][${key}]`, value);
    });
  });
}

app.use("/admin/*", async (c, next) => {
  const accessEnforced = String(process.env.ACCESS_ENFORCED ?? "false") === "true";
  const accessEmail = getActorEmail(c.req.raw);

  if (accessEnforced && !accessEmail) {
    return jsonError("Admin access required", 403);
  }
  await next();
});

function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function parseBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return request.json();
  }
  if (contentType.includes("multipart/form-data")) {
    return request.formData();
  }
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const data = await request.formData();
    return Object.fromEntries(data.entries());
  }
  return {};
}

app.get("/dashboard", async (c) => c.json({ ok: true, data: await getDashboardSnapshot() }));
app.get("/admin/dashboard", async (c) => c.json({ ok: true, data: await getReferralAdminDashboard() }));
app.get("/admin/partners", async (c) => c.json({ ok: true, data: await listReferralPartners() }));
app.post("/admin/partners", async (c) =>
  c.json({
    ok: true,
    data: await createReferralPartner(await parseBody(c.req.raw), getActorEmail(c.req.raw)),
  }),
);
app.patch("/admin/partners/:id", async (c) => {
  const data = await updateReferralPartner(
    c.req.param("id"),
    await parseBody(c.req.raw),
    getActorEmail(c.req.raw),
  );
  if (!data) {
    return jsonError("Partner not found", 404);
  }
  return c.json({ ok: true, data });
});

app.get("/admin/referral-codes", async (c) => c.json({ ok: true, data: await listReferralCodes() }));
app.post("/admin/referral-codes", async (c) =>
  c.json({
    ok: true,
    data: await createReferralCode(await parseBody(c.req.raw), getActorEmail(c.req.raw)),
  }),
);
app.patch("/admin/referral-codes/:id", async (c) => {
  const data = await updateReferralCode(
    c.req.param("id"),
    await parseBody(c.req.raw),
    getActorEmail(c.req.raw),
  );
  if (!data) {
    return jsonError("Referral code not found", 404);
  }
  return c.json({ ok: true, data });
});

app.post("/referral/validate", async (c) => {
  const data = await validateReferralCode(await parseBody(c.req.raw), {
    ip: c.req.header("cf-connecting-ip") ?? null,
    userAgent: c.req.header("user-agent") ?? null,
  });

  if (!data.ok) {
    return jsonError(data.error ?? "Please enter a valid referral code to continue.", 422);
  }

  return c.json(data);
});

app.post("/referral/click", async (c) => {
  const data = await recordReferralClick(await parseBody(c.req.raw), {
    ip: c.req.header("cf-connecting-ip") ?? null,
    userAgent: c.req.header("user-agent") ?? null,
  });
  if (!data.ok) {
    return jsonError(data.error ?? "Invalid referral code", 422);
  }
  return c.json(data);
});

app.post("/referral/lead", async (c) => {
  const data = await createReferralLead(await parseBody(c.req.raw), {
    ip: c.req.header("cf-connecting-ip") ?? null,
    userAgent: c.req.header("user-agent") ?? null,
  });
  if (!data.ok) {
    return jsonError(data.error ?? "Unable to capture referral lead", 422);
  }
  return c.json(data);
});

app.post("/referral/partner-portal", async (c) => {
  const result = await getPartnerPortalSnapshot(await parseBody(c.req.raw));
  if (!result.ok) {
    return jsonError(result.error ?? "Partner access could not be verified.", 403);
  }
  return c.json(result);
});

app.post("/checkout/session", async (c) => {
  const env = await getRuntimeEnv();
  const stripeSecret = env?.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY;

  if (!stripeSecret) {
    return jsonError("Stripe checkout is not configured yet.", 500);
  }

  const payload = checkoutSessionSchema.parse(await parseBody(c.req.raw));
  const referral = await validateReferralCode(
    {
      code: payload.referralCode,
      source_page: "/cart",
    },
    {
      ip: c.req.header("cf-connecting-ip") ?? null,
      userAgent: c.req.header("user-agent") ?? null,
    },
  );

  if (!referral.ok || !referral.data?.code) {
    return jsonError(referral.error ?? "Please enter a valid referral code to continue.", 422);
  }

  const lineItems: CheckoutLineItem[] = [];
  let subtotalCents = 0;
  let totalCents = 0;
  const productNames: string[] = [];

  for (const item of payload.items) {
    const product = products.find((candidate) => candidate.slug === item.productSlug);
    const variant = product?.variants?.find((candidate) => candidate.label === item.variantLabel);

    if (!product || !variant) {
      return jsonError("One or more cart items are no longer available.", 422);
    }

    const originalUnitAmount = cents(getVariantPrice(variant.price));
    const discountedUnitAmount = Math.max(
      50,
      Math.round(originalUnitAmount * (1 - REFERRAL_ACCESS_DISCOUNT_RATE)),
    );
    subtotalCents += originalUnitAmount * item.quantity;
    totalCents += discountedUnitAmount * item.quantity;
    productNames.push(`${product.name} ${variant.label}`);

    lineItems.push({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: discountedUnitAmount,
        product_data: {
          name: product.name,
          description: `${variant.label} - Referral Access ${REFERRAL_ACCESS_DISCOUNT_PERCENT}% off applied`,
          images: product.imageSrc ? [new URL(product.imageSrc, (await getServerConfig()).appUrl).toString()] : undefined,
          metadata: {
            product_slug: product.slug,
            variant_label: variant.label,
            original_unit_amount: String(originalUnitAmount),
          },
        },
      },
    });
  }

  const config = await getServerConfig();
  const metadata: Stripe.MetadataParam = {
    referral_code: referral.data.code,
    discount_percent: String(REFERRAL_ACCESS_DISCOUNT_PERCENT),
    subtotal: (subtotalCents / 100).toFixed(2),
    discount_amount: ((subtotalCents - totalCents) / 100).toFixed(2),
    product_name: productNames.join(", ").slice(0, 480),
    source_page: "/cart",
    checkout_session_managed: "true",
  };

  const stripeParams = new URLSearchParams();
  appendStripeCheckoutParams(stripeParams, lineItems, metadata, config);
  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: stripeParams,
    signal: AbortSignal.timeout(20000),
  });
  const session = (await stripeResponse.json()) as StripeCheckoutSessionResponse;

  if (!stripeResponse.ok || !session.url) {
    return jsonError(session.error?.message ?? "Stripe checkout session could not be created.", 502);
  }

  return c.json({ ok: true, data: { url: session.url } });
});

app.get("/admin/leads", async (c) => c.json({ ok: true, data: await listReferralLeads() }));
app.patch("/admin/leads/:id", async (c) => {
  const data = await updateReferralLead(
    c.req.param("id"),
    await parseBody(c.req.raw),
    getActorEmail(c.req.raw),
  );
  if (!data) {
    return jsonError("Referral lead not found", 404);
  }
  return c.json({ ok: true, data });
});

app.get("/admin/conversions", async (c) => c.json({ ok: true, data: await listReferralConversions() }));
app.get("/admin/commissions", async (c) => c.json({ ok: true, data: await listCommissions() }));
app.patch("/admin/commissions/:id", async (c) => {
  const data = await updateCommission(
    c.req.param("id"),
    await parseBody(c.req.raw),
    getActorEmail(c.req.raw),
  );
  if (!data) {
    return jsonError("Commission not found", 404);
  }
  return c.json({ ok: true, data });
});

app.get("/admin/payouts", async (c) => c.json({ ok: true, data: await listPayouts() }));
app.post("/admin/payouts", async (c) =>
  c.json({
    ok: true,
    data: await createPayout(await parseBody(c.req.raw), getActorEmail(c.req.raw)),
  }),
);
app.patch("/admin/payouts/:id", async (c) => {
  const data = await updatePayout(
    c.req.param("id"),
    await parseBody(c.req.raw),
    getActorEmail(c.req.raw),
  );
  if (!data) {
    return jsonError("Payout not found", 404);
  }
  return c.json({ ok: true, data });
});

app.get("/admin/fraud", async (c) => c.json({ ok: true, data: await getFraudReview() }));
app.get("/admin/reports/export", async () => {
  const csv = await exportReferralReportCsv();
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="apex-wellness-referrals.csv"',
    },
  });
});
app.get("/admin/audit-logs", async (c) => c.json({ ok: true, data: await listReferralAuditLogs() }));

app.get("/leads", async (c) => {
  const search = c.req.query("search") ?? "";
  const status = c.req.query("status") ?? "";
  const source = c.req.query("source") ?? "";
  const productInterest = c.req.query("product_interest") ?? "";
  const sort = c.req.query("sort") as "created_at" | "last_contacted_at" | "next_follow_up_at" | undefined;
  const direction = c.req.query("direction") as "asc" | "desc" | undefined;
  return c.json({
    ok: true,
    data: await listLeads({ search, status, source, productInterest, sort, direction }),
  });
});

app.post("/leads", async (c) => {
  const body = await parseBody(c.req.raw);
  return c.json({ ok: true, data: await createLead(body) });
});

app.get("/leads/:id", async (c) => {
  const data = await getLead(c.req.param("id"));
  if (!data) {
    return jsonError("Lead not found", 404);
  }
  return c.json({ ok: true, data });
});

app.patch("/leads/:id", async (c) => {
  const data = await updateLead(c.req.param("id") ?? "", await parseBody(c.req.raw));
  if (!data) {
    return jsonError("Lead not found", 404);
  }
  return c.json({ ok: true, data });
});

app.delete("/leads/:id", async (c) => c.json(await deleteLead(c.req.param("id") ?? "")));

app.get("/contacts", async () => new Response(JSON.stringify({ ok: true, data: await listContacts() }), { headers: { "Content-Type": "application/json" } }));
app.patch("/contacts/:id", async (c) => {
  const data = await updateContact(c.req.param("id") ?? "", await parseBody(c.req.raw));
  if (!data) {
    return jsonError("Contact not found", 404);
  }
  return c.json({ ok: true, data });
});

app.get("/pipeline", async () => new Response(JSON.stringify({ ok: true, data: await getPipeline() }), { headers: { "Content-Type": "application/json" } }));
app.post("/pipeline/:leadId/move", async (c) => {
  const body = z.object({ stageId: z.string().min(1) }).parse(await parseBody(c.req.raw));
  const data = await movePipelineLead(c.req.param("leadId") ?? "", body.stageId);
  if (!data) {
    return jsonError("Pipeline update failed", 404);
  }
  return c.json({ ok: true, data });
});

app.get("/orders", async () => new Response(JSON.stringify({ ok: true, data: await listOrders() }), { headers: { "Content-Type": "application/json" } }));
app.post("/orders", async (c) => c.json({ ok: true, data: await createOrder(await parseBody(c.req.raw)) }));
app.patch("/orders/:id/shipment", async (c) => {
  const data = await updateShipment(c.req.param("id") ?? "", await parseBody(c.req.raw));
  if (!data) {
    return jsonError("Order not found", 404);
  }
  return c.json({ ok: true, data });
});

app.get("/tasks", async () => new Response(JSON.stringify({ ok: true, data: await listTasks() }), { headers: { "Content-Type": "application/json" } }));
app.post("/tasks", async (c) => c.json({ ok: true, data: await createTask(await parseBody(c.req.raw)) }));
app.patch("/tasks/:id", async (c) => {
  const data = await updateTask(c.req.param("id") ?? "", await parseBody(c.req.raw));
  if (!data) {
    return jsonError("Task not found", 404);
  }
  return c.json({ ok: true, data });
});

app.post("/notes", async (c) => c.json({ ok: true, data: await createNote(await parseBody(c.req.raw)) }));
app.get("/activity-logs", async () => new Response(JSON.stringify({ ok: true, data: await listActivityLogs() }), { headers: { "Content-Type": "application/json" } }));

app.get("/referrals", async () => new Response(JSON.stringify({ ok: true, data: await listReferrals() }), { headers: { "Content-Type": "application/json" } }));
app.post("/referrals", async (c) => c.json({ ok: true, data: await createReferral(await parseBody(c.req.raw)) }));

app.post("/forms/submit", async (c) => {
  const body = await parseBody(c.req.raw);
  const metadata =
    body instanceof FormData
      ? Object.fromEntries(
          Array.from(body.entries()).map(([key, value]) => [key, typeof value === "string" ? value : value.name]),
        )
      : body;

  const result = await createFormSubmission(metadata, {
    ip: c.req.header("cf-connecting-ip") ?? null,
    userAgent: c.req.header("user-agent") ?? null,
  });

  if (!result.ok) {
    return jsonError(result.error ?? "Form submission failed", result.status ?? 400);
  }

  return c.json({ ok: true, data: result.lead });
});

app.get("/files", async () => new Response(JSON.stringify({ ok: true, data: await listFiles() }), { headers: { "Content-Type": "application/json" } }));
app.post("/files", async (c) => {
  const data = await c.req.formData();
  const file = data.get("file");
  const ownerType = String(data.get("ownerType") ?? "");
  const ownerId = String(data.get("ownerId") ?? "");

  if (!(file instanceof File)) {
    return jsonError("File upload required");
  }

  const result = await uploadFile({
    ownerType,
    ownerId,
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    bytes: await file.arrayBuffer(),
  });

  if (!result.ok) {
    return jsonError(result.error ?? "File upload failed", 500);
  }

  return c.json({ ok: true, data: result });
});

app.get("/reports", async () => new Response(JSON.stringify({ ok: true, data: await getReportsSnapshot() }), { headers: { "Content-Type": "application/json" } }));

app.get("/email-templates", async () => new Response(JSON.stringify({ ok: true, data: await listEmailTemplates() }), { headers: { "Content-Type": "application/json" } }));
app.patch("/email-templates/:id", async (c) => {
  const data = await updateEmailTemplate(c.req.param("id"), await parseBody(c.req.raw));
  if (!data) {
    return jsonError("Template not found", 404);
  }
  return c.json({ ok: true, data });
});

app.get("/email-logs", async () => new Response(JSON.stringify({ ok: true, data: await listEmailLogs() }), { headers: { "Content-Type": "application/json" } }));
app.post("/email-logs/:id/resend", async (c) =>
  c.json({ ok: true, data: await resendEmailLog(c.req.param("id") ?? "") }),
);
app.post("/emails/test", async (c) => {
  const body = z.object({ recipientEmail: z.email() }).parse(await parseBody(c.req.raw));
  return c.json({ ok: true, data: await sendTestEmail(body.recipientEmail) });
});

app.get("/export/leads.csv", async () => {
  const csv = await exportLeadsToCsv();
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="apex-wellness-leads.csv"',
    },
  });
});

app.post("/stripe/webhook", async (c) => {
  const env = await getRuntimeEnv();
  const signingSecret = env?.STRIPE_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecret = env?.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY;

  if (!stripeSecret || !signingSecret) {
    return jsonError("Stripe is not configured", 500);
  }

  const stripe = new Stripe(stripeSecret);
  const signature = c.req.header("stripe-signature");
  if (!signature) {
    return jsonError("Missing Stripe signature", 400);
  }

  const payload = await c.req.raw.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, signingSecret);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid Stripe signature", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};
    const email = session.customer_details?.email ?? session.customer_email ?? "";

    if (session.payment_status === "paid" && email) {
      await handleStripePurchase({
        paymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.id,
        email,
        firstName: metadata.first_name ?? "Customer",
        lastName: metadata.last_name ?? "",
        phone: session.customer_details?.phone ?? "",
        productName: metadata.product_name ?? "Apex Wellness Pre-Order",
        subtotal: dollarsFromMetadata(
          metadata.subtotal,
          typeof session.amount_subtotal === "number" ? session.amount_subtotal / 100 : 0,
        ),
        total: typeof session.amount_total === "number" ? session.amount_total / 100 : 0,
        referralCode: metadata.referral_code ?? null,
        sourcePage: metadata.source_page ?? "/cart",
      });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata ?? {};

    if (metadata.checkout_session_managed === "true") {
      return c.json({ ok: true });
    }

    await handleStripePurchase({
      paymentIntentId: paymentIntent.id,
      email: paymentIntent.receipt_email ?? metadata.email ?? "",
      firstName: metadata.first_name ?? "Customer",
      lastName: metadata.last_name ?? "",
      phone: metadata.phone ?? "",
      productName: metadata.product_name ?? "Order",
      subtotal: paymentIntent.amount_received / 100,
      total: paymentIntent.amount_received / 100,
      referralCode: metadata.referral_code ?? null,
      sourcePage: metadata.source_page ?? null,
    });
  }

  return c.json({ ok: true });
});

app.onError((error) => {
  if (error instanceof z.ZodError) {
    return jsonError(error.issues.map((issue) => issue.message).join(", "), 422);
  }
  return jsonError(error.message || "Unexpected error", 500);
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
